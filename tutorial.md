# Treinamento Rapido do Cliente (Produtos, Imagens e Banner)

Guia simples para atualizar a loja sem complicacao.

## Arquivos que voce vai editar

- `backend/data/products.json`: dados dos produtos
- `backend/data/images.json`: galeria de imagens por produto
- `backend/data/banners.json`: textos e imagens do topo/home

Observacao: o arquivo correto e `banners.json` (plural).

## 1) Como atualizar produtos

Abra `backend/data/products.json` e edite o bloco do produto.

Campos principais:

- `id`: codigo unico do produto
- `name`: nome exibido
- `description`: descricao curta
- `price`: preco atual (numero, ex: `94.9`)
- `original`: preco antigo (numero, ex: `114.9`)
- `category`: categoria (ex: `Creatina`, `Proteina`, `Pre-treino`, `Acessorios`)
- `badge`: selo (ex: `Destaque`, `Top`)
- `collection`: `best-sellers`, `launches` ou `accessories`
- `active`: `true` (aparece no site) ou `false` (oculta)

Exemplo:

```json
{
  "id": "creatina-max-300g",
  "name": "Creatina Max 300g",
  "description": "Creatina monohidratada para suporte de forca e desempenho.",
  "price": 94.9,
  "original": 114.9,
  "category": "Creatina",
  "badge": "Destaque",
  "imageUrl": "",
  "collection": "launches",
  "active": true
}
```

## 2) Como atualizar imagens dos produtos

Abra `backend/data/images.json` e localize o mesmo `id` do produto.

Exemplo:

```json
{
  "id": "creatina-max-300g",
  "images": [
    "/data/products/creatine/creatina-max-300g.png",
    "/data/products/creatine/creatina-max-300g.png",
    "/data/products/creatine/creatina-max-300g.png"
  ]
}
```

Regras:

- O `id` deve ser igual ao `id` do `products.json`
- Caminhos devem comecar com `/data/...`
- O arquivo fisico deve existir em `backend/data/...`

## 3) Como atualizar banners e destaques

Abra `backend/data/banners.json`.

Partes mais importantes:

- `alert.primary` e `alert.secondary`: faixa de aviso no topo
- `mainBanner`: banner principal (`title`, `description`, `priceFrom`, `priceTo`, `imageUrl`)
- `sideBanners`: banner lateral
- `featuredProduct`: destaque da home
- `benefits`: itens de beneficios exibidos na home

No `featuredProduct`, use um `productId` que exista em `products.json` e esteja com `active: true`.

Exemplo:

```json
"featuredProduct": {
  "badge": "Destaque",
  "title": "Camisa Dark Lab",
  "priceText": "R$ 59,90",
  "imageUrl": "/data/products/moda/camdark.png",
  "productId": "camisa-dark-lab"
}
```

## 4) Fluxo rapido (dia a dia)

1. Edite produto em `products.json`.
2. Ajuste imagens no `images.json`.
3. Atualize campanha/oferta no `banners.json`.
4. Revise se o JSON esta valido.
5. Salve e publique no repositorio para atualizar o site.

## Checklist final

1. Nenhum `id` duplicado em `products.json`.
2. Todo produto novo tem entrada em `images.json`.
3. `productId` do destaque existe e esta ativo.
4. Precos em numero no `products.json` (sem `R$`).
5. Todos os caminhos de imagem existem em `backend/data/...`.
