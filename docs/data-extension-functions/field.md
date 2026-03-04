---
title: Field
sidebar_label: Field
description: Retorna o valor de um campo específico a partir de uma linha (row) de dados.
---

# Field

## Descrição

A função `Field` extrai o valor de um campo específico a partir de um objeto de linha (row). É uma das funções mais usadas no dia a dia de SFMC, porque sempre que você consulta dados de uma Data Extension com [LookupRows](../data-extension-functions/lookuprows.md) ou monta um rowset a partir de JSON com [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md), você precisa dela para acessar cada campo individual. Retorna o valor do campo solicitado ou, dependendo da configuração do terceiro parâmetro, uma string vazia caso o campo não exista.

## Sintaxe

```ampscript
Field(@row, "fieldName")
Field(@row, "fieldName", boolExceptionIfNotFound)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| row | string | Sim | O objeto de linha (row) que contém o campo que você quer retornar. |
| fieldName | string | Sim | O nome do campo a ser retornado a partir da linha. |
| boolExceptionIfNotFound | boolean | Não | Se `true`, retorna uma exceção caso o campo não exista. Se `false`, retorna uma string vazia caso o campo não exista. O valor padrão é `true`. |

## Exemplo básico

Consultando o nome de um cliente na Data Extension "Clientes" e exibindo no e-mail:

```ampscript
%%[
SET @rowset = LookupRows("Clientes", "Email", "joao.silva@email.com.br")
SET @row = Row(@rowset, 1)
SET @nome = Field(@row, "NomeCompleto")
]%%

Olá, %%=v(@nome)=%%! Bem-vindo à Lojas Vitória.
```

**Saída:**
```
Olá, João Silva! Bem-vindo à Lojas Vitória.
```

## Exemplo avançado

Montando um e-mail de confirmação de pedido que busca os dados do cliente e seus itens a partir de JSON, combinando `Field` com [Row](../data-extension-functions/row.md), [RowCount](../data-extension-functions/rowcount.md), [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md) e [FormatCurrency](../string-functions/formatcurrency.md):

```ampscript
%%[
SET @json = '[{"Produto":"Camiseta Polo","Preco":"89.90"},{"Produto":"Calça Jeans","Preco":"199.90"}]'
SET @rowset = BuildRowsetFromJson(@json, "$.*", 0)
SET @total = 0

SET @pedidosDE = LookupRows("Pedidos", "ClienteEmail", "maria.santos@email.com.br")
SET @pedidoRow = Row(@pedidosDE, 1)
SET @numeroPedido = Field(@pedidoRow, "NumeroPedido")
SET @cidade = Field(@pedidoRow, "Cidade", false)
]%%

Pedido #%%=v(@numeroPedido)=%%
%%[ IF NOT Empty(@cidade) THEN ]%%
Cidade de entrega: %%=v(@cidade)=%%
%%[ ENDIF ]%%

Itens do pedido:
%%[
FOR @i = 1 TO RowCount(@rowset) DO
  SET @itemRow = Row(@rowset, @i)
  SET @produto = Field(@itemRow, "Produto")
  SET @preco = Field(@itemRow, "Preco")
  SET @total = Add(@total, @preco)
]%%
- %%=v(@produto)=%%: R$ %%=FormatNumber(@preco, "N2")=%%
%%[ NEXT @i ]%%

Total: R$ %%=FormatNumber(@total, "N2")=%%
```

**Saída:**
```
Pedido #78432

Cidade de entrega: São Paulo

Itens do pedido:
- Camiseta Polo: R$ 89,90
- Calça Jeans: R$ 199,90

Total: R$ 289,80
```

## Observações

> **⚠️ Atenção:** Por padrão, o parâmetro `boolExceptionIfNotFound` é `true`. Isso significa que se você tentar acessar um campo que não existe na row, o AMPscript vai lançar uma exceção e quebrar o render do seu e-mail ou CloudPage. Se há qualquer chance de o campo não existir, passe `false` como terceiro parâmetro para receber uma string vazia em vez de um erro.

> **💡 Dica:** A função `Field` sempre trabalha em conjunto com [Row](../data-extension-functions/row.md). Primeiro você extrai uma linha do rowset com `Row`, depois acessa cada campo com `Field`. Esse par é o padrão para iterar sobre resultados de [LookupRows](../data-extension-functions/lookuprows.md), [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md), [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md) e [BuildRowsetFromXml](../content-functions/buildrowsetfromxml.md).

> **💡 Dica:** Em cenários de régua de relacionamento onde a Data Extension pode ter campos opcionais (como telefone celular ou CPF), usar `Field(@row, "Celular", false)` evita que o e-mail quebre para assinantes cujo campo não foi populado na estrutura de dados.

## Funções relacionadas

- [Row](../data-extension-functions/row.md) — extrai uma linha específica de um rowset (pré-requisito para usar `Field`)
- [RowCount](../data-extension-functions/rowcount.md) — retorna a quantidade de linhas em um rowset
- [LookupRows](../data-extension-functions/lookuprows.md) — consulta múltiplas linhas de uma Data Extension
- [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) — consulta múltiplas linhas com ordenação
- [Lookup](../data-extension-functions/lookup.md) — retorna o valor de um campo diretamente (sem precisar de `Row` + `Field`)
- [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md) — cria um rowset a partir de dados JSON
- [BuildRowsetFromXml](../content-functions/buildrowsetfromxml.md) — cria um rowset a partir de dados XML
- [BuildRowsetFromString](../content-functions/buildrowsetfromstring.md) — cria um rowset a partir de uma string delimitada
- [Empty](../utility-functions/empty.md) — verifica se um valor está vazio (útil para validar o retorno de `Field`)