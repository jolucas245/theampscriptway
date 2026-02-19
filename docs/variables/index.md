---
title: "Variables"
---


Variables in AMPscript are used to store and manipulate data during script execution. They serve as named containers for values such as strings, numbers, dates, and rowsets. All AMPscript variables are prefixed with the `@` symbol.

### Key Concepts

| Topic | Description |
| --- | --- |
| [Declaring Variables](/declaring-variables) | How to declare variables using the `VAR` keyword. |
| [Setting Variables](/setting-variables) | How to assign values to variables using the `SET` keyword. |
| [Using Variables](/using-variables) | How to reference and output variable values. |
| [Scope](/scope) | Understanding variable scope and lifetime in AMPscript. |

### Quick Reference

```html
%%[

/* Declare variables */
VAR @firstName, @lastName, @age

/* Set variable values */
SET @firstName = "Jane"
SET @lastName = "Smith"
SET @age = 32

/* Use variables in expressions */
SET @greeting = Concat("Hello, ", @firstName, " ", @lastName, "!")

]%%

/* Output a variable value inline */
%%=v(@greeting)=%%
```

> NOTE: Variables must be declared with `VAR` before they can be used with `SET`. AMPscript variables are globally scoped — once set, they are accessible from any subsequent point in the script, including included Content Blocks.
