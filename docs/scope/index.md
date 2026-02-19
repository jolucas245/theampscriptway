---
title: "Scope"
---


**Description:**

In AMPscript, **scope** refers to the visibility and lifetime of variables within a script. Unlike some other programming languages, AMPscript variables are generally **globally scoped** by default once they are declared and set. This means that a variable, once defined, can be accessed and modified from any subsequent part of the AMPscript block where it was declared. Variables can be reassigned new values throughout the script.

There is a notable exception to this global scope behavior when variables are used within a `for` loop. In such scenarios, the variable used as the counter within the `for` block is locked from modification by re-declaration within that specific loop's context.

### Arguments

The concept of `scope` in AMPscript is not a function and therefore does not accept any arguments. It describes the behavior of variables within the scripting environment.

> NOTE: AMPscript variables are globally scoped by default, meaning they retain their value and can be accessed throughout the script after their initial declaration and assignment. The only exception to this is when a variable is used as a counter within a `for` loop, where its modification is restricted within the loop's context.

### Example 1: Basic Variable Scope and Reassignment

This example demonstrates how a variable's value can be set and then reassigned later in the script, reflecting its global scope.

```html
%%[
    /* Declare variables */
    VAR @promotionEndDate, @memberStatus

    /* Set initial values for variables */
    SET @promotionEndDate = '10/15/2024'
    SET @memberStatus = 'Standard'

    /* Check if @memberStatus is not empty before proceeding */
    IF NOT EMPTY(@memberStatus) THEN
        /* Conditional reassignment based on member status */
        IF @memberStatus == 'Gold' THEN
            SET @promotionEndDate = '11/15/2024' /* Reassign for Gold members */
        ELSEIF @memberStatus == 'Silver' THEN
            SET @promotionEndDate = '10/31/2024' /* Reassign for Silver members */
        ENDIF
    ENDIF

    /* Output the final promotion end date */
]%%

<p>Dear Subscriber,</p>
<p>Your promotion ends on: %%=v(@promotionEndDate)=%%</p>
```

### Example 2: Variable Reassignment and Scope in FOR Loops

This example illustrates how a variable can be reassigned using an AMPscript function, and demonstrates the scoping behavior of the loop counter variable within a `FOR` loop.

```html
%%[

VAR @greeting, @rows, @rowCount, @i

/* Variable is globally scoped and can be reassigned */
SET @greeting = "Hello"
SET @greeting = Concat(@greeting, ", welcome to our store!")

/* Retrieve rows from a Data Extension */
SET @rows = LookupRows("Products", "Category", "Featured")
SET @rowCount = RowCount(@rows)

IF @rowCount > 0 THEN
  FOR @i = 1 TO @rowCount DO
    /*
      @i is the loop counter — it is automatically incremented
      by the FOR loop and cannot be manually reassigned within
      the loop body. Attempting SET @i = 5 inside here would
      not change the iteration behavior.
    */
    VAR @row, @productName
    SET @row = Row(@rows, @i)
    SET @productName = Field(@row, "ProductName")

    Output(Concat("<p>", @i, ". ", @productName, "</p>"))
  NEXT @i
ENDIF

/* @i is still accessible here after the loop ends */
Output(Concat("<p>Total items displayed: ", Subtract(@i, 1), "</p>"))

]%%
```

> NOTE: AMPscript variables are globally scoped. A variable set inside an `IF` block, `FOR` loop, or included Content Block is accessible everywhere else in the script. The only exception is the `FOR` loop counter, which cannot be manually reassigned during iteration.