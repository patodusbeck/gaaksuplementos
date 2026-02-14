# GAAK SUPLEMENTOS - Backend

## Rodando local

1. `npm install`
2. Crie `.env` com base em `.env.example`
3. `npm start`

## Variaveis de ambiente

- `MONGODB_URI` - string de conexao do MongoDB
- `WHATSAPP_NUMBER` - numero do WhatsApp (ex: 5599984065730)
- `CORS_ORIGIN` - origens permitidas (ex: https://seusite.com). Use `*` para liberar tudo.
- `CLOUDINARY_CLOUD_NAME` - (recomendado na Vercel) nome da cloud
- `CLOUDINARY_API_KEY` - chave da API
- `CLOUDINARY_API_SECRET` - segredo da API

## Catalogo de produtos (por commit)

O catalogo e somente leitura no painel admin.

- Arquivo fonte: `data/products.json`
- Fluxo: editar JSON, commitar, publicar deploy
- Cada produto usa campos: `id`, `name`, `description`, `price`, `original`, `category`, `badge`, `imageUrl`, `collection`, `active`

## Endpoints

- `GET /api/products` - lista produtos do `data/products.json`
- `GET /api/products/:id` - detalhes de produto por `id`
- `POST /api/products` - bloqueado (405)
- `PUT /api/products/:id` - bloqueado (405)
- `DELETE /api/products/:id` - bloqueado (405)
- `GET /api/coupons` - lista cupons
- `POST /api/coupons` - cria cupom
- `PUT /api/coupons/:id` - atualiza cupom
- `DELETE /api/coupons/:id` - remove cupom
- `POST /api/orders` - cria pedido e retorna link do WhatsApp

## Vercel

A API serverless esta em:

- `api/index.js` para `/api`
- `api/[...path].js` para `/api/*`

Nao e necessario `vercel.json` para este projeto.
