# Treinamento Rápido: Adicionar, Editar e Remover Produtos

Este tutorial foi feito para uso manual do cliente, de forma simples.

Arquivos que usaremos:

- `backend/data/products.json` (dados do produto)
- `backend/data/images.json` (fotos do produto)

## 1) Adicionar Produto

### Passo 1: Adicionar no `products.json`

1. Abra `backend/data/products.json`.
2. Copie um bloco completo de produto existente (um objeto com `id`, `name`, `price`, etc.).
3. Cole no final da seção desejada.
4. Preencha os campos:

- `id`: identificador único (ex: `whey-concentrado-1kg`)
- `name`: nome do produto
- `description`: descrição curta
- `price`: preço atual (ex: `129.9`)
- `original`: preço antigo (ex: `149.9`)
- `category`: categoria (ex: `Proteina`, `Creatina`, `Pre-treino`, `Kits`)
- `badge`: selo visual (ex: `Novo`, `Destaque`)
- `collection`: onde aparece no site (`best-sellers`, `launches`, `accessories`)
- `active`: `true` para mostrar no site

### Passo 2: Adicionar no `images.json`

1. Abra `backend/data/images.json`.
2. Crie um novo bloco com o mesmo `id` do produto criado.
3. Adicione até 3 imagens no array `images`.

Exemplo:

```json
{
  "id": "whey-concentrado-1kg",
  "images": [
    "/data/products/whey/whey1.png",
    "/data/products/whey/whey2.png",
    "/data/products/whey/whey3.png"
  ]
}
```

### Passo 3: Confirmar arquivos físicos

- As imagens precisam existir dentro de `backend/data/...`.
- Exemplo: se no JSON está `/data/products/whey/whey1.png`, o arquivo deve existir em `backend/data/products/whey/whey1.png`.

---

## 2) Editar Produto

### Passo 1: Editar dados do produto

1. Abra `backend/data/products.json`.
2. Localize o produto pelo `id`.
3. Altere os campos desejados (`name`, `description`, `price`, `badge`, etc.).

### Passo 2: Editar fotos do produto

1. Abra `backend/data/images.json`.
2. Localize o bloco com o mesmo `id`.
3. Altere os caminhos no array `images`.

### Passo 3: Verificar consistência

- O `id` no `products.json` e `images.json` deve ser exatamente igual.
- Se mudar o `id` em um arquivo, mude no outro também.

---

## 3) Remover Produto

### Opção A (recomendada): ocultar sem apagar

1. Em `backend/data/products.json`, localize o produto.
2. Troque:

```json
"active": true
```

para:

```json
"active": false
```

3. O produto sai do site, mas continua salvo.

### Opção B: remover de vez

1. Remova o bloco do produto em `backend/data/products.json`.
2. Remova também o bloco do mesmo `id` em `backend/data/images.json`.
3. Remova as imagens físicas da pasta `backend/data/...` se não forem mais usadas.

---

## Checklist antes de salvar

1. JSON válido (sem vírgula sobrando no último item).
2. `id` igual nos dois arquivos.
3. Caminhos de imagem iniciando com `/data/...`.
4. Arquivos de imagem realmente existentes em `backend/data/...`.
5. Para esconder produto sem perder dados, usar `"active": false`.
