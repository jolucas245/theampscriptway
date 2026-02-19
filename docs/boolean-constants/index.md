---
title: "Boolean Constants"
---


Boolean constant values must use `true` or `false` values and are case-insensitive, as shown in the example below:

```html
%%[

var @statusTier, @freeShipping
set @statusTier = AttributeValue("Tier Level")

if @statusTier == "Gold" then /* string constant */
  set @freeShipping = true /* Boolean constant */
endif

]%%
```