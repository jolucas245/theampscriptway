---
title: TransformXML
sidebar_label: TransformXML
description: Aplica uma transformação XSL a dados XML, convertendo o conteúdo XML em outro formato usando uma folha de estilos XSLT.
---

<!-- generated-by-script -->

# TransformXML

## Descrição

A função `TransformXML` aplica uma transformação XSL (XSLT) a um documento XML, gerando um novo conteúdo transformado como resultado. Basicamente, você passa um XML de origem e um documento XSL com as regras de transformação, e a função retorna o XML transformado. Essa função foi projetada originalmente para uso com o **Classic Content** e pode lançar exceções quando usada com o **Content Builder** — veja a seção de Observações para contornar esse problema.

## Sintaxe

```ampscript
TransformXML(xmlDocument, xslDocument)
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---------------|--------|-------------|-----------|
| xmlDocument | string | Sim | O documento XML de origem que será transformado. Você pode usar outra função, como `GetPortfolioItem()`, para recuperar o conteúdo XML. |
| xslDocument | string | Sim | O documento XSL (folha de estilos XSLT) que contém as regras de transformação a serem aplicadas ao XML. Também pode ser recuperado via outra função. |

## Exemplo básico

Imagine que a **Lojas Vitória** tem um catálogo de produtos em XML e quer transformá-lo em HTML para exibir num e-mail. Neste exemplo, usamos a função `GetPortfolioItem` para buscar os arquivos do Portfolio (Classic Content):

```ampscript
%%[
/* Recupera o XML com dados de produtos do Portfolio */
VAR @xmlProdutos, @xslTemplate, @resultado

SET @xmlProdutos = GetPortfolioItem("catalogo_produtos.xml")
SET @xslTemplate = GetPortfolioItem("template_produtos.xsl")

/* Aplica a transformação XSL ao XML */
SET @resultado = TransformXML(@xmlProdutos, @xslTemplate)
]%%

%%=TreatAsContent(@resultado)=%%
```

**Conteúdo de `catalogo_produtos.xml` (exemplo):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<produtos>
  <produto>
    <nome>Camiseta Básica</nome>
    <preco>R$ 49,90</preco>
    <link>https://www.lojasvitoria.com.br/camiseta-basica</link>
  </produto>
  <produto>
    <nome>Calça Jeans Slim</nome>
    <preco>R$ 189,90</preco>
    <link>https://www.lojasvitoria.com.br/calca-jeans-slim</link>
  </produto>
</produtos>
```

**Conteúdo de `template_produtos.xsl` (exemplo):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/produtos">
    <table>
      <tr><th>Produto</th><th>Preço</th><th>Link</th></tr>
      <xsl:for-each select="produto">
        <tr>
          <td><xsl:value-of select="nome"/></td>
          <td><xsl:value-of select="preco"/></td>
          <td><a href="{link}">Ver produto</a></td>
        </tr>
      </xsl:for-each>
    </table>
  </xsl:template>
</xsl:stylesheet>
```

**Saída:**
```html
<table>
  <tr><th>Produto</th><th>Preço</th><th>Link</th></tr>
  <tr>
    <td>Camiseta Básica</td>
    <td>R$ 49,90</td>
    <td><a href="https://www.lojasvitoria.com.br/camiseta-basica">Ver produto</a></td>
  </tr>
  <tr>
    <td>Calça Jeans Slim</td>
    <td>R$ 189,90</td>
    <td><a href="https://www.lojasvitoria.com.br/calca-jeans-slim">Ver produto</a></td>
  </tr>
</table>
```

## Exemplo avançado

Se você precisa usar `TransformXML` com o **Content Builder**, a solução é converter seus documentos XML e XSL para **Base64**, armazená-los como content blocks e depois decodificá-los com `Base64Decode` antes de passar para a função. Aqui, a **FarmaRede** transforma um XML de ofertas de Dia das Mães:

```ampscript
%%[
/*
  Os conteúdos XML e XSL foram convertidos para Base64
  e salvos como Content Blocks no Content Builder.
  
  Content Block "xml_ofertas_maes_b64" contém o XML em Base64
  Content Block "xsl_ofertas_template_b64" contém o XSL em Base64
*/

VAR @xmlBase64, @xslBase64, @xmlDoc, @xslDoc, @resultado

/* Recupera os content blocks com conteúdo em Base64 */
SET @xmlBase64 = ContentBlockByName("xml_ofertas_maes_b64")
SET @xslBase64 = ContentBlockByName("xsl_ofertas_template_b64")

/* Decodifica de Base64 para o conteúdo original */
SET @xmlDoc = Base64Decode(@xmlBase64)
SET @xslDoc = Base64Decode(@xslBase64)

/* Aplica a transformação */
SET @resultado = TransformXML(@xmlDoc, @xslDoc)
]%%

<!-- Renderiza o resultado, interpretando qualquer AMPscript embutido -->
%%=TreatAsContent(@resultado)=%%
```

**Conteúdo original do XML (antes da codificação Base64):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<ofertas campanha="Dia das Mães 2025">
  <oferta>
    <nome>Kit Skincare Premium</nome>
    <precoOriginal>R$ 299,90</precoOriginal>
    <precoPromocional>R$ 199,90</precoPromocional>
    <desconto>33%</desconto>
    <url>https://www.farmarede.com.br/kit-skincare</url>
  </oferta>
  <oferta>
    <nome>Perfume Floral 100ml</nome>
    <precoOriginal>R$ 189,90</precoOriginal>
    <precoPromocional>R$ 149,90</precoPromocional>
    <desconto>21%</desconto>
    <url>https://www.farmarede.com.br/perfume-floral</url>
  </oferta>
</ofertas>
```

