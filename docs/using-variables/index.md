---
title: "Using Variables"
---


In AMPscript, variables are used to store and manipulate data within your Marketing Cloud emails, landing pages, and other content. They allow for dynamic content generation, personalization, and complex logic execution. Variables must be declared before they can be used and are typically prefixed with an `@` symbol when referenced.

> NOTE: AMPscript variables are case-insensitive. While not strictly enforced, it is a best practice to declare and reference variables consistently for readability and maintainability.

### Example 1: Basic Variable Declaration and Output
This example demonstrates how to declare a string variable, assign a value to it, and then output its content.

```html
%%[
    /* Declare a string variable named @firstName */
    VAR @firstName

    /* Assign a value to the @firstName variable */
    SET @firstName = "John"

    /* Check if the variable is not empty before outputting */
    IF NOT EMPTY(@firstName) THEN
        /* Output the value of @firstName */
        Output(Concat("Hello, ", @firstName, "!"))
    ELSE
        Output("Hello, Guest!")
    ENDIF
]%%
```

### Example 2: Numeric Variable and Conditional Logic
This example shows how to declare a numeric variable, perform a calculation, and use it within conditional logic to display different messages.

```html
%%[
    /* Declare a numeric variable named @orderTotal */
    VAR @orderTotal
    /* Declare a string variable for the message */
    VAR @message

    /* Assign a value to @orderTotal */
    SET @orderTotal = 150.75

    /* Check if @orderTotal is not empty and is a valid number */
    IF NOT EMPTY(@orderTotal) AND IsNumber(@orderTotal) THEN
        /* Apply a discount if the order total is over 100 */
        IF @orderTotal > 100 THEN
            SET @message = Concat("Your order total of ", Format(@orderTotal, "C"), " qualifies for free shipping!")
        ELSE
            SET @message = Concat("Your order total is ", Format(@orderTotal, "C"), ". Spend more to get free shipping!")
        ENDIF
    ELSE
        SET @message = "Unable to calculate order total. Please contact support."
    ENDIF

    /* Output the final message */
    Output(@message)
]%%
```

### Example 3: Concatenating Variables and Personalization
This example demonstrates combining multiple variables, including a personalization string (simulated here), to create a dynamic message.

```html
%%[
    /* Declare variables for name, product, and a personalization string */
    VAR @customerName
    VAR @productName
    VAR @emailAddress /* Simulating a personalization string like %%emailaddr%% */
    VAR @finalMessage

    /* Assign values to the variables */
    SET @customerName = "Jane Doe"
    SET @productName = "Premium Widget"
    SET @emailAddress = "jane.doe@example.com"

    /* Build the final message defensively */
    IF NOT EMPTY(@customerName) AND NOT EMPTY(@productName) AND NOT EMPTY(@emailAddress) THEN
        SET @finalMessage = Concat(
            "Dear ", @customerName, ",\n\n",
            "Thank you for your recent purchase of the ", @productName, ".\n",
            "A confirmation has been sent to ", @emailAddress, "."
        )
    ELSEIF NOT EMPTY(@customerName) AND NOT EMPTY(@productName) THEN
        SET @finalMessage = Concat(
            "Dear ", @customerName, ",\n\n",
            "Thank you for your recent purchase of the ", @productName, "."
        )
    ELSE
        SET @finalMessage = "Thank you for your recent purchase."
    ENDIF

    /* Output the constructed message */
    Output(@finalMessage)
]%%
```