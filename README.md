# GAAK SUPLEMENTOS - Backend

## Rodando local

1. `npm install`
2. Crie `.env` com base em `.env.example`
3. `npm start`

## Variaveis de ambiente

- `MONGODB_URI` - string de conexao do MongoDB
- `WHATSAPP_NUMBER` - numero do WhatsApp (ex: 5599984065730)
- `CORS_ORIGIN` - origens permitidas separadas por virgula (em producao nao pode usar `*`)
- `JWT_SECRET` - segredo JWT obrigatorio para autenticação admin
- `ADMIN_PASSWORD` - senha inicial do usuario `admin`
- `MANAGER_PASSWORD` - senha inicial do usuario `gerente`

## Login Admin

- Tela de login: `login.html`
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
