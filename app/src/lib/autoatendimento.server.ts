type AutoRequest = {
  brand?: string;
  model?: string;
  symptom?: string;
  context?: string;
  readings?: string;
  images?: string[];
};

type Env = { OPENAI_API_KEY?: string };

const LIMIT_WINDOW_MS = 5 * 60 * 1000;
const LIMIT_COUNT = 4;
const buckets = new Map<string, { count: number; resetAt: number }>();

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function clean(value: unknown, max: number) {
  return typeof value === "string"
    ? value.replace(/[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]/g, " ").trim().slice(0, max)
    : "";
}

function allowedOrigin(request: Request) {
  const origin = request.headers.get("Origin");
  if (!origin) return true;
  try { return new URL(origin).host === new URL(request.url).host; }
  catch { return false; }
}

function takeRateSlot(request: Request) {
  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = buckets.get(ip);
  if (!current || now >= current.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + LIMIT_WINDOW_MS });
    return true;
  }
  if (current.count >= LIMIT_COUNT) return false;
  current.count += 1;
  return true;
}

function extractOutputText(payload: any) {
  if (typeof payload?.output_text === "string") return payload.output_text;
  const chunks: string[] = [];
  for (const item of payload?.output ?? []) {
    if (item?.type !== "message") continue;
    for (const part of item?.content ?? []) {
      if (part?.type === "output_text" && typeof part?.text === "string") chunks.push(part.text);
    }
  }
  return chunks.join("\\n");
}

const SYSTEM = `Você é o Autoatendimento TecAr, uma triagem técnica comercial para sistemas industriais de ar comprimido.

OBJETIVO
- Entender linguagem natural, inclusive descrições incompletas, erros de digitação e fotos.
- Identificar, quando houver evidência suficiente, marca/família/modelo e o sintoma provável.
- Pesquisar na web documentação pública do fabricante, manuais, boletins e páginas técnicas. Priorize SEMPRE fontes oficiais do fabricante e tecarcompressores.com.br. Não trate fóruns como manual.
- Entregar uma orientação curta e útil, deliberadamente rasa: hipótese provável, checagens externas de operador e próximo passo. Esta ferramenta é comercial e NÃO substitui diagnóstico técnico presencial.

REGRAS DE SEGURANÇA
- Nunca ensine desmontagem interna, abertura de vasos/linhas pressurizadas, intervenção elétrica energizada, retirada de proteções, bypass de intertravamentos, regulagem de válvula de segurança, alteração de proteções do controlador, trabalho com refrigerante ou reparo interno de elemento compressor.
- Nunca mande o usuário tocar em parte quente, móvel, energizada ou pressurizada.
- Para qualquer ação que envolva abrir carenagem técnica, drenar pressão, óleo, filtros, componentes elétricos ou mecânicos, diga explicitamente que a máquina deve estar parada, isolada, bloqueada, despressurizada e fria, seguindo o manual e por pessoa treinada.
- Se houver fumaça, cheiro de queimado, faísca, vazamento de óleo relevante, ruído metálico, sobretemperatura persistente, vibração severa, pressão anormal, falha de segurança, dano aparente ou dúvida sobre isolamento: recomende parar e acionar técnico.
- Não dê instrução passo a passo de reparo. Prefira verificação externa, confirmação no manual e encaminhamento técnico.

COMPORTAMENTO
- Não use respostas prontas baseadas em correspondência exata. Interprete semanticamente o relato e as imagens.
- Se o modelo não puder ser identificado com confiança, diga isso e faça 1 a 3 perguntas curtas que realmente reduzam a incerteza.
- Se uma foto parecer placa de identificação, use os dados visíveis como pista, mas não invente caracteres ilegíveis.
- Se uma orientação depender de um manual específico que você não encontrou, não invente torque, quantidade de óleo, intervalo, pressão, temperatura ou código de alarme.
- Resposta em português do Brasil, objetiva e sem parede de texto.`;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    severity: { type: "string", enum: ["baixo", "atencao", "parar"] },
    headline: { type: "string" },
    equipment: {
      type: "object", additionalProperties: false,
      properties: {
        brand: { type: "string" }, model: { type: "string" },
        confidence: { type: "string", enum: ["baixa", "media", "alta"] }, evidence: { type: "string" },
      },
      required: ["brand", "model", "confidence", "evidence"],
    },
    likely_causes: {
      type: "array", maxItems: 3,
      items: { type: "object", additionalProperties: false, properties: {
        title: { type: "string" }, reason: { type: "string" }, confidence: { type: "string", enum: ["baixa", "media", "alta"] },
      }, required: ["title", "reason", "confidence"] },
    },
    safe_checks: {
      type: "array", maxItems: 5,
      items: { type: "object", additionalProperties: false, properties: { title: { type: "string" }, instruction: { type: "string" } }, required: ["title", "instruction"] },
    },
    stop_conditions: { type: "array", maxItems: 5, items: { type: "string" } },
    recommendation: { type: "string" },
    service_route: { type: "string", enum: ["manutencao", "engenharia", "pecas", "monitoramento", "orientacao"] },
    follow_up_questions: { type: "array", maxItems: 3, items: { type: "string" } },
    sources: {
      type: "array", maxItems: 5,
      items: { type: "object", additionalProperties: false, properties: { title: { type: "string" }, url: { type: "string" }, note: { type: "string" } }, required: ["title", "url", "note"] },
    },
    disclaimer: { type: "string" },
  },
  required: ["severity", "headline", "equipment", "likely_causes", "safe_checks", "stop_conditions", "recommendation", "service_route", "follow_up_questions", "sources", "disclaimer"],
};

