---
title: LookupRowsCS
sidebar_label: LookupRowsCS
description: Retorna um conjunto de linhas de uma Data Extension com busca case-sensitive (diferencia maiúsculas de minúsculas).
---

# LookupRowsCS

## Descrição

A função `LookupRowsCS` busca linhas em uma Data Extension e retorna um rowset (conjunto de linhas) não ordenado, com limite de até 2.000 linhas. A diferença crucial em relação à [LookupRows](../data-extension-functions/lookuprows.md) é que essa função é **case-sensitive** - ou seja, ela diferencia maiúsculas de minúsculas tanto no nome da coluna de busca quanto no valor procurado. Isso é essencial quando você precisa de precisão exata na comparação, como em códigos de cupom, SKUs de produtos ou identificadores que variam por caixa.

## Sintaxe

```ampscript
LookupRowsCS("dataExt", "searchColumn1", "searchValue1" [, "searchColumn2", "searchValue2" ...])
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataExt | string | Sim | Nome da Data Extension que contém os dados que você quer recuperar. |
| searchColumn1 | string | Sim | Nome da coluna onde a busca será feita. O valor é case-sensitive. |
| searchValue1 | string | Sim | Valor a ser procurado na coluna especificada. O valor é case-sensitive. |

> **💡 Dica:** Você pode adicionar pares extras de coluna e valor de busca ao final da chamada para filtrar por múltiplos critérios simultaneamente.

## Exemplo básico

Imagine que a Lojas Vitória tem uma Data Extension chamada "ProgramaFidelidade" com dados dos clientes e suas filiais. Você precisa listar todos os membros da filial "Centro" - respeitando exatamente a grafia.

**Data Extension: ProgramaFidelidade**

| ClienteId | Nome | Sobrenome | Pontos | Nivel | Filial |
|---|---|---|---|---|---|
| 1 | João | Silva | 92374 | 2 | Centro |
| 2 | Maria | Santos | 201042 | 1 | Pinheiros |
| 3 | Carlos | Mendes | 69311 | 3 | Jardins |
| 4 | Ana | Lima | 23999 | 4 | centro |
| 5 | Pedro | Rocha | 15123 | 4 | Centro |

```ampscript
%%[

SET @membros = LookupRowsCS("ProgramaFidelidade", "Filial", "Centro")

IF RowCount(@membros) > 0 THEN
  FOR @i = 1 TO RowCount(@membros) DO
    SET @linha = Row(@membros, @i)
    SET @nome = Field(@linha, "Nome")
    SET @sobrenome = Field(@linha, "Sobrenome")
    SET @pontos = Field(@linha, "Pontos")
]%%

<p>%%=v(@nome)=%% %%=v(@sobrenome)=%% - %%=v(@pontos)=%% pontos</p>

%%[
  NEXT @i
ELSE
]%%

<p>Nenhum membro encontrado nesta filial.</p>

%%[
ENDIF

]%%
```

**Saída:**
```
João Silva - 92374 pontos
Pedro Rocha - 15123 pontos
```

> **⚠️ Atenção:** Note que Ana Lima (filial "centro" com "c" minúsculo) **não aparece** no resultado. Se você usasse [LookupRows](../data-extension-functions/lookuprows.md) (case-insensitive), ela seria incluída. Esse é exatamente o comportamento diferencial da `LookupRowsCS`.

## Exemplo avançado

A FarmaRede precisa enviar um e-mail personalizado para clientes do programa de fidelidade, mostrando os pedidos recentes de um produto específico. O código do produto é case-sensitive (ex: "VitC500" é diferente de "VITC500" e de "vitc500"), e a busca deve considerar também a cidade do cliente.

**Data Extension: PedidosRecentes**

| PedidoId | Email | NomeCliente | CodigoProduto | Produto | Valor | Cidade |
|---|---|---|---|---|---|---|
| 1001 | joao@email.com.br | João Silva | VitC500 | Vitamina C 500mg | 29,90 | São Paulo |
| 1002 | maria@email.com.br | Maria Santos | vitc500 | Vitamina C 500mg Genérico | 19,90 | São Paulo |
| 1003 | carlos@email.com.br | Carlos Mendes | VitC500 | Vitamina C 500mg | 29,90 | São Paulo |
| 1004 | ana@email.com.br | Ana Lima | VitC500 | Vitamina C 500mg | 29,90 | Curitiba |
| 1005 | pedro@email.com.br | Pedro Rocha | VITC500 | Vitamina C 500mg Premium | 49,90 | São Paulo |

```ampscript
%%[

SET @codigoProduto = "VitC500"
SET @cidade = "São Paulo"

SET @pedidos = LookupRowsCS("PedidosRecentes", "CodigoProduto", @codigoProduto, "Cidade", @cidade)
SET @totalPedidos = RowCount(@pedidos)

IF @totalPedidos > 0 THEN
]%%

