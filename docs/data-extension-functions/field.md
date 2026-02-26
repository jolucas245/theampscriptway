---
title: Field
sidebar_label: Field
description: Retorna o valor de um campo específico a partir de um objeto de linha (row) de uma Data Extension ou rowset.
---

<!-- generated-by-script -->

# Field

## Descrição

A função `Field()` extrai o valor de um campo específico a partir de um objeto de linha (row). Você vai usar ela o tempo todo quando trabalhar com dados retornados por funções como `LookupRows()`, `LookupOrderedRows()` ou `BuildRowsetFromJson()`, já que essas funções retornam rowsets — e para acessar o valor de cada campo individual, você precisa combinar `Row()` com `Field()`. Basicamente, ela é a peça final do quebra-cabeça quando você quer pegar um dado pontual de uma consulta a Data Extension.

## Sintaxe

```ampscript
Field(row, fieldName, boolExceptionIfNotFound)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| row | string | Sim | O objeto de linha (row) que contém o campo que você quer retornar. Normalmente vem da função `Row()`. |
| fieldName | string | Sim | O nome do campo que você quer extrair da linha. |
| boolExceptionIfNotFound | boolean | Não | Se `true`, a função gera uma exceção (erro) caso o campo especificado não exista. Se `false`, retorna uma string vazia caso o campo não exista. O valor padrão é `true`. |

## Exemplo básico

Imagine que você tem uma Data Extension chamada **Clientes** com os campos `NomeCompleto`, `Email` e `Cidade`. Você quer buscar o nome de um cliente pelo e-mail e exibir no corpo do e-mail:

```ampscript
%%[
SET @rows = LookupRows("Clientes", "Email", "joao.silva@email.com.br")
SET @primeiraLinha = Row(@rows, 1)
SET @nome = Field(@primeiraLinha, "NomeCompleto")
]%%

Olá, %%=v(@nome)=%%! Tudo bem?
```

**Saída:**
```
Olá, João Silva! Tudo bem?
```

## Exemplo avançado

Cenário real: você está montando um e-mail de programa de fidelidade para a **MegaStore**. Quer listar os últimos pedidos do cliente, mostrando o produto, o valor e a data da compra. Os dados estão na Data Extension **Pedidos** com os campos `SubscriberKey`, `Produto`, `Valor`, `DataCompra`.

```ampscript
%%[
SET @subKey = AttributeValue("_subscriberkey")
SET @pedidos = LookupOrderedRows("Pedidos", 3, "DataCompra DESC", "SubscriberKey", @subKey)
SET @totalPedidos = RowCount(@pedidos)

IF @totalPedidos > 0 THEN
]%%

<h2>Seus últimos pedidos na MegaStore</h2>
<table>
  <tr>
    <th>Produto</th>
    <th>Valor</th>
    <th>Data</th>
  </tr>

%%[
  FOR @i = 1 TO @totalPedidos DO
    SET @linha = Row(@pedidos, @i)
    SET @produto = Field(@linha, "Produto")
    SET @valor = Field(@linha, "Valor")
    SET @data = Field(@linha, "DataCompra")
    SET @valorFormatado = FormatCurrency(@valor, "pt-BR", 2)
    SET @dataFormatada = FormatDate(@data, "dd/MM/yyyy")
]%%

  <tr>
    <td>%%=v(@produto)=%%</td>
    <td>%%=v(@valorFormatado)=%%</td>
    <td>%%=v(@dataFormatada)=%%</td>
  </tr>

%%[
  NEXT @i
]%%

</table>

%%[ ELSE ]%%

<p>Você ainda não tem pedidos. Aproveite o frete grátis acima de R$299!</p>

%%[ ENDIF ]%%
```

**Saída:**
```html
Seus últimos pedidos na MegaStore

Produto            | Valor      | Data
Fone Bluetooth     | R$ 189,90  | 15/05/2025
Camiseta Esportiva | R$ 79,90   | 02/05/2025
Mochila Urbana     | R$ 149,00  | 28/04/2025
```

### Exemplo com dados JSON

Você também pode usar `Field()` com rowsets criados a partir de JSON, o que é super útil quando você consome APIs externas:

```ampscript
%%[
SET @json = '[{"nome":"Maria Santos","pontos":4500},{"nome":"Carlos Oliveira","pontos":3200}]'
SET @rowset = BuildRowsetFromJson(@json, "$.*", 0)
SET @primeiraLinha = Row(@rowset, 1)
SET @nomeCliente = Field(@primeiraLinha, "nome")
SET @pontosCliente = Field(@primeiraLinha, "pontos")
]%%

