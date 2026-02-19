--- 
title: "Attributevalue And Empty"
---

## attributevalue-empty

The `attributevalue-empty` function is a combination of the `AttributeValue` and `Empty` functions. It checks if a subscriber attribute is empty or does not exist.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | Yes | The name of the attribute to check. |

> NOTE: This function is a custom implementation and not a built-in AMPscript function. It simplifies checking for empty or null attributes.

### Example 1: Basic Use

This example checks if the `FirstName` attribute is empty. If it is, a default value is used.

```html
%%[

/* Check if the FirstName attribute is empty */
if attributevalue-empty(\'FirstName\') then
  set @greeting = "Hello, valued customer"
else
  set @greeting = concat("Hello, ", AttributeValue(\'FirstName\'))
endif

]%%

<p>%%=v(@greeting)=%%</p>
```

### Example 2: Advanced Scenario

This example checks for a `Region` attribute. If it\'s not empty, it displays region-specific content.

```html
%%[

/* Check for a region to display targeted content */
if not attributevalue-empty(\'Region\') then
  set @region = AttributeValue(\'Region\')
  if @region == "North" then
    /* Display content for the North region */
    set @content = "Here is your content for the North region."
  elseif @region == "South" then
    /* Display content for the South region */
    set @content = "Here is your content for the South region."
  else
    /* Display default content */
    set @content = "Here is your default content."
  endif
else
  /* Display default content if region is not set */
  set @content = "Here is your default content."
endif

]%%

<p>%%=v(@content)=%%</p>
```