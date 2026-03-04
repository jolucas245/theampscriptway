---
title: BuildRowsetFromXml
sidebar_label: BuildRowsetFromXml
description: Carrega dados XML em um rowset para uso programático em conteúdos AMPscript.
---

# BuildRowsetFromXml

## Descrição

Carrega dados XML em um rowset, permitindo que você percorra e extraia informações estruturadas de um conteúdo XML diretamente no AMPscript. É extremamente útil quando você recebe dados de APIs externas via [HTTPGet](../http-functions/httpget.md) ou [HTTPPost](../http-functions/httppost.md) em formato XML e precisa renderizar essas informações em e-mails ou CloudPages. A função é executada no momento do envio para mensagens e no momento do carregamento para CloudPages.

## Sintaxe

```ampscript
BuildRowsetFromXml(xmlData, xpathExpression, boolReturnEmptyOnError)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| xmlData | string | Sim | Os dados XML que você quer parsear. |
| xpathExpression | string | Sim | A expressão XPath usada para localizar os nós desejados nos dados XML. |
| boolReturnEmptyOnError | boolean | Sim | Se `false`, retorna um rowset vazio quando há erro de sintaxe na função ou na expressão XPath. Se `true`, retorna uma exceção quando ocorre um erro. |

## Exemplo básico

Extraindo uma lista de produtos de um XML para exibir em um e-mail promocional da MegaStore.

```ampscript
%%[

SET @xml = "<produtos><produto><nome>Notebook Gamer</nome><preco>R$ 5.499,90</preco></produto><produto><nome>Monitor 27pol</nome><preco>R$ 1.299,90</preco></produto><produto><nome>Teclado Mecânico</nome><preco>R$ 349,90</preco></produto></produtos>"

SET @rowset = BuildRowsetFromXml(@xml, "//produto", false)

FOR @i = 1 TO RowCount(@rowset) DO

  SET @row = Row(@rowset, @i)
  SET @nome = Field(@row, "nome")
  SET @preco = Field(@row, "preco")

]%%

Produto: %%=V(@nome)=%% — %%=V(@preco)=%%

%%[ NEXT @i ]%%
```

**Saída:**
```
Produto: Notebook Gamer — R$ 5.499,90
Produto: Monitor 27pol — R$ 1.299,90
Produto: Teclado Mecânico — R$ 349,90
```

## Exemplo avançado

Cenário real de régua de relacionamento: o Banco Meridional retorna dados de transações recentes do cliente via API em XML. Você precisa montar uma tabela no e-mail com as últimas movimentações, incluindo atributos dos nós.

```ampscript
%%[

SET @xmlTransacoes = Concat( "<extrato conta='12345-6' agencia='0001'>", "<transacao tipo='debito'><descricao>Supermercados Bela Vista</descricao><valor>R$ 287,45</valor><data>15/06/2025</data></transacao>", "<transacao tipo='pix'><descricao>João Silva</descricao><valor>R$ 150,00</valor><data>14/06/2025</data></transacao>", "<transacao tipo='credito'><descricao>Salário - Grupo Horizonte</descricao><valor>R$ 8.500,00</valor><data>10/06/2025</data></transacao>", "</extrato>" )

SET @transacoes = BuildRowsetFromXml(@xmlTransacoes, "//transacao", false)
SET @totalTransacoes = RowCount(@transacoes)

IF @totalTransacoes > 0 THEN

]%%

<table>
  <tr>
    <th>Data</th>
    <th>Descrição</th>
    <th>Tipo</th>
    <th>Valor</th>
  </tr>

%%[

  FOR @t = 1 TO @totalTransacoes DO

    SET @linha = Row(@transacoes, @t)
    SET @descricao = Field(@linha, "descricao")
    SET @valor = Field(@linha, "valor")
    SET @data = Field(@linha, "data")
    SET @tipo = Field(@linha, "tipo")

]%%

  <tr>
    <td>%%=V(@data)=%%</td>
    <td>%%=V(@descricao)=%%</td>
    <td>%%=ProperCase(V(@tipo))=%%</td>
    <td>%%=V(@valor)=%%</td>
  </tr>

%%[

  NEXT @t

]%%

</table>

%%[ ENDIF ]%%
```

**Saída:**
```
Data         | Descrição                      | Tipo    | Valor
15/06/2025   | Supermercados Bela Vista       | Debito  | R$ 287,45
14/06/2025   | João Silva                     | Pix     | R$ 150,00
10/06/2025   | Salário - Grupo Horizonte      | Credito | R$ 8.500,00
```

## Observações

- O rowset retornado inclui automaticamente uma coluna para cada **atributo** encontrado em qualquer nó correspondente à expressão XPath. No exemplo avançado, o atributo `tipo` da tag `<transacao>` é acessível via [Field](../data-extension-functions/field.md). Se um nó não tiver determinado atributo presente em outros nós, o rowset retorna um valor vazio para aquela coluna.

> **⚠️ Atenção:** Os seguintes tipos de nós XML **não retornam valor**: CDATA, Comment, Document, Document Fragments, DocumentType, Entities, Entity References, Notation, ProcessingInformation, Whitespace e XmlDeclaration. Se seu XML depende fortemente de seções CDATA, por exemplo, os dados dentro delas não serão extraídos.

> **⚠️ Atenção:** Preste atenção no parâmetro `boolReturnEmptyOnError`. Use `false` se quiser que o e-mail seja enviado mesmo quando houver erro no XML (retorna rowset vazio) — ideal para envios em massa onde você não quer que um XML malformado quebre o envio inteiro. Use `true` apenas quando precisar identificar erros explicitamente, como em CloudPages de diagnóstico.

> **💡 Dica:** Para percorrer o rowset retornado, combine com [Row](../data-extension-functions/row.md), [RowCount](../data-extension-functions/rowcount.md) e [Field](../data-extension-functions/field.md) — esse é o trio padrão para trabalhar com qualquer rowset no AMPscript.

> **💡 Dica:** Se os dados que você precisa parsear estão em formato JSON e não XML, use [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md). Para dados simples separados por delimitador, veja [BuildRowsetFromString](../content-functions/buildrowsetfromstring.md).

## Funções relacionadas

- [BuildRowsetFromString](../content-functions/buildrowsetfromstring.md) — cria rowset a partir de string com delimitador
- [BuildRowsetFromJson](../content-functions/buildrowsetfromjson.md) — cria rowset a partir de dados JSON
- [TransformXML](../content-functions/transformxml.md) — transforma XML usando XSLT
- [Row](../data-extension-functions/row.md) — acessa uma linha específica do rowset
- [RowCount](../data-extension-functions/rowcount.md) — conta o número de linhas do rowset
- [Field](../data-extension-functions/field.md) — extrai o valor de uma coluna de uma linha do rowset
- [HTTPGet](../http-functions/httpget.md) — obtém dados de uma URL externa (frequentemente XML)
- [HTTPPost](../http-functions/httppost.md) — envia dados e recebe resposta (frequentemente XML)