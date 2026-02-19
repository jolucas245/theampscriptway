---
title: "Setting Variables"
---


Once a variable is declared, it can be set. Variables are set using a syntax that comprises of four elements:

1. the `set` keyword
2. the variable name
3. a single equals symbol (`=`)
4. a [personalization string](/personalization-strings), [constant](/constants) or AMPscript [function](/functions) (which can contain nested functions).

Refer to the example below, where variables are set as a personalization string (`@firstName`), AMPscript function (`@localDate`) and constant (`@promotionEndDate`):

```html
%%[

var @firstName, @localDate, @promotionEndDate

set @firstName = FirstName
set @localDate = SystemDateToLocalDate(Now())
set @promotionEndDate = '10/15/2018'

]%%
```