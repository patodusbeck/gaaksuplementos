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

## Endpoints

- `GET /api/products` - lista produtos
- `POST /api/products` - cria produto
- `PUT /api/products/:id` - atualiza produto
- `DELETE /api/products/:id` - remove produto
- `POST /api/orders` - cria pedido e retorna link do WhatsApp

## Vercel

O arquivo `api/index.js` expoe a API e `vercel.json` reescreve `/api/*` para a funcao.
