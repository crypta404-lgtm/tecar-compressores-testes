# Publicação oficial da TecAr

Domínio canônico: https://www.tecarcompressores.com.br

## Antes da troca de DNS
1. Salvar/exportar todos os registros DNS atuais.
2. Não remover MX, SPF, DKIM ou DMARC usados pelos e-mails da TecAr.
3. Publicar este projeto primeiro em um endereço temporário do Cloudflare Workers.
4. Testar todas as páginas, WhatsApp, vídeos, formulários e mobile.

## Build

    bun install --frozen-lockfile
    bun run build

## Primeiro deploy no Cloudflare
Autentique a conta corporativa no Wrangler e use:

    npx wrangler deploy --config wrangler.tecar.jsonc

## Troca do domínio
No Cloudflare Worker, adicionar os custom domains:
- www.tecarcompressores.com.br
- tecarcompressores.com.br

Escolher www como principal e redirecionar o domínio sem www para ele.

## Depois da troca
- Confirmar HTTPS.
- Confirmar que e-mail continua enviando e recebendo.
- Testar sitemap.xml e robots.txt.
- Testar os redirects antigos:
  - /a-empresa -> /empresa
  - /blog-list -> /conteudo
  - /blog -> /conteudo
  - artigo antigo de vazamentos -> /conteudo
- Enviar o sitemap ao Google Search Console.
