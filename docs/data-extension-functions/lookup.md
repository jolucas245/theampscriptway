---
title: Lookup
sidebar_label: Lookup
description: Retorna o valor de uma coluna específica de uma Data Extension com base em critérios de busca.
---

# Lookup

## Descrição

A função `Lookup` busca um valor em uma Data Extension e retorna o dado de uma coluna específica da linha encontrada. É a função mais direta para consultas simples - tipo quando você precisa puxar o nome do cliente, o saldo, a última compra ou qualquer outro dado armazenado em uma DE a partir de um identificador como e-mail ou CPF. Se a busca retornar mais de um resultado, o sistema devolve apenas o primeiro valor encontrado, por isso o ideal é usar essa função com identificadores únicos dentro da Data Extension.

## Sintaxe

```ampscript
Lookup("dataExt", "returnColumn", "searchColumn1", "searchValue1" [, "searchColumn2", "searchValue2" ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExt | string | Sim | Nome da Data Extension que contém os dados que você quer consultar. |
| returnColumn | string | Sim | Nome da coluna da qual o valor será retornado. |
| searchColumn1 | string | Sim | Nome da coluna usada como critério de busca. O valor é case-sensitive. |
| searchValue1 | string | Sim | Valor a ser procurado na coluna de busca. O valor é case-sensitive. Você pode adicionar pares extras de coluna e valor de busca ao final da chamada. |

## Exemplo básico

Buscando o nome de um cliente na Data Extension "Clientes" a partir do e-mail do assinante:

```ampscript
%%[
VAR @nomeCliente
SET @nomeCliente = Lookup("Clientes", "NomeCompleto", "Email", "joao.silva@email.com.br")
]%%

Olá, %%=v(@nomeCliente)=%%! Tudo bem?
```

**Saída:**
```
Olá, João Silva! Tudo bem?
```

## Exemplo avançado

Cenário real de régua de relacionamento: um e-mail de boas-vindas da Lojas Vitória que puxa dados do cliente (nome e cidade) a partir do CPF, trata valores nulos e formata a saudação.

```ampscript
%%[
VAR @cpf, @nome, @cidade, @saudacao

SET @cpf = AttributeValue("CPF")
SET @nome = Lookup("Clientes_Vitoria", "PrimeiroNome", "CPF", @cpf)
SET @cidade = Lookup("Clientes_Vitoria", "Cidade", "CPF", @cpf)

IF Empty(@nome) THEN
  SET @saudacao = "Olá!"
ELSE
  SET @saudacao = Concat("Olá, ", ProperCase(@nome), "!")
ENDIF
]%%

%%=v(@saudacao)=%%

%%[ IF NOT Empty(@cidade) THEN ]%%
  Confira as ofertas exclusivas para a região de %%=v(@cidade)=%%.
%%[ ELSE ]%%
  Confira nossas ofertas exclusivas.
%%[ ENDIF ]%%
```

**Saída:**
```
Olá, Maria!

Confira as ofertas exclusivas para a região de Belo Horizonte.
```

## Exemplo com múltiplos critérios de busca

Buscando o valor de um pedido na Data Extension "Pedidos" usando dois critérios - CPF do cliente e número do pedido:

```ampscript
%%[
VAR @valorPedido
SET @valorPedido = Lookup("Pedidos", "ValorTotal", "CPF", "123.456.789-00", "NumeroPedido", "98765")
]%%

O valor do seu pedido é R$ %%=FormatNumber(@valorPedido, "N", 2, "pt-BR")=%%.
```

**Saída:**
```
O valor do seu pedido é R$ 1.299,90.
```

## Observações

> **⚠️ Atenção:** Os valores de busca (tanto o nome da coluna quanto o valor procurado) são **case-sensitive**. Se na sua Data Extension a coluna se chama `Email` e você passar `email` ou `EMAIL`, a busca pode não funcionar como esperado. O mesmo vale para os valores - `"SP"` é diferente de `"sp"`.

> **⚠️ Atenção:** Se mais de uma linha atender aos critérios de busca, a função retorna apenas o **primeiro valor encontrado**. Por isso, prefira usar `Lookup` com identificadores únicos (CPF, e-mail, ID de pedido). Se você precisa trabalhar com múltiplas linhas, use [LookupRows](../data-extension-functions/lookuprows.md) ou [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md).

> **💡 Dica:** Você pode encadear vários pares de coluna/valor de busca para refinar o filtro. Isso é útil quando um único campo não garante unicidade - por exemplo, buscar por CPF **e** número do pedido ao mesmo tempo.

## Funções relacionadas

- [LookupRows](../data-extension-functions/lookuprows.md) - retorna uma ou mais linhas com base nos critérios de busca
- [LookupRowsCS](../data-extension-functions/lookuprowscs.md) - versão case-sensitive do LookupRows
- [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) - retorna múltiplas linhas com ordenação por coluna
- [LookupOrderedRowsCS](../data-extension-functions/lookuporderedrowscs.md) - versão case-sensitive do LookupOrderedRows
- [Row](../data-extension-functions/row.md) - acessa uma linha específica de um rowset
- [Field](../data-extension-functions/field.md) - acessa o valor de uma coluna dentro de uma linha de rowset
- [RowCount](../data-extension-functions/rowcount.md) - conta o número de linhas em um rowset
- [Empty](../utility-functions/empty.md) - verifica se um valor está vazio
- [IsNull](../utility-functions/isnull.md) - verifica se um valor é nulo