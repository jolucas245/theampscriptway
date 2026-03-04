---
title: RowCount
sidebar_label: RowCount
description: Retorna o número de linhas em um rowset ou array.
---

# RowCount

## Descrição

A função `RowCount` retorna o número de linhas contidas em um rowset ou array. É uma das funções mais usadas no dia a dia de AMPscript, já que quase sempre você precisa saber quantos registros uma consulta retornou antes de iterar sobre eles ou decidir o que exibir. Na prática, você vai usar essa função junto com [`LookupRows`](../data-extension-functions/lookuprows.md), [`LookupOrderedRows`](../data-extension-functions/lookuporderedrows.md) e outras funções que retornam rowsets para controlar a lógica dos seus e-mails e CloudPages.

## Sintaxe

```ampscript
RowCount(@rowset)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| rowset | String | Sim | O rowset ou array para o qual você quer saber o número de linhas. |

## Exemplo básico

Consultando uma Data Extension de CEPs e contando quantas linhas existem para a cidade de São Paulo:

```ampscript
%%[

SET @linhas = LookupRows("CodigosPostais", "Cidade", "São Paulo")
SET @totalLinhas = RowCount(@linhas)

]%%

Encontramos %%=v(@totalLinhas)=%% CEPs cadastrados para São Paulo.
```

**Saída:**
```
Encontramos 47 CEPs cadastrados para São Paulo.
```

## Exemplo avançado

Verificando se um cliente da MegaStore possui pedidos recentes antes de exibir o histórico de compras no e-mail de régua de relacionamento:

```ampscript
%%[

SET @emailCliente = AttributeValue("EmailAddress")
SET @pedidos = LookupRows("Pedidos", "Email", @emailCliente)
SET @totalPedidos = RowCount(@pedidos)

IF @totalPedidos > 0 THEN

  SET @ultimoPedido = Row(@pedidos, 1)
  SET @numeroPedido = Field(@ultimoPedido, "NumeroPedido")
  SET @valorPedido = Field(@ultimoPedido, "Valor")

]%%

Olá! Você tem %%=v(@totalPedidos)=%% pedido(s) na MegaStore.

Seu pedido mais recente: #%%=v(@numeroPedido)=%%
Valor: R$ %%=FormatNumber(@valorPedido, "N", 2)=%%

%%[ ELSE ]%%

Olá! Você ainda não tem pedidos na MegaStore. Que tal conhecer nossas ofertas?

%%[ ENDIF ]%%
```

**Saída:**
```
Olá! Você tem 3 pedido(s) na MegaStore.

Seu pedido mais recente: #98210
Valor: R$ 1.299,90
```

## Observações

> **⚠️ Atenção:** Sempre verifique o resultado de `RowCount` antes de tentar acessar linhas com [`Row`](../data-extension-functions/row.md) e [`Field`](../data-extension-functions/field.md). Se o rowset estiver vazio e você tentar acessar uma linha diretamente, vai gerar erro no processamento do e-mail.

> **💡 Dica:** O padrão mais comum em AMPscript é o combo `LookupRows` → `RowCount` → `IF` → loop com `Row` e `Field`. Esse fluxo aparece em praticamente todo e-mail que precisa buscar dados dinâmicos de uma Data Extension. Domine esse padrão e você resolve a maioria dos cenários.

## Funções relacionadas

- [`LookupRows`](../data-extension-functions/lookuprows.md) — busca linhas em uma Data Extension (retorna o rowset que você passa para `RowCount`)
- [`LookupOrderedRows`](../data-extension-functions/lookuporderedrows.md) — busca linhas ordenadas em uma Data Extension
- [`Row`](../data-extension-functions/row.md) — acessa uma linha específica dentro do rowset
- [`Field`](../data-extension-functions/field.md) — extrai o valor de uma coluna de uma linha
- [`DataExtensionRowCount`](../data-extension-functions/dataextensionrowcount.md) — retorna o total de linhas de uma Data Extension inteira (sem filtro)
- [`BuildRowsetFromString`](../content-functions/buildrowsetfromstring.md) — cria um rowset a partir de uma string delimitada