export async function handleAutoatendimento(request: Request, rawEnv: unknown) {
  if (!allowedOrigin(request)) return json({ error: "Origem não permitida." }, 403);
  if (!takeRateSlot(request)) return json({ error: "Muitas análises em sequência. Aguarde alguns minutos e tente novamente." }, 429);
  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.includes("application/json")) return json({ error: "Formato de envio inválido." }, 415);
  const length = Number(request.headers.get("Content-Length") || "0");
  if (length > 5_000_000) return json({ error: "As imagens ficaram muito grandes. Envie no máximo duas fotos mais leves." }, 413);

  let body: AutoRequest;
  try { body = (await request.json()) as AutoRequest; }
  catch { return json({ error: "Não foi possível ler as informações enviadas." }, 400); }

  const symptom = clean(body.symptom, 2500);
  if (symptom.length < 10) return json({ error: "Descreva um pouco melhor o que está acontecendo com o equipamento." }, 400);
  const brand = clean(body.brand, 100);
  const model = clean(body.model, 150);
  const context = clean(body.context, 1600);
  const readings = clean(body.readings, 900);
  const images = Array.isArray(body.images) ? body.images.slice(0, 2) : [];
  const validImages = images.filter((value) => typeof value === "string" && /^data:image\/(jpeg|png|webp);base64,/i.test(value) && value.length < 2_000_000);
  if (images.length !== validImages.length) return json({ error: "Use somente imagens JPG, PNG ou WebP leves." }, 400);

  const apiKey = (rawEnv as Env)?.OPENAI_API_KEY;
  if (!apiKey) return json({ error: "O Autoatendimento está pronto, mas a IA ainda não foi ativada no ambiente de produção." }, 503);

  const inputContent: any[] = [{ type: "input_text", text: [
    `Marca informada: ${brand || "não informada"}`,
    `Modelo informado: ${model || "não informado"}`,
    `Relato principal: ${symptom}`,
    `Quando acontece / contexto: ${context || "não informado"}`,
    `Leituras, alarmes ou dados: ${readings || "não informados"}`,
  ].join("\\n") }];
  for (const image of validImages) inputContent.push({ type: "input_image", image_url: image, detail: "auto" });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 35_000);
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-5.6-terra",
        reasoning: { effort: "medium" },
        instructions: SYSTEM,
        input: [{ role: "user", content: inputContent }],
        tools: [{ type: "web_search" }],
        tool_choice: "auto",
        max_output_tokens: 1800,
        text: { format: { type: "json_schema", name: "tecar_autoatendimento", strict: true, schema: SCHEMA } },
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      const detail = await response.text();
      console.error("OpenAI autoatendimento error", response.status, detail.slice(0, 800));
      return json({ error: "A análise técnica está temporariamente indisponível. Tente novamente em instantes." }, 502);
    }
    const payload = await response.json();
    const output = extractOutputText(payload);
    if (!output) return json({ error: "A análise não retornou um resultado utilizável. Tente descrever o sintoma com mais detalhes." }, 502);
    try { return json({ result: JSON.parse(output) }); }
    catch {
      console.error("Invalid structured autoatendimento output", output.slice(0, 1200));
      return json({ error: "A análise retornou um formato inesperado. Tente novamente." }, 502);
    }
  } catch (error) {
    console.error("Autoatendimento request failed", error);
    return json({ error: "A análise demorou mais do que o esperado. Tente novamente." }, 504);
  } finally { clearTimeout(timeout); }
}
