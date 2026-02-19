---
title: "Uppercase"
---


This function converts all lowercase letters in the specified string to uppercase.

### Argument

`Uppercase(1)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | String to convert into uppercase |

### Example

```html
%%[

var @locale, @localeUpper

set @locale = AttributeValue("locale") /* value from attribute or DE column in send context */
set @locale = "en-us" /* or a literal value */

set @localeUpper = Uppercase(@locale)

]%%
locale: %%=v(@locale)=%%
<br>localeUpper: %%=v(@localeUpper)=%%
```

#### Output

```html
locale: en-us
localeUpper: EN-US
```