<h2>Encontramos %%=v(@totalPedidos)=%% pedido(s) de %%=v(@codigoProduto)=%% em %%=v(@cidade)=%%:</h2>

<table>
  <tr>
    <th>Cliente</th>
    <th>Produto</th>
    <th>Valor</th>
  </tr>

%%[
  FOR @i = 1 TO @totalPedidos DO
    SET @linha = Row(@pedidos, @i)
    SET @nomeCliente = Field(@linha, "NomeCliente")
    SET @produto = Field(@linha, "Produto")
    SET @valor = Field(@linha, "Valor")
]%%

  <tr>
    <td>%%=v(@nomeCliente)=%%</td>
    <td>%%=v(@produto)=%%</td>
    <td>R$ %%=v(@valor)=%%</td>
  </tr>

%%[
  NEXT @i
]%%

</table>

%%[
ELSE
]%%

<p>Nenhum pedido encontrado para o produto %%=v(@codigoProduto)=%% em %%=v(@cidade)=%%.</p>

%%[
ENDIF

]%%
```

**Saída:**
```
Encontramos 2 pedido(s) de VitC500 em São Paulo:

Cliente          Produto              Valor
João Silva       Vitamina C 500mg     R$ 29,90
Carlos Mendes    Vitamina C 500mg     R$ 29,90
```

> **💡 Dica:** Perceba que Maria Santos ("vitc500") e Pedro Rocha ("VITC500") não aparecem, mesmo estando em São Paulo. A busca case-sensitive garantiu que apenas os registros com o código exato "VitC500" fossem retornados. Isso é fundamental quando códigos de produto, cupons promocionais ou SKUs têm variações intencionais de caixa.

## Observações

- O rowset retornado **não possui ordenação garantida**. Se você precisa dos resultados em uma ordem específica, considere usar [LookupOrderedRowsCS](../data-extension-functions/lookuporderedrowscs.md).

- A função retorna no máximo **2.000 linhas**. Se a sua busca pode ultrapassar esse limite, considere adicionar mais critérios de filtro para refinar os resultados.

- A busca é **case-sensitive tanto no valor da coluna quanto no nome da coluna de busca**. Certifique-se de que a grafia está exatamente igual ao que está armazenado na Data Extension.

> **⚠️ Atenção:** Antes de iterar sobre o resultado, sempre use [RowCount](../data-extension-functions/rowcount.md) para verificar se há linhas retornadas. Tentar acessar um rowset vazio sem essa verificação pode causar erros na renderização do e-mail ou da CloudPage.

> **💡 Dica:** Situações comuns onde a `LookupRowsCS` faz diferença no dia a dia: códigos de cupom promocional (ex: "NATAL2024" vs "natal2024"), SKUs de produto, tokens de autenticação e qualquer campo onde a caixa do texto carrega significado. Se a distinção de caixa não importa para o seu caso, prefira a [LookupRows](../data-extension-functions/lookuprows.md) - ela é mais tolerante e evita que dados deixem de ser encontrados por diferença de maiúsculas/minúsculas.

## Funções relacionadas

- [LookupRows](../data-extension-functions/lookuprows.md) - versão case-insensitive desta função
- [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) - permite ordenar o resultado por uma coluna e direção
- [LookupOrderedRowsCS](../data-extension-functions/lookuporderedrowscs.md) - versão case-sensitive com ordenação
- [Lookup](../data-extension-functions/lookup.md) - retorna o valor de uma única coluna em vez de linhas inteiras
- [Row](../data-extension-functions/row.md) - extrai uma linha específica do rowset retornado
- [RowCount](../data-extension-functions/rowcount.md) - conta o número de linhas no rowset
- [Field](../data-extension-functions/field.md) - extrai o valor de uma coluna de uma linha do rowset