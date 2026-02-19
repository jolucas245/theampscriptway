---
title: "Execution Context"
---


### Description

The `execution-context` in Salesforce Marketing Cloud refers to the environment in which AMPscript code is processed. It determines how the system handles content from various sources such as landing pages, Web Collect, and Smart Capture. The execution context is represented by the global read-only variable `@@ExecCtx`, which indicates whether the current context is `Load` or `Post`.

### Arguments

| Ordinal | Type | Required | Description |
|---|---|---|---|
| N/A | N/A | N/A | The `execution-context` is a global variable (`@@ExecCtx`) and does not accept arguments. |

### Notes

> NOTE: In the current release of Marketing Cloud, the `@@ExecCtx` variable will always return `Load`, regardless of the actual execution context. This is a known issue and is expected to be resolved in a future release.

### Example 1: Conditional Content Based on Execution Context

This example demonstrates how to display content or execute scripts conditionally based on the `@@ExecCtx` variable. Although `@@ExecCtx` currently always returns `Load`, this structure is designed for future functionality where `Post` context might be relevant.

```html
%%[
/* Content and Script to always be executed here, regardless of context */

IF NOT EMPTY(@@ExecCtx) THEN
    IF @@ExecCtx == "LOAD" THEN
        /* Logic for Load Context */
        SET @message = "This content is processed during a Load context."
    ELSEIF @@ExecCtx == "POST" THEN
        /* Logic for Post Context */
        SET @message = "This content is processed during a Post context."
    ELSE
        /* Fallback for unexpected context values */
        SET @message = "Unknown execution context: " + @@ExecCtx
    ENDIF
ELSE
    /* Handle cases where @@ExecCtx might be empty or undefined */
    SET @message = "Execution context variable is empty."
ENDIF

/* Display the message */
]%% 
%%=v(@message)=%%
```

### Example 2: Specifying Script Block Execution Context

This example illustrates how to define the execution context and name for a specific script block. This allows the Marketing Cloud system to execute only designated script blocks when a caller specifies a matching context type and name. This is particularly useful for managing script execution in complex scenarios like Smart Capture forms.

```html
%%[
/* Define a script block named 'SaveData' that should execute in a 'Post' context */
/* The 'name' and 'type' attributes are case-insensitive. */
name="SaveData";type="Post"

/* Inside this block, you would typically place logic for data saving or processing */
/* For instance, inserting data into a Data Extension after a form submission. */

/* Example of defensive code within the script block */
VAR @firstName, @lastName
SET @firstName = RequestParameter("FirstName")
SET @lastName = RequestParameter("LastName")

IF NOT EMPTY(@firstName) AND NOT EMPTY(@lastName) THEN
    /* Assuming a Data Extension named 'FormData' exists with 'FirstName' and 'LastName' fields */
    /* This would only execute if the context is 'Post' and the script block name is 'SaveData' */
    InsertData('FormData', 'FirstName', @firstName, 'LastName', @lastName)
    SET @statusMessage = "Data saved successfully."
ELSE
    SET @statusMessage = "First Name or Last Name is missing. Data not saved."
ENDIF

]%%

<p>Status: %%=v(@statusMessage)=%%</p>
```