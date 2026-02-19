---
title: "Declaring Variables"
---


Before a variable can be *set*, it must be declared. Variables are declared with the `var` keyword, followed by one or more comma-delimited variable names. For example, if you need to define a member’s first name, last name and membership expiry date, the variables could be declared as:

```html
var @firstName, @lastName, @membershipExpiryDate
```

Declaring a variable adds an entry to an internal Variables Dictionary, using the variable name as the key and `null` as the value. If an entry for that name already exists, the value of the variable will be reset to `null`.

> NOTE: AMPscript is a loosely typed language and as a result, the interpreter does not enforce variables to be declared. However, it’s best practice to do so, to ensure the variable name is added to the Variables Dictionary.