**Conteúdo original do XSL (antes da codificação Base64):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/ofertas">
    <div style="font-family: Arial, sans-serif;">
      <h2>🌷 Ofertas Dia das Mães - <xsl:value-of select="@campanha"/></h2>
      <p>Frete grátis acima de R$ 299! Use o cupom MAMAE2025.</p>
      <xsl:for-each select="oferta">
        <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0;">
          <h3><xsl:value-of select="nome"/></h3>
          <p style="text-decoration: line-through; color: #999;">
            De: <xsl:value-of select="precoOriginal"/>
          </p>
          <p style="color: #e91e63; font-size: 20px; font-weight: bold;">
            Por: <xsl:value-of select="precoPromocional"/>
            (<xsl:value-of select="desconto"/> OFF)
          </p>
          <a href="{url}" style="background: #e91e63; color: #fff; padding: 10px 20px; text-decoration: none;">
            Comprar agora
          </a>
        </div>
      </xsl:for-each>
    </div>
  </xsl:template>
</xsl:stylesheet>
```

**Saída:**
```html
<div style="font-family: Arial, sans-serif;">
  <h2>🌷 Ofertas Dia das Mães - Dia das Mães 2025</h2>
  <p>Frete grátis acima de R$ 299! Use o cupom MAMAE2025.</p>
  <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0;">
    <h3>Kit Skincare Premium</h3>
    <p style="text-decoration: line-through; color: #999;">De: R$ 299,90</p>
    <p style="color: #e91e63; font-size: 20px; font-weight: bold;">
      Por: R$ 199,90 (33% OFF)
    </p>
    <a href="https://www.farmarede.com.br/kit-skincare" style="background: #e91e63; color: #fff; padding: 10px 20px; text-decoration: none;">
      Comprar agora
    </a>
  </div>
  <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0;">
    <h3>Perfume Floral 100ml</h3>
    <p style="text-decoration: line-through; color: #999;">De: R$ 189,90</p>
    <p style="color: #e91e63; font-size: 20px; font-weight: bold;">
      Por: R$ 149,90 (21% OFF)
    </p>
    <a href="https://www.farmarede.com.br/perfume-floral" style="background: #e91e63; color: #fff; padding: 10px 20px; text-decoration: none;">
      Comprar agora
    </a>
  </div>
</div>
```

## Observações

- **Projetada para Classic Content:** A função `TransformXML` foi criada para funcionar com o Classic Content. Se você está usando Content Builder (que é o padrão hoje em dia), ela **pode lançar uma exceção**.
- **Workaround para Content Builder:** Para usar com Content Builder, converta seus documentos XML e XSL para **Base64**, salve-os como content blocks e use a função [Base64Decode](../encryption-functions/base64decode.md) para decodificá-los antes de passá-los para `TransformXML`. No entanto, isso torna a manutenção e o debug bem mais difíceis.
- **Recomendação oficial da Salesforce:** Como o processo de codificação em Base64 dificulta a manutenção, a Salesforce recomenda que, sempre que possível, você use a função [BuildRowsetFromXml](../content-functions/buildrowsetfromxml.md) como alternativa para manipular conteúdo XML.
- **Use com TreatAsContent:** Se o XML transformado contiver código AMPscript, você precisa passar o resultado pela função [TreatAsContent](../utility-functions/treatascontent.md) para que o AMPscript embutido seja interpretado e executado.
- **GetPortfolioItem:** No Classic Content, você pode usar [GetPortfolioItem](../content-functions/getportfolioitem.md) para recuperar os arquivos XML e XSL diretamente do Portfolio.
- **Função legada:** Como o Classic Content está sendo descontinuado pela Salesforce, essa função é considerada legada. Se você está começando um projeto novo, prefira abordagens mais modernas como `BuildRowsetFromXml` ou até Server-Side JavaScript (SSJS) para manipulação de XML.

## Funções relacionadas

- [BuildRowsetFromXml](../content-functions/buildrowsetfromxml.md) — alternativa recomendada pela Salesforce para trabalhar com conteúdo XML
- [TreatAsContent](../utility-functions/treatascontent.md) — interpreta e executa AMPscript presente no resultado da transformação
- [Base64Decode](../encryption-functions/base64decode.md) — decodifica conteúdo Base64, necessária para o workaround com Content Builder
- [Base64Encode](../encryption-functions/base64encode.md) — codifica conteúdo em Base64 para armazenar XML/XSL como content blocks
- [GetPortfolioItem](../content-functions/getportfolioitem.md) — recupera arquivos do Portfolio (Classic Content)
- [ContentBlockByName](../content-functions/contentblockbyname.md) — recupera content blocks pelo nome no Content Builder
- [ContentBlockById](../content-functions/contentblockbyid.md) — recupera content blocks pelo ID no Content Builder
- [BuildRowsetFromString](../content-functions/buildrowsetfromstring.md) — cria um rowset a partir de uma string delimitada