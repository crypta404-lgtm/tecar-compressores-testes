import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { applySecurityHeaders } from "./lib/security-headers.server";
import { handleAutoatendimento } from "./lib/autoatendimento.server";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env?: unknown, ctx?: unknown) {
    // Vercel supplies secrets through the Node environment; retain explicit env for portability.
    const runtimeEnv = { OPENAI_API_KEY: process.env.OPENAI_API_KEY, ...(env && typeof env === "object" ? env : {}) };
    const method = request.method.toUpperCase();
    const url = new URL(request.url);
    if (method === "OPTIONS") {
      return applySecurityHeaders(new Response(null, { status: 204, headers: { Allow: "GET, HEAD, POST, OPTIONS" } }));
    }
    if (method === "GET" && url.pathname === "/api/autoatendimento/status") {
      const active = Boolean(runtimeEnv.OPENAI_API_KEY);
      return applySecurityHeaders(new Response(JSON.stringify({ active }), { status: 200, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } }));
    }
    if (method === "POST" && url.pathname === "/api/autoatendimento") {
      return applySecurityHeaders(await handleAutoatendimento(request, runtimeEnv));
    }
    if (method !== "GET" && method !== "HEAD") {
      return applySecurityHeaders(new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD, OPTIONS", "Content-Type": "text/plain; charset=utf-8" } }));
    }
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return applySecurityHeaders(await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return applySecurityHeaders(
        new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      );
    }
  },
};
