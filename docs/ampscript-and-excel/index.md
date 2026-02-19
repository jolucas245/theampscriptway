---
title: "Ampscript And Excel"
---


AMPscript functions work in much the same way as they do in Microsoft Excel; that is, parameters are set for a predefined function, which are interpreted and, in turn, return a value. Several AMPscript functions are identical to Excel functions – while some functions are named differently, they share the same parameters and output the same result as Excel.

The example below compares the `SUM` Excel function with the `Add` AMPscript function, where two numbers are passed as arguments to the function. In this case, both functions will output the value `3`.

#### Excel SUM function

```html
=SUM(1,2)
```

#### AMPscript Add Function

```html
%%=Add(1,2)=%%
```

There are a total of 15 comparable functions between Excel and AMPscript which accept the same parameters and output the same result, as indicated in the table below.

| Excel Functions | AMPscript functions |
| --- | --- |
| CHAR | Char |
| CONCATENATE | Concat |
| FIND | IndexOf |
| IF | IIf |
| ISBLANK | Empty |
| LEN | Length |
| LOWER | Lowercase |
| MOD | Mod |
| NOW | Now |
| PROPER | ProperCase |
| RANDBETWEEN | Random |
| SUBSTITUTE | Replace |
| SUM | Add |
| TRIM | Trim |
| UPPER | Uppercase |