---
title: "OutputLine"
---


The `OutputLine` function is used in AMPscript to return the result of another AMPscript function and include it within the rendered content. Unlike the `Output` function, `OutputLine` automatically appends a newline character (CRLF) after the output of the nested function. This is particularly useful for formatting output in text-based contexts, such as plain-text emails or SMS messages, where line breaks are interpreted literally. It's important to note that `OutputLine` only processes the result of a nested AMPscript function; passing a string or any other literal directly as a parameter will not produce any output.

### Arguments

| Ordinal | Type              | Required | Description                                                               |
|---------|-------------------|----------|---------------------------------------------------------------------------|
| 1       | AMPscript function | Yes      | The AMPscript function whose result will be output by the system.         |

> NOTE: The `OutputLine` function adds a carriage return plus line feed (CRLF) character to the end of the output. When rendered as HTML, this typically results in the output appearing on a single line unless explicitly handled by HTML line breaks (`<br/>`). In text-based outputs (e.g., plain-text emails, SMS), the CRLF will result in a new line.

### Example 1: Basic Use

This example demonstrates the basic usage of `OutputLine` to display a concatenated string and a variable's value, each on a new line in text-based contexts.

```html
%%[
    /* Declare and set variables */
    VAR @firstName, @lastName, @message
    SET @firstName = "John"
    SET @lastName = "Doe"
    SET @message = "Welcome to our service!"

    /* Output concatenated string with a newline */
    IF NOT EMPTY(@firstName) AND NOT EMPTY(@lastName) THEN
        OutputLine(Concat("Full Name: ", @firstName, " ", @lastName))
    ENDIF

    /* Output variable value with a newline */
    IF NOT EMPTY(@message) THEN
        OutputLine(v(@message))
    ENDIF
]%%
```

### Example 2: Advanced Scenario with Conditional Output

This example shows how `OutputLine` can be used within a conditional block to output different messages based on a subscriber's status, ensuring each message appears on a new line in a text-based email.

```html
%%[
    /* Declare and set a subscriber status variable */
    VAR @subscriberStatus
    SET @subscriberStatus = "Active"

    /* Conditionally output messages with newlines */
    IF NOT EMPTY(@subscriberStatus) THEN
        IF @subscriberStatus == "Active" THEN
            OutputLine(Concat("Status: ", @subscriberStatus, ". Thank you for your continued subscription."))
        ELSEIF @subscriberStatus == "Inactive" THEN
            OutputLine(Concat("Status: ", @subscriberStatus, ". Please renew your subscription to continue."))
        ELSE
            OutputLine(Concat("Status: ", @subscriberStatus, ". Unknown status detected."))
        ENDIF
    ELSE
        /* Handle cases where subscriber status is empty */
        OutputLine("Error: Subscriber status not available.")
    ENDIF
]%%
```