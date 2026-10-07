# TecAr Compressores — site de testes

Cópia independente do site público, baseada no commit a756b08.

- Site de testes: https://tecar-compressores-testes.vercel.app
- Projeto Vercel: tecar-compressores-testes (cry-pta)
- Branch de trabalho: feat/test-site
- Aplicação: app/

## Desenvolvimento

Execute em app/: bun install --frozen-lockfile e bun run dev.
Validação: bun run typecheck e bun run build.

Este repositório e a publicação de testes são separados do site principal.
As credenciais e os vínculos locais de publicação não são versionados.

## Imagens e cache

Tudo em `app/public/assets/` é servido pela Vercel com `Cache-Control: public, max-age=31536000, immutable`
(regra do build para a pasta `/assets/`). O navegador e a CDN guardam esses arquivos por um ano sem revalidar.

Nunca sobrescreva uma imagem já publicada com o mesmo nome: crie um arquivo novo (ex.: `-v2`, `-v3`) e
atualize as referências. Senão quem já visitou o site continua vendo a versão antiga.
