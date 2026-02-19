---
title: "TransformXML"
---


The `TransformXML` function applies an XSL (Extensible Stylesheet Language) transformation to an XML (Extensible Markup Language) document. This function is crucial for converting XML data from one format to another, often used for dynamic content generation in emails, landing pages, or SMS messages within Salesforce Marketing Cloud.

### Arguments

| Ordinal | Type   | Required | Description                                   |
|---------|--------|----------|-----------------------------------------------|
| 1       | String | True     | The XML content to be transformed.            |
| 2       | String | True     | The XSL document used for the transformation. |

> NOTE: This function supports the [XPATH 1.0 specification](https://www.w3.org/TR/xpath/).

> NOTE: The `TransformXML` function was primarily designed for use with Classic Content. When used with Content Builder, it may throw an exception. For workarounds, consider Base64 encoding the XML and XSL documents and decoding them using `Base64Decode()` before passing them to `TransformXML()`. However, this approach can make maintenance and debugging challenging. An alternative is to use `BuildRowsetFromXml()` for XML processing.

> TIP: While XSL transformations are powerful, especially with embedded AMPscript, their use in Marketing Cloud can make emails difficult to maintain due to the way HTML code is handled in Classic Content and Content Builder editors. It is recommended to develop XSL emails outside Marketing Cloud using an appropriate IDE.

### Example 1: Basic Use with GetPortfolioItem

This example demonstrates how to use `TransformXML` with `GetPortfolioItem` to retrieve an XSL stylesheet from the Portfolio and apply it to a literal XML string. The result is then processed by `TreatAsContent` to evaluate any embedded AMPscript.

```html
%%[
    /* Declare variables for XML and XSL content */
    VAR @xmlContent, @xslContent, @transformedContent

    /* Define the XML data to be transformed */
    SET @xmlContent = '<?xml version="1.0" encoding="UTF-8"?>'
    SET @xmlContent = CONCAT(@xmlContent, '<data>')
    SET @xmlContent = CONCAT(@xmlContent, '    <item id="1">')
    SET @xmlContent = CONCAT(@xmlContent, '        <name>Product A</name>')
    SET @xmlContent = CONCAT(@xmlContent, '        <price>10.99</price>')
    SET @xmlContent = CONCAT(@xmlContent, '    </item>')
    SET @xmlContent = CONCAT(@xmlContent, '    <item id="2">')
    SET @xmlContent = CONCAT(@xmlContent, '        <name>Product B</name>')
    SET @xmlContent = CONCAT(@xmlContent, '        <price>20.50</price>')
    SET @xmlContent = CONCAT(@xmlContent, '    </item>')
    SET @xmlContent = CONCAT(@xmlContent, '</data>')

    /* Retrieve the XSL stylesheet from the Portfolio using its Customer Key */
    /* Ensure 'MyXSLStylesheet' exists in your Portfolio with the correct XSL content */
    SET @xslContent = GetPortfolioItem('MyXSLStylesheet')

    /* Check if XSL content was successfully retrieved */
    IF NOT EMPTY(@xslContent) THEN
        /* Apply the XSL transformation to the XML content */
        SET @transformedContent = TransformXML(@xmlContent, @xslContent)

        /* Evaluate any AMPscript within the transformed content */
        OUTPUT(TreatAsContent(@transformedContent))
    ELSE
        /* Handle the case where XSL content is not found */
        OUTPUT(CONCAT('<!-- Error: XSL Stylesheet "MyXSLStylesheet" not found in Portfolio. -->'))
    ENDIF
]%%
```

**Example XSL Stylesheet (MyXSLStylesheet.xsl in Portfolio):**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/data">
        <h2>Product List</h2>
        <ul>
            <xsl:for-each select="item">
                <li>
                    <strong><xsl:value-of select="name"/></strong>: $<xsl:value-of select="price"/>
                </li>
            </xsl:for-each>
        </ul>
    </xsl:template>
</xsl:stylesheet>
```

### Example 2: Advanced Scenario with Base64 Encoding for Content Builder

This example illustrates a workaround for using `TransformXML` with Content Builder assets by Base64 encoding the XML and XSL. This method allows the function to be used in environments where `GetPortfolioItem` might not be suitable or when content is stored in Content Builder.

```html
%%[
    /* Declare variables for Base64 encoded XML and XSL, and their decoded versions */
    VAR @encodedXml, @encodedXsl, @decodedXml, @decodedXsl, @transformedContent

    /* Assume these are retrieved from Content Builder blocks or Data Extension fields */
    /* For demonstration, we'll use literal Base64 encoded strings */

    /* Base64 encoded XML: <root><message>Hello from Content Builder!</message></root> */
    SET @encodedXml = 'PHJvb3Q+PG1lc3NhZ2U+SGVsbG8gZnJvbSBDb250ZW50IEJ1aWxkZXIhPC9tZXNzYWdlPjwvcm9vdD4='

    /* Base64 encoded XSL: <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:template match="/"><h1><xsl:value-of select="/root/message"/></h1></xsl:template></xsl:stylesheet> */
    SET @encodedXsl = 'PHhzbDpzdHlsZXNoZWV0IHZlcnNpb249IjEuMCIgeG1sbnM6eHNsPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L1hTTC9UcmFuc2Zvcm0iPjx4c2w6dGVtcGxhdGUgbWF0Y2g9Ii8iPjxoMT48eHNsOnZhbHVlLW9mIHNlbGVjdD0iL3Jvb3QvbWVzc2FnZSIvPjwvaDE+PC94c2w6dHlsZXNoZWV0Pg=='

    /* Decode the Base64 strings to get the original XML and XSL content */
    SET @decodedXml = Base64Decode(@encodedXml)
    SET @decodedXsl = Base64Decode(@encodedXsl)

    /* Check if both decoded contents are not empty */
    IF NOT EMPTY(@decodedXml) AND NOT EMPTY(@decodedXsl) THEN
        /* Apply the XSL transformation */
        SET @transformedContent = TransformXML(@decodedXml, @decodedXsl)

        /* Output the transformed content */
        OUTPUT(@transformedContent)
    ELSE
        /* Handle cases where decoding failed or content was empty */
        OUTPUT(CONCAT('<!-- Error: Decoded XML or XSL content is empty. -->'))
    ENDIF
]%%
```

**Output for Example 2:**

```html
<h1>Hello from Content Builder!</h1>
```