%%=v(@nomeCliente)=%% tem %%=v(@pontosCliente)=%% pontos no programa de fidelidade.
```

**Saída:**
```
Maria Santos tem 4500 pontos no programa de fidelidade.
```

### Exemplo com tratamento de campo inexistente

Quando você não tem certeza se um campo existe na linha, use o terceiro parâmetro como `false` para evitar que o e-mail quebre:

```ampscript
%%[
SET @rows = LookupRows("Clientes", "Email", "carlos.oliveira@email.com.br")
SET @linha = Row(@rows, 1)

/* Com o terceiro parâmetro false, retorna vazio se o campo não existir */
SET @cpf = Field(@linha, "CPF", false)

IF Empty(@cpf) THEN
  SET @mensagem = "CPF não informado. Atualize seu cadastro em www.megastore.com.br/perfil"
ELSE
  SET @mensagem = Concat("CPF cadastrado: ", @cpf)
ENDIF
]%%

%%=v(@mensagem)=%%
```

**Saída (se o campo CPF não existir):**
```
CPF não informado. Atualize seu cadastro em www.megastore.com.br/perfil
```

## Observações

- A função `Field()` **não** consulta Data Extensions diretamente. Ela precisa receber um objeto de linha (row), que normalmente vem de funções como `LookupRows()`, `LookupOrderedRows()`, `Row()` ou `BuildRowsetFromJson()`.
- O parâmetro `fieldName` **não** diferencia maiúsculas de minúsculas (case-insensitive). Tanto `Field(@row, "NomeCompleto")` quanto `Field(@row, "nomecompleto")` funcionam.
- Por padrão, se o campo especificado não existir na linha, a função vai gerar um **erro** e o e-mail pode não ser enviado. Use o terceiro parâmetro como `false` quando quiser evitar isso.
- Para acessar dados de um rowset, você sempre precisa combinar `Row()` + `Field()`. `Field()` sozinha não aceita um rowset inteiro — só aceita uma linha individual.
- Se o rowset estiver vazio e você tentar usar `Row()` para pegar uma linha que não existe, o erro vai acontecer em `Row()`, não em `Field()`. Sempre valide com `RowCount()` antes.
- Funciona em todos os contextos do SFMC: e-mails, CloudPages, SMS e automações com Script Activities.

## Funções relacionadas

- [Row](../data-extension-functions/row.md) — Extrai uma linha específica de um rowset pelo índice. Usada em conjunto com `Field()` para acessar campos individuais.
- [RowCount](../data-extension-functions/rowcount.md) — Retorna o número de linhas de um rowset. Essencial para validar antes de usar `Row()` e `Field()`.
- [LookupRows](../data-extension-functions/lookuprows.md) — Busca múltiplas linhas de uma Data Extension. O rowset retornado é usado com `Row()` e `Field()`.
- [LookupOrderedRows](../data-extension-functions/lookuporderedrows.md) — Igual ao `LookupRows()`, mas com ordenação e limite de linhas.
- [Lookup](../data-extension-functions/lookup.md) — Retorna o valor de um único campo diretamente, sem precisar de `Row()` e `Field()`. Mais simples quando você precisa de só um campo.
- [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md) — Cria um rowset a partir de dados JSON, que pode ser percorrido com `Row()` e `Field()`.
- [BuildRowsetFromString](../content-functions/buildrowsetfromstring.md) — Cria um rowset a partir de uma string delimitada.
- [BuildRowsetFromXml](../content-functions/buildrowsetfromxml.md) — Cria um rowset a partir de dados XML.
- [Empty](../utility-functions/empty.md) — Verifica se um valor está vazio. Útil para checar o retorno de `Field()` quando o terceiro parâmetro é `false`.
- [AttributeValue](../utility-functions/attributevalue.md) — Retorna o valor de um atributo do subscriber ou de um campo da Sendable DE sem gerar erro se não existir.
- [V](../utility-functions/v.md) — Exibe o valor de uma variável inline no HTML.