# Tecar Compressores — site público

Projeto original: tecar-compressores-lab.higgsfield.app. Recuperado em 29/09/2026, commit c860ed9. Código e histórico preservados; alterações somente em feat/vercel-migration.

## Desenvolvimento
Node.js 22 e Bun. Na pasta app, execute bun install --frozen-lockfile e bun run dev.

## Verificação
Na pasta app: bun run typecheck e bun run build.

## Vercel
Importar pela conta crypta404-lgtm. Root Directory: app. Framework: TanStack Start. Node.js: 22. O adaptador Nitro gera a saída Vercel. Para publicar sem merge em main, selecionar feat/vercel-migration como branch de produção.

O autoatendimento precisa de OPENAI_API_KEY no servidor. Configure a variável pelo painel da Vercel, nunca no Git. Sem a chave, o status retorna active: false. Nenhuma credencial do Higgsfield foi exportada. O limite de solicitações herdado é local à instância, não distribuído; validar modelo e acesso à API na conta de produção.

Backup ZIP e Git bundle originais: pasta backups ao lado desta pasta, fora do repositório. A hospedagem original permanece intacta.

## Publicação
Site: https://tecar-compressores-lab.vercel.app
GitHub: https://github.com/crypta404-lgtm/tecar-compressores-lab
Vercel: conta crypta404-lgtm, escopo cry-pta. Integração Git conectada, pasta app e branch de produção feat/vercel-migration.
