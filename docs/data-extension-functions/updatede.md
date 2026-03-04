---
title: UpdateDE
sidebar_label: UpdateDE
description: Atualiza dados em uma ou mais colunas de uma Data Extension a partir de critérios de busca.
---

# UpdateDE

## Descrição

A função `UpdateDE` atualiza dados em uma Data Extension, localizando a linha através de critérios de busca (coluna + valor) e aplicando as alterações nas colunas especificadas. É a função indicada para atualização de dados dentro de **e-mails** — se você precisa atualizar dados em CloudPages, landing pages, microsites ou mensagens SMS no MobileConnect, use a função [UpdateData](../data-extension-functions/updatedata.md). A função não retorna nenhuma saída.

## Sintaxe

```ampscript
UpdateDE(@dataExt, @columnValuePairs, @searchColumnName1, @searchValue1, @columnToUpdate1, @updatedValue1)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExt | string | Sim | Nome da Data Extension que contém os dados a serem atualizados. |
| columnValuePairs | number | Sim | Número de pares coluna/valor usados como critério de busca para localizar a linha. |
| searchColumnName1 | string | Sim | Nome da coluna usada para buscar a linha que será atualizada. |
| searchValue1 | string | Sim | Valor que identifica qual linha deve ser atualizada. Você pode especificar múltiplos pares de coluna e valor como critério de busca. |
| columnToUpdate1 | string | Sim | Nome da coluna que terá o dado atualizado. |
| updatedValue1 | string | Sim | Novo valor a ser gravado na coluna especificada. Você pode especificar múltiplos pares de coluna e valor para atualizar. |

## Exemplo básico

Atualizando o preço de um produto na Data Extension "Catalogo_Produtos" da MegaStore, identificando o item pelo código:

```ampscript
%%[
UpdateDE(
  "Catalogo_Produtos",
  1,
  "ProdutoId", "1042",
  "Preco", "1299.90"
)
]%%
```

**Saída:**
```
(nenhuma saída é gerada — o valor da coluna "Preco" do produto 1042 é atualizado para 1299.90)
```

## Exemplo avançado

Numa régua de relacionamento da Lojas Vitória, ao enviar o e-mail de confirmação de pedido, você atualiza o destino de entrega, o valor do frete e a taxa de embalagem do pedido do cliente de uma só vez:

```ampscript
%%[

VAR @pedidoId, @novoCep, @novoFrete, @taxaEmbalagem
SET @pedidoId = "PED-78523"
SET @novoCep = "04538-132"
SET @novoFrete = "29.90"
SET @taxaEmbalagem = "5.50"

UpdateDE(
  "Pedidos_Entrega",
  1,
  "PedidoId", @pedidoId,
  "CEP_Destino", @novoCep,
  "Frete", @novoFrete,
  "TaxaEmbalagem", @taxaEmbalagem
)

]%%
```

**Saída:**
```
(nenhuma saída é gerada — as colunas "CEP_Destino", "Frete" e "TaxaEmbalagem" da linha do pedido PED-78523 são atualizadas)
```

## Observações

> **⚠️ Atenção:** A função `UpdateDE` é exclusiva para uso em **e-mails**. Para CloudPages, landing pages, microsites e mensagens SMS no MobileConnect, use [UpdateData](../data-extension-functions/updatedata.md).

> **⚠️ Atenção:** Se o valor informado no parâmetro `columnValuePairs` não corresponder à quantidade real de pares de critério de busca na função, uma exceção será retornada.

> **⚠️ Atenção:** Se o nome da coluna informado em `searchColumnName` não existir na Data Extension especificada, a função retorna uma exceção.

> **💡 Dica:** Se o valor informado em `searchValue` não for encontrado na coluna de busca, nenhum dado é atualizado e a função retorna `0`.

> **⚠️ Atenção:** Se o valor informado em `updatedValue` for de um tipo de dado diferente do tipo da coluna especificada em `columnToUpdate`, nenhum dado é atualizado e a função retorna `0`. Por exemplo, se você passar um valor numérico para uma coluna que armazena texto, a atualização não acontece.

> **⚠️ Atenção:** Se a quantidade de parâmetros de busca (`searchColumnName` e `searchValue`) for diferente da quantidade de parâmetros de atualização (`columnToUpdate` e `updatedValue`), a função atualiza apenas as colunas para as quais você forneceu parâmetros de busca correspondentes. Por exemplo, se você informar dois pares de busca e três pares de atualização, apenas os dois primeiros pares de atualização serão executados. Você pode repetir os mesmos parâmetros de atualização múltiplas vezes, se necessário.

## Funções relacionadas

- [UpdateData](../data-extension-functions/updatedata.md) — equivalente para uso em CloudPages, landing pages, microsites e SMS
- [InsertDE](../data-extension-functions/insertde.md) — insere uma nova linha na Data Extension (em e-mails)
- [UpsertDE](../data-extension-functions/upsertde.md) — insere ou atualiza conforme a existência do registro (em e-mails)
- [DeleteDE](../data-extension-functions/deletede.md) — exclui linhas de uma Data Extension (em e-mails)
- [Lookup](../data-extension-functions/lookup.md) — consulta um valor na Data Extension antes de atualizar