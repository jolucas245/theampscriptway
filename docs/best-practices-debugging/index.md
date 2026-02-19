---
title: "Best Practice: Debugging"
---

## best-practices-debugging

This document outlines best practices for debugging AMPscript code in Salesforce Marketing Cloud. It is not a function, but a collection of techniques and approaches to help you identify and resolve issues in your scripts.

### Arguments

As this is a guide to best practices and not a function, there are no arguments.

> NOTE: The following examples demonstrate common debugging techniques. They are not a complete list, but they provide a solid foundation for troubleshooting your AMPscript code.

### Example 1: Outputting Variable Values

A simple and effective way to debug is to output the values of your variables at different points in your script. This allows you to check if they hold the expected values.

```html
%%[

  /* 1. Retrieve the value of the 'FirstName' attribute */
  VAR @firstName
  SET @firstName = AttributeValue("FirstName")

  /* 2. Output the value for debugging purposes */
  IF NOT EMPTY(@firstName) THEN
    Output(CONCAT("First Name: ", @firstName))
  ELSE
    Output("First Name is empty.")
  ENDIF

]%%
```

### Example 2: Using RaiseError for Stopping Execution

You can use the `RaiseError` function to intentionally stop the execution of a script and display a custom error message. This is useful for identifying critical errors that should prevent an email from being sent.

```html
%%[

  /* 1. Define a critical variable */
  VAR @orderId
  SET @orderId = AttributeValue("orderId")

  /* 2. Check if the critical variable is empty and raise an error if it is */
  IF EMPTY(@orderId) THEN
    RaiseError("Order ID is missing. Cannot proceed.", true)
  ENDIF

  /* 3. Continue with the script if the order ID exists */
  Output(CONCAT("Processing Order ID: ", @orderId))

]%%
```

### Example 3: Debugging with Server-Side JavaScript (SSJS)

For more complex debugging scenarios, you can leverage Server-Side JavaScript to wrap your AMPscript in a `try...catch` block. This allows you to catch exceptions and output detailed error information without halting the entire script execution.

```html
<script runat=server>
  Platform.Load("Core","1");
  try {
</script>

%%[
  /* AMPscript code that might cause an error */
  VAR @lookupValue, @result
  SET @lookupValue = "someValue"
  SET @result = Lookup("NonExistentDE", "ResultField", "LookupColumn", @lookupValue)

  IF EMPTY(@result) THEN
      RaiseError("Lookup returned no results.", false) /* This will be caught by the SSJS try-catch */
  ENDIF

  Output(@result)
]%%

<script runat=server>
  } catch (e) {
    Write("An error occurred: " + Stringify(e));
  }
</script>
```
