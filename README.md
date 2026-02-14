# GAAK SUPLEMENTOS - Backend

## Rodando local

1. `npm install`
2. Crie `.env` com base em `.env.example`
3. `npm start`

## Variaveis de ambiente

- `MONGODB_URI` - string de conexao do MongoDB (obrigatoria para pedidos/cupons/clientes)
- `WHATSAPP_NUMBER` - numero do WhatsApp (ex: 5599984065730)
- `CORS_ORIGIN` - origens permitidas (ex: https://seusite.com). Use `*` para liberar tudo.

## Persistencia no MongoDB

Persistido no MongoDB:

- `orders` - vendas/pedidos
- `coupons` - cupons e uso
- `customers` - clientes

Catalogo de produtos:

- somente leitura via `data/products.json`
- manutencao por commit/deploy

## Endpoints

- `GET /api/health` - status da API + conexao DB
- `GET /api/products` - lista produtos do `data/products.json`
- `GET /api/products/:id` - detalhes de produto por `id`
- `POST /api/products` - bloqueado (405)
- `PUT /api/products/:id` - bloqueado (405)
- `DELETE /api/products/:id` - bloqueado (405)
- `GET /api/coupons` - lista cupons
- `POST /api/coupons` - cria cupom
- `PUT /api/coupons/:id` - atualiza cupom
- `DELETE /api/coupons/:id` - remove cupom
- `GET /api/customers` - lista clientes
- `GET /api/customers/:id` - detalhes de cliente
- `PUT /api/customers/:id` - atualiza cliente
- `GET /api/orders` - lista pedidos
- `POST /api/orders` - cria pedido e retorna link do WhatsApp
- `POST /api/uploads` - upload de imagem local (`/uploads`) com limite de 5MB

## Vercel

A API serverless esta em:

- `api/index.js` para `/api`
- `api/[...path].js` para `/api/*`

Nao e necessario `vercel.json` neste projeto.
