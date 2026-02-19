---
title: "Output"
---


The `Output` function renders the result of a nested AMPscript function or variable within a code block. It is the primary way to display content from within a script block at the location where the block appears.

> NOTE: The `Output` function is similar to `OutputLine`, but `OutputLine` adds a carriage return and a line feed after the output.

### Arguments

`Output(1)`

| Ordinal | Type   | Required | Description                                      |
| ------- | ------ | -------- | ------------------------------------------------ |
| 1       | String | True     | The AMPscript variable or function to be rendered. |

### Example 1: Basic Output of a Variable

```html
%%[

  VAR @greeting
  SET @greeting = "Hello, World!"

  Output(@greeting)

]%%
```

#### Output

```html
Hello, World!
```

### Example 2: Output vs. Inline Syntax

**Using `Output()`:**

```html
%%[
  VAR @status, @message
  SET @status = "Active"

  IF @status == "Active" THEN
    SET @message = "Your account is active."
    Output(@message)
  ELSE
    SET @message = "Your account is inactive."
    Output(@message)
  ENDIF
]%%
```

**Using Inline `%%=v()=%%` (Recommended):**

```html
%%[
  VAR @status, @message
  SET @status = "Active"

  IF @status == "Active" THEN
    SET @message = "Your account is active."
  ELSE
    SET @message = "Your account is inactive."
  ENDIF
]%%

<p>Status: %%=v(@message)=%%</p>
```

### Example 3: Using `Output` with `Concat` for Debugging

```html
%%[
  VAR @productID, @price, @inventory
  SET @productID = "PROD123"
  SET @price = 59.99
  SET @inventory = 150

  Output(Concat("Debug: ProductID=", @productID, ", Price=", @price, ", Inventory=", @inventory))

]%%
```
