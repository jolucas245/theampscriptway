---
title: "Language Syntax"
---


AMPscript uses a straightforward syntax that consists of delimiters, keywords, functions, variables, operators, and constants. This page provides an overview of the key syntactic elements.

### Delimiters

AMPscript code is enclosed within special delimiters that tell the Marketing Cloud rendering engine to process the enclosed code:

- **Block delimiters**: `%%[` ... `]%%` — for multi-line AMPscript blocks
- **Inline delimiters**: `%%=` ... `=%%` — for inline expressions within HTML

### Keywords

AMPscript uses the following keywords for control flow and variable management:

| Keyword | Purpose |
| --- | --- |
| `VAR` | Declares one or more variables. |
| `SET` | Assigns a value to a variable. |
| `IF` / `ELSEIF` / `ELSE` / `ENDIF` | Conditional branching. |
| `FOR` / `TO` / `DO` / `NEXT` | Looping over a range or rowset. |
| `AND` / `OR` / `NOT` | Logical operators. |
| `THEN` | Follows the `IF` condition. |
| `DOWNTO` | Used in `FOR` loops that decrement. |
| `OUTPUT` | Writes a value to the rendered output. |

### Example

```html
%%[
/* Declare variables */
VAR @name, @greeting

/* Set values */
SET @name = AttributeValue("FirstName")

/* Conditional logic */
IF NOT EMPTY(@name) THEN
  SET @greeting = Concat("Hello, ", @name, "!")
ELSE
  SET @greeting = "Hello!"
ENDIF
]%%

/* Inline output */
%%=v(@greeting)=%%
```

> NOTE: AMPscript is **not case-sensitive** — `SET`, `Set`, and `set` are all equivalent. However, using consistent casing (typically UPPERCASE for keywords) is a widely adopted convention that improves code readability.
