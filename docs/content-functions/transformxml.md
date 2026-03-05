---
title: TransformXML
sidebar_label: TransformXML
description: Aplica uma transformação XSL a dados XML, retornando o resultado da transformação.
---

# TransformXML

## Descrição

A função `TransformXML()` aplica uma transformação XSL (XSLT) a um documento XML. Ela foi projetada para uso com **Classic Content** e permite que você transforme dados XML usando uma folha de estilo XSL, o que é útil quando você precisa converter estruturas XML em HTML ou outros formatos para exibição em e-mails ou páginas. Você pode usar outras funções, como [`GetPortfolioItem()`](../content-functions/getportfolioitem.md), para recuperar o conteúdo XML ou XSL antes de passá-lo para a transformação.

## Sintaxe

```ampscript
TransformXML(xmlDocument, xslDocument)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| xmlDocument | string | Sim | Os dados XML que serão transformados. |
| xslDocument | string | Sim | O documento XSL que será usado para transformar os dados XML. |

## Exemplo básico

Neste exemplo, recuperamos arquivos XML e XSL do Portfolio (Classic Content) para gerar uma lista de produtos da MegaStore e exibimos o resultado transformado no e-mail.

```ampscript
%%[
VAR @xml, @xsl, @resultado

SET @xml = GetPortfolioItem("catalogo_megastore.xml")
SET @xsl = GetPortfolioItem("catalogo_template.xsl")
SET @resultado = TransformXML(@xml, @xsl)
]%%

%%=TreatAsContent(@resultado)=%%
```

**Saída:**
```
(O HTML resultante da transformação XSL aplicada ao XML do catálogo - por exemplo, uma tabela formatada com os produtos da MegaStore)
```

## Exemplo avançado

Em um cenário onde você migrou para o Content Builder e precisa continuar usando `TransformXML()`, a abordagem é converter os documentos XML e XSL para Base64, armazená-los como content blocks e decodificá-los antes da transformação. Aqui simulamos um cenário de régua de relacionamento da Lojas Vitória com dados de pedidos em XML.

```ampscript
%%[
VAR @xmlBase64, @xslBase64, @xmlDecoded, @xslDecoded, @resultado

/* Recupera os content blocks que contêm o XML e XSL em Base64 */
SET @xmlBase64 = ContentBlockByKey("pedidos-vitoria-xml-b64")
SET @xslBase64 = ContentBlockByKey("pedidos-vitoria-xsl-b64")

/* Decodifica o conteúdo Base64 para obter o XML e XSL originais */
SET @xmlDecoded = Base64Decode(@xmlBase64)
SET @xslDecoded = Base64Decode(@xslBase64)

/* Aplica a transformação XSL ao XML */
SET @resultado = TransformXML(@xmlDecoded, @xslDecoded)
]%%

%%=TreatAsContent(@resultado)=%%
```

**Saída:**
```
(O HTML resultante da transformação - por exemplo, um resumo formatado dos pedidos do cliente na Lojas Vitória, com valores em R$ e datas no formato DD/MM/AAAA conforme definido no XSL)
```

## Observações

> **⚠️ Atenção:** A função `TransformXML()` foi projetada para uso com **Classic Content**. Ao usá-la com o **Content Builder**, ela lança uma exceção. Para contornar isso, você precisa converter os documentos XML e XSL para codificação Base64, armazená-los como content blocks e usar [`Base64Decode()`](../encryption-functions/base64decode.md) para decodificá-los antes de passá-los para a função.

> **⚠️ Atenção:** O processo de converter XML e XSL para Base64 torna o conteúdo difícil de manter e depurar. A Salesforce recomenda evitar esse método quando possível e, em vez disso, usar a função [`BuildRowsetFromXml()`](../content-functions/buildrowsetfromxml.md) para lidar com conteúdo XML.

- Para ambos os parâmetros, você pode usar outra função, como [`GetPortfolioItem()`](../content-functions/getportfolioitem.md), para recuperar o conteúdo XML ou XSL.
- O resultado da transformação pode conter AMPscript. Para que esse AMPscript seja avaliado, passe o resultado para a função [`TreatAsContent()`](../utility-functions/treatascontent.md).

> **💡 Dica:** Se você está começando um projeto novo e precisa trabalhar com XML, considere seriamente usar [`BuildRowsetFromXml()`](../content-functions/buildrowsetfromxml.md) em vez de `TransformXML()`. É mais simples, funciona nativamente com Content Builder e não exige a gambiarra do Base64.

## Funções relacionadas

- [`TreatAsContent()`](../utility-functions/treatascontent.md) - avalia AMPscript contido no resultado da transformação
- [`BuildRowsetFromXml()`](../content-functions/buildrowsetfromxml.md) - alternativa recomendada para lidar com conteúdo XML
- [`Base64Decode()`](../encryption-functions/base64decode.md) - decodifica conteúdo Base64 para uso com Content Builder
- [`GetPortfolioItem()`](../content-functions/getportfolioitem.md) - recupera arquivos XML/XSL do Portfolio (Classic Content)