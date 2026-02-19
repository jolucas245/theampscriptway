--- 
title: "Statements"
---


The `IF` statement in AMPscript allows for the conditional execution of a block of code based on the evaluation of one or more expressions. If the expression evaluates to `true`, the code block is processed.

### Arguments

`IF` statements do not have formal arguments in the same way as functions. Instead, they use expressions for evaluation. These expressions can include:

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | Expression | Yes | A combination of constants, variables, attributes, personalization strings, and function calls that evaluates to a boolean `true` or `false`. |

> NOTE: `IF` statements are fundamental to creating dynamic and personalized content within Salesforce Marketing Cloud emails, landing pages, and other messages.

### Example 1: Basic Use

This example demonstrates a simple `IF` statement that sets a variable if a condition is met.

```html
%%[

  /* @age is assumed to be a pre-existing variable or attribute */
  VAR @age, @group
  SET @age = 21

  IF NOT EMPTY(@age) AND @age >= 18 THEN
    SET @group = "Adult"
  ELSE
    SET @group = "Minor"
  ENDIF

]%%

Group: %%=v(@group)=%%
```

### Example 2: Advanced Scenario

This example shows a nested `IF` statement to handle multiple conditions for more complex personalization.

```html
%%[

  /* @country and @language are assumed to be pre-existing variables or attributes */
  VAR @country, @language, @greeting
  SET @country = "USA"
  SET @language = "EN"

  IF NOT EMPTY(@country) THEN
    IF @country == "USA" THEN
      IF @language == "EN" THEN
        SET @greeting = "Hello!"
      ELSEIF @language == "ES" THEN
        SET @greeting = "Hola!"
      ELSE
        SET @greeting = "Welcome!"
      ENDIF
    ELSEIF @country == "France" THEN
      SET @greeting = "Bonjour!"
    ELSE
      SET @greeting = "Welcome!"
    ENDIF
  ELSE
    SET @greeting = "Hello there!"
  ENDIF

]%%

Greeting: %%=v(@greeting)=%%
```