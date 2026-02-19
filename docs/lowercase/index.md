---
title: "Lowercase"
---


This function converts all uppercase letters in the specified string into lowercase letters.

### Argument

`Lowercase(1)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | String to convert into lowercase |

### Example

```html
%%[

var @locale, @localeLower

set @locale = AttributeValue("locale") /* value from attribute or DE column in send context */
set @locale = "EN-US" /* or a literal value */

set @localeLower = lowercase(@locale)

]%%
locale: %%=v(@locale)=%%
<br>localeLower: %%=v(@localeLower)=%%
```

#### Output

```html
locale: EN-US
localeLower: en-us
```