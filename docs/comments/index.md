---
title: "Comments"
---


Comments in AMPscript are used to add explanatory notes within your code that are ignored by the Marketing Cloud Engagement platform during processing. They are essential for improving code readability, maintainability, and for temporarily disabling sections of code without deleting them. AMPscript supports multi-line comments.

### Arguments

| Ordinal | Type | Required | Description |
|---|---|---|---|
| 1 | String | No | The text of the comment. This argument is not explicitly passed to the function but represents the content enclosed within the comment delimiters. |

> NOTE: The `comments` function is not a callable function in the traditional sense. It is a language construct for adding comments to AMPscript code. Therefore, it does not accept arguments in the same way other AMPscript functions do. The description above refers to the content *within* the comment block.

### Example 1: Basic Use

This example demonstrates how to use single-line and multi-line comments to explain code sections and temporarily disable a line of code.

```html
%%[
    /* This is a single-line comment explaining the next variable declaration */
    VAR @firstName
    SET @firstName = "John"

    /*
        This is a multi-line comment.
        It explains the purpose of the following IF statement.
        We are checking if the first name is not empty before displaying it.
    */
    IF NOT EMPTY(@firstName) THEN
        Output(Concat("Hello, ", @firstName, "!"))
    ENDIF

    /* SET @lastName = "Doe" */ /* This line is commented out and will not be processed */
]%%
```

### Example 2: Advanced Scenario

This example shows how comments can be used within more complex AMPscript blocks, including nested logic, to provide clarity and aid in debugging.

```html
%%[
    /* Declare and initialize variables for a personalized greeting */
    VAR @customerName, @orderStatus, @message
    SET @customerName = "Jane Doe"
    SET @orderStatus = "Shipped"

    /* Check if customer name is available before proceeding */
    IF NOT EMPTY(@customerName) THEN
        /* Construct a personalized message based on order status */
        IF @orderStatus == "Shipped" THEN
            SET @message = Concat("Dear ", @customerName, ", your order has been shipped!")
        ELSEIF @orderStatus == "Pending" THEN
            SET @message = Concat("Dear ", @customerName, ", your order is pending.")
        ELSE
            SET @message = Concat("Dear ", @customerName, ", we have an update regarding your order.")
        ENDIF

        /* Output the final message to the email */
        Output(SET @message)
    ELSE
        /* Fallback message if customer name is missing */
        Output("Dear Customer, we have an update regarding your order.")
    ENDIF

    /*
        Important Note:
        Ensure all variables are properly initialized to avoid errors.
        Consider adding logging for debugging in production environments.
    */
]%%
```