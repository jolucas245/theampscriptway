---
title: RowCount
sidebar_label: RowCount
description: Retorna o número de linhas em um rowset ou array obtido de uma Data Extension ou outra fonte de dados.
---

<!-- generated-by-script -->

# RowCount

## Descrição

A função `RowCount` retorna a quantidade de linhas presentes em um rowset ou array. É uma das funções mais usadas no dia a dia do AMPscript, porque você quase sempre precisa saber quantos registros uma consulta retornou antes de iterar sobre eles com um `FOR`. Ela é essencial para evitar erros ao tentar acessar dados de um rowset vazio — por exemplo, quando um `LookupRows` não encontra nenhum resultado.

## Sintaxe

```ampscript
RowCount(@rowset)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| rowset | Rowset / Array | Sim | O rowset ou array do qual você quer saber o número de linhas. Geralmente é o resultado de funções como `LookupRows`, `LookupOrderedRows`, `BuildRowsetFromString`, entre outras. |

## Retorno

Retorna um valor numérico inteiro representando a quantidade de linhas no rowset ou array. Se o rowset estiver vazio, retorna `0`.

## Exemplo básico

Imagine que você tem uma Data Extension chamada **Pedidos** com os pedidos dos clientes da loja fictícia "Lojas Vitória". Você quer mostrar no e-mail quantos pedidos o cliente tem:

```ampscript
%%[
SET @emailCliente = AttributeValue("EmailAddress")
SET @pedidos = LookupRows("Pedidos", "Email", @emailCliente)
SET @totalPedidos = RowCount(@pedidos)
]%%

Olá! Você tem %%=v(@totalPedidos)=%% pedido(s) registrado(s) na Lojas Vitória.
```

**Saída:**
```
Olá! Você tem 3 pedido(s) registrado(s) na Lojas Vitória.
```

## Exemplo avançado

Cenário real: a "MegaStore" quer enviar um e-mail personalizado de Dia das Mães. Se o cliente tem itens na lista de desejos, mostra os produtos. Se não tem nenhum, mostra uma mensagem genérica com sugestões. Além disso, se tem mais de 3 itens, oferece frete grátis.

```ampscript
%%[
SET @email = AttributeValue("EmailAddress")
SET @listaDesejos = LookupRows("ListaDesejos", "Email", @email)
SET @qtdItens = RowCount(@listaDesejos)
]%%

%%[ IF @qtdItens > 0 THEN ]%%

  <h2>Seus favoritos estão esperando por você neste Dia das Mães! 💐</h2>
  <p>Você tem %%=v(@qtdItens)=%% item(ns) na sua lista de desejos:</p>

  <table>
    <tr>
      <th>Produto</th>
      <th>Preço</th>
    </tr>
    %%[ FOR @i = 1 TO @qtdItens DO ]%%
      %%[
        SET @linha = Row(@listaDesejos, @i)
        SET @nomeProduto = Field(@linha, "NomeProduto")
        SET @preco = Field(@linha, "Preco")
      ]%%
      <tr>
        <td>%%=v(@nomeProduto)=%%</td>
        <td>%%=FormatCurrency(v(@preco), "R", 2)=%%</td>
      </tr>
    %%[ NEXT @i ]%%
  </table>

  %%[ IF @qtdItens >= 3 THEN ]%%
    <p>🎉 <strong>Parabéns!</strong> Com 3 ou mais itens na lista, você ganhou <strong>frete grátis</strong> em compras acima de R$299,00!</p>
  %%[ ENDIF ]%%

%%[ ELSE ]%%

  <h2>Feliz Dia das Mães! 💐</h2>
  <p>Ainda não adicionou nada à sua lista de desejos? Confira nossas sugestões especiais:</p>
  <a href="https://www.megastore.com.br/diadasmaes">Ver sugestões de presentes</a>

%%[ ENDIF ]%%
```

**Saída (quando o cliente tem 3 itens na lista):**
```
Seus favoritos estão esperando por você neste Dia das Mães! 💐
Você tem 3 item(ns) na sua lista de desejos:

Produto              | Preço
Bolsa Couro Premium  | R$459,90
Kit Perfume Floral   | R$189,00
Colar Prata 925      | R$329,00

🎉 Parabéns! Com 3 ou mais itens na lista, você ganhou frete grátis em compras acima de R$299,00!
```

**Saída (quando o cliente não tem itens):**
```
Feliz Dia das Mães! 💐
Ainda não adicionou nada à sua lista de desejos? Confira nossas sugestões especiais:
[Link: Ver sugestões de presentes]
```

## Observações

- **Sempre verifique antes de iterar.** Usar `RowCount` antes de um loop `FOR` é uma boa prática essencial. Se você tentar acessar linhas de um rowset vazio com `Row()`, vai receber um erro no envio.
- **Funciona com qualquer rowset ou array.** Não importa se o rowset veio de `LookupRows`, `LookupOrderedRows`, `BuildRowsetFromString`, `BuildRowsetFromXml`, `BuildRowsetFromJson` ou `ExecuteFilter` — o `RowCount` funciona com todos eles.
- **Não confunda com `DataExtensionRowCount`.** A função `DataExtensionRowCount` retorna o número **total** de linhas de uma Data Extension inteira, sem filtro. Já `RowCount` conta as linhas de um rowset que já foi filtrado/retornado por outra função.
- **Retorno zero não gera erro.** Se o rowset não tem resultados, `RowCount` retorna `0` normalmente — você pode usar isso em uma condicional `IF` sem problemas.
- **Cuidado com o escopo.** Se a variável do rowset não foi definida (por exemplo, por um erro de digitação no nome), o `RowCount` pode gerar erro. Certifique-se de que a variável do rowset foi atribuída corretamente antes de passá-la para `RowCount`.

## Funções relacionadas

- [LookupRows](../data-extension-functions/lookuprows.md) — busca múltiplas linhas em uma Data Extension e retorna um rowset (par perfeito com `RowCount`)
- [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) — igual ao `LookupRows`, mas com ordenação dos resultados
- [Row](../data-extension-functions/row.md) — acessa uma linha específica do rowset pelo índice (use junto com `RowCount` no loop)
- [Field](../data-extension-functions/field.md) — extrai o valor de uma coluna específica de uma linha do rowset
- [DataExtensionRowCount](../data-extension-functions/dataextensionrowcount.md) — retorna o total de linhas de uma Data Extension inteira (sem filtro)
- [BuildRowsetFromString](../content-functions/buildrowsetfromstring.md) — cria um rowset a partir de uma string delimitada (compatível com `RowCount`)
- [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md) — cria um rowset a partir de JSON (compatível com `RowCount`)
- [ExecuteFilter](../data-extension-functions/executefilter.md) — executa um filtro de dados e retorna um rowset
- [Empty](../utility-functions/empty.md) — verifica se um valor está vazio (alternativa para checar rowsets)