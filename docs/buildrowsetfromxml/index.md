---
title: "BuildRowsetFromXML"
---


This function creates a row set from an XML string. It returns an error or an empty row set if no XML matches the specified XPATH.

### Arguments

`BuildRowSetFromXML(1,2,3)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | Source XML string to parse |
| 2 | String | True | XPATH string that specifies the root XML node from which to build the row set |
| 3 | Boolean | True | Return an empty row set if XPATH is not found in source string |

> NOTE: This function supports the [XPATH 1.0 specification](https://www.w3.org/TR/1999/REC-xpath-19991116/).
>
> NOTE: The following nodes will return no value:

* CDATA
* Comment
* Document
* Document Fragments
* DocumentType
* Entities
* Entity References
* Notation
* ProcessingInformation
* Whitespace
* XmlDeclaration

### Example 1

The following example retrieves XML node values:

```html
%%[

var @xml, @isXML, @nodes, @rowCount

set @xml = ""
set @xml = concat(@xml, '<?xml version="1.0" encoding="UTF-8"?>')
set @xml = concat(@xml, '<cart>')
set @xml = concat(@xml, '  <items>')
set @xml = concat(@xml, '    <item>')
set @xml = concat(@xml, '       <sku><![CDATA[123]]></sku>')
set @xml = concat(@xml, '       <name><![CDATA[Square]]></name>')
set @xml = concat(@xml, '       <url><![CDATA[https://limedash.com?sku=123]]></url>')
set @xml = concat(@xml, '    </item>')
set @xml = concat(@xml, '    <item>')
set @xml = concat(@xml, '        <sku><![CDATA[456]]></sku>')
set @xml = concat(@xml, '        <name><![CDATA[Circle]]></name>')
set @xml = concat(@xml, '        <url><![CDATA[https://limedash.com?sku=456]]></url>')
set @xml = concat(@xml, '    </item>')
set @xml = concat(@xml, '    <item>')
set @xml = concat(@xml, '        <sku><![CDATA[789]]></sku>')
set @xml = concat(@xml, '        <name><![CDATA[Triangle]]></name>')
set @xml = concat(@xml, '        <url><![CDATA[https://limedash.com?sku=789]]></url>')
set @xml = concat(@xml, '    </item>')
set @xml = concat(@xml, '  </items>')
set @xml = concat(@xml, '</cart> ')

if indexOf(@xml,"<cart>") > 0 then

  set @nodes = BuildRowsetFromXML(@xml,"/cart/items/item",0)
  set @rowCount = rowcount(@nodes)

  if @rowCount > 0 then

    for @i = 1 to @rowCount do

      var @sku
      var @name
      var @url

      set @nodepath = concat("/cart/items/item[",@i,"]/")

      if rowcount(BuildRowsetFromXML(@xml,concat(@nodepath,"sku"))) > 0 then
          set @sku = Field(Row(BuildRowsetFromXML(@xml,concat(@nodepath,"sku"),0),1),'Value')
      endif

      if rowcount(BuildRowsetFromXML(@xml,concat(@nodepath,"name"))) > 0 then
          set @name = Field(Row(BuildRowsetFromXML(@xml,concat(@nodepath,"name"),0),1),'Value')
      endif

      if rowcount(BuildRowsetFromXML(@xml,concat(@nodepath,"url"))) > 0 then
          set @url = Field(Row(BuildRowsetFromXML(@xml,concat(@nodepath,"url"),0),1),'Value')
      endif

      if not empty(@sku) and not empty(@name) and not empty(@url) then

      ]%%

       <br><a href="%%=redirectto(@url)=%%">%%=v(@name)=%% (%%=v(@sku)=%%)</a>

      %%[

      endif

    next @i

  else

   output(concat("<br>no products found"))

  endif

else

  output(concat("<br>no XML found"))

endif

]%%
```

#### Output

```html
<br><a href="https://limedash.com/?sku=123">Square (123)</a>
<br><a href="https://limedash.com/?sku=456">Circle (456)</a>
<br><a href="https://limedash.com/?sku=789">Triangle (789)</a>
```

### Example 2

The following example retrieves values from the XML node attributes:

```html
%%[

var @xml, @isXML, @nodes, @rowCount

set @xml = ""
set @xml = concat(@xml, '<?xml version="1.0" encoding="UTF-8"?>')
set @xml = concat(@xml, '<cart>')
set @xml = concat(@xml, '  <item sku="123" url="https://limedash.com?sku=123">Square</item>')
set @xml = concat(@xml, '  <item sku="246" url="https://limedash.com?sku=246">Circle</item>')
set @xml = concat(@xml, '  <item sku="789" url="https://limedash.com?sku=789">Triangle</item>')
set @xml = concat(@xml, '</cart> ')

if indexOf(@xml,"<cart>") > 0 then

  set @nodes = BuildRowsetFromXML(@xml,"/cart/item",0)
  set @rowCount = rowcount(@nodes)

  if @rowCount > 0 then

    for @i = 1 to @rowCount do

      var @sku
      var @name
      var @url

      set @nodepath = concat("/cart/item[",@i,"]/")

      if rowcount(BuildRowsetFromXML(@xml,concat(@nodepath,"@sku"))) > 0 then
          set @sku = Field(Row(BuildRowsetFromXML(@xml,concat(@nodepath,"@sku"),0),1),'Value')
      endif

      if rowcount(BuildRowsetFromXML(@xml,concat(@nodepath,"@url"))) > 0 then
          set @url = Field(Row(BuildRowsetFromXML(@xml,concat(@nodepath,"@url"),0),1),'Value')
      endif

      if rowcount(BuildRowsetFromXML(@xml,concat(@nodepath,"text()"))) > 0 then
          set @name = Field(Row(BuildRowsetFromXML(@xml,concat(@nodepath,"text()"),0),1),'Value')
      endif

      if not empty(@sku) and not empty(@name) and not empty(@url) then

      ]%%

       <br><a href="%%=redirectto(@url)=%%">%%=v(@name)=%% (%%=v(@sku)=%%)</a>

      %%[

      endif

    next @i

  else

   output(concat("<br>no products found"))

  endif

else

  output(concat("<br>no XML found"))

endif

]%%
```

#### Output

```html
<br><a href="https://limedash.com/?sku=123">Square (123)</a>
<br><a href="https://limedash.com/?sku=456">Circle (456)</a>
<br><a href="https://limedash.com/?sku=789">Triangle (789)</a>
```