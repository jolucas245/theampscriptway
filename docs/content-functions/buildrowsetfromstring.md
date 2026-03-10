---
title: BuildRowsetFromString
sidebar_label: BuildRowsetFromString
description: Cria um rowset a partir de uma string, dividindo-a pelo delimitador especificado.
---

# BuildRowsetFromString

## Descrição

Cria um rowset a partir de uma string de texto, quebrando-a em linhas com base em um delimitador que você define. É extremamente útil quando você tem dados armazenados como texto separado por vírgula (ou outro caractere) em uma Data Extension - situação muito comum quando se trabalha com listas de produtos, categorias de interesse ou múltiplos valores em um único campo. Como a coluna resultante não possui nome atribuído, você a referencia usando número ordinal (posição `1`).

## Sintaxe

```ampscript
BuildRowsetFromString(@sourceData, @delimiter)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| sourceData | string | Sim | A string que contém os dados a serem carregados no rowset. |
| delimiter | string | Sim | O caractere usado como delimitador na string de origem (ex: vírgula, pipe, ponto-e-vírgula). |

## Exemplo básico

Imagine que você tem uma string com as cidades de atuação de uma rede de lojas e precisa exibir cada uma separadamente no e-mail:

```ampscript
%%[
VAR @cidades, @delimitador, @rowset, @i, @cidade

SET @cidades = "São Paulo,Rio de Janeiro,Belo Horizonte,Curitiba"
SET @delimitador = ","
SET @rowset = BuildRowsetFromString(@cidades, @delimitador)

FOR @i = 1 TO RowCount(@rowset) DO
  SET @cidade = Field(Row(@rowset, @i), 1)
]%%

Cidade: %%=v(@cidade)=%%<br>

%%[NEXT @i]%%
```

**Saída:**
```
Cidade: São Paulo
Cidade: Rio de Janeiro
Cidade: Belo Horizonte
Cidade: Curitiba
```

## Exemplo avançado

Cenário real de régua de relacionamento: um campo na Data Extension armazena os nomes dos produtos comprados pelo cliente, separados por pipe (`|`). Você quer listar esses produtos no e-mail de pós-venda da MegaStore, formatando cada nome com a primeira letra maiúscula:

```ampscript
%%[
VAR @produtos, @rowset, @totalProdutos, @i, @nomeProduto

SET @produtos = "camiseta básica|tênis esportivo|mochila urbana|boné aba reta"
SET @rowset = BuildRowsetFromString(@produtos, "|")
SET @totalProdutos = RowCount(@rowset)
]%%

Olá, João Silva! Aqui está o resumo da sua compra na MegaStore:<br><br>

%%[
FOR @i = 1 TO @totalProdutos DO
  SET @nomeProduto = Field(Row(@rowset, @i), 1)
  SET @nomeProduto = ProperCase(@nomeProduto)
]%%

%%=v(@i)=%%. %%=v(@nomeProduto)=%%<br>

%%[NEXT @i]%%

<br>Total de itens: %%=v(@totalProdutos)=%%
```

**Saída:**
```
Olá, João Silva! Aqui está o resumo da sua compra na MegaStore:

1. Camiseta Básica
2. Tênis Esportivo
3. Mochila Urbana
4. Boné Aba Reta

Total de itens: 4
```

## Observações

> **⚠️ Atenção:** A coluna do rowset gerado por `BuildRowsetFromString` não possui nome atribuído. Por isso, ao usar a função [Field](../data-extension-functions/field.md), você deve referenciar a coluna pelo número ordinal `1` - e não por um nome de campo.

> **💡 Dica:** Essa função é a sua melhor amiga quando um campo de Data Extension armazena múltiplos valores concatenados. Em vez de fazer manipulações complexas com [Substring](../string-functions/substring.md) e [IndexOf](../string-functions/indexof.md), basta usar `BuildRowsetFromString` e iterar com um `FOR` simples.

> **💡 Dica:** Combine com [RowCount](../data-extension-functions/rowcount.md) para saber quantos itens a string continha e com [Row](../data-extension-functions/row.md) + [Field](../data-extension-functions/field.md) para acessar cada valor individualmente.

## Funções relacionadas

- [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md) - cria rowset a partir de JSON
- [BuildRowsetFromXml](../content-functions/buildrowsetfromxml.md) - cria rowset a partir de XML
- [Row](../data-extension-functions/row.md) - acessa uma linha específica do rowset
- [RowCount](../data-extension-functions/rowcount.md) - conta o total de linhas do rowset
- [Field](../data-extension-functions/field.md) - extrai o valor de uma coluna da linha