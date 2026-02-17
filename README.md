# GAAK SUPLEMENTOS - Backend

## Rodando local

1. `npm install`
2. Crie `.env` com base em `.env.example`
3. `npm start`

## Deploy na Vercel

- O projeto usa `vercel.json` para servir frontend a partir de `frontend/public/`.
- Rotas API continuam em `/api/*`.
- Arquivos de dados/imagens continuam em `/data/*`.
- Defina no projeto Vercel as variaveis de ambiente:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `CORS_ORIGIN` (dominio(s) do frontend)
  - `WHATSAPP_NUMBER` (opcional)
  - `ADMIN_PASSWORD` e `MANAGER_PASSWORD` (primeiro seed)
  - `SENTRY_DSN` e `SENTRY_TRACES_SAMPLE_RATE` (opcional)

## Estrutura de estaticos

- Backend em `backend/` (API, server, dados e uploads).
- Frontend em `frontend/` (`frontend/public` com HTML/CSS/JS).
- O backend serve somente `frontend/public` como raiz estatica.
- Dados do catalogo permanecem fora da raiz publica em `backend/data`.

## Variaveis de ambiente

- `MONGODB_URI` - string de conexao do MongoDB
- `WHATSAPP_NUMBER` - numero do WhatsApp (ex: 5599984065730)
- `CORS_ORIGIN` - origens permitidas separadas por virgula (em producao nao pode usar `*`)
- `JWT_SECRET` - segredo JWT obrigatorio para autenticação admin
- `ADMIN_PASSWORD` - senha inicial do usuario `admin`
- `MANAGER_PASSWORD` - senha inicial do usuario `gerente`
- `SENTRY_DSN` - DSN opcional para monitoramento de erros no backend
- `SENTRY_TRACES_SAMPLE_RATE` - taxa opcional de tracing (ex: `0.1`)

## Login Admin

- Tela de login: `frontend/public/login.html`
- Endpoint unico de auth: `POST /api/admin-auth/login` e `GET /api/admin-auth/me`
- Usuarios automáticos no MongoDB:
  - `admin` (role `owner`, acesso total)
  - `gerente` (acesso de clientes e vendas)

## Endpoints principais

- `GET /api/health`
- `GET /api/products`
- `GET /api/coupons/validate?code=...` (publico para checkout)
- `POST /api/admin-auth/login`
- `GET /api/admin-auth/me`

## Testes

- `npm test`
- `npm run test:e2e` (Playwright, fluxo completo de checkout)
- `npm run test:all`

## Observabilidade

- Logs estruturados em JSON no backend.
- Correlação por `x-request-id` (aceita header de entrada e devolve no response).
- Captura de exceções com Sentry quando `SENTRY_DSN` está configurado.
