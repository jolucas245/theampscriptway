---
title: "AttributeValue and Empty"
---

`AttributeValue` and `Empty` are two separate AMPscript functions that are commonly combined to safely check whether a subscriber attribute exists and contains a value before using it. This pattern is considered defensive coding best practice and prevents personalisation errors when attributes are missing or null.

- `AttributeValue(attributeName)` returns the value of a named subscriber attribute or data extension field. If the attribute does not exist or has no value, it returns an empty string.
- `Empty(value)` returns `TRUE` if the supplied value is an empty string, null, or zero; otherwise it returns `FALSE`.

### Arguments

**AttributeValue**

| Ordinal | Type   | Required | Description                                              |
|---------|--------|----------|----------------------------------------------------------|
| 1       | String | Yes      | The name of the subscriber attribute or field to retrieve. |

**Empty**

| Ordinal | Type   | Required | Description                                              |
|---------|--------|----------|----------------------------------------------------------|
| 1       | Any    | Yes      | The value to evaluate. Returns `TRUE` if empty or null. |

> NOTE: Use double quotes around attribute names in AMPscript. Escaped single quotes (`\'`) are not valid AMPscript syntax.

### Example 1: Using a Fallback When an Attribute Is Empty

This example checks whether the `FirstName` attribute has a value. If it does not, a generic greeting is used instead.

```html
%%[
VAR @firstName, @greeting

SET @firstName = AttributeValue("FirstName")

IF NOT EMPTY(@firstName) THEN
  SET @greeting = Concat("Hello, ", @firstName)
ELSE
  SET @greeting = "Hello, valued subscriber"
ENDIF
]%%

<p>%%=v(@greeting)=%%</p>
```

### Example 2: Displaying Region-Specific Content

This example checks for a `Region` attribute and displays targeted content. If the attribute is not set, a default content block is shown.

```html
%%[
VAR @region, @content

SET @region = AttributeValue("Region")

IF NOT EMPTY(@region) THEN
  IF @region == "North" THEN
    SET @content = "Special offers for our Northern customers."
  ELSEIF @region == "South" THEN
    SET @content = "Special offers for our Southern customers."
  ELSE
    SET @content = "Explore our latest offers."
  ENDIF
ELSE
  SET @content = "Explore our latest offers."
ENDIF
]%%

<p>%%=v(@content)=%%</p>
```