---
title: "Utility Functions"
---


AMPscript utility functions are a collection of miscellaneous functions designed to perform various common tasks within Salesforce Marketing Cloud. These functions are essential for evaluating conditions, formatting data such as numbers and dates, outputting text, and handling other general-purpose operations. They provide the foundational capabilities for dynamic content generation, personalization, and conditional logic within emails, landing pages, and SMS messages.

### Arguments

| Ordinal | Type | Required | Description |
|---|---|---|---|
| N/A | N/A | N/A | The term `utility-functions` refers to a category of AMPscript functions, not a single callable function. Therefore, this section is not applicable. |

> NOTE: `utility-functions` is a conceptual grouping of various AMPscript functions that provide general utility. It is not a function that can be directly called. To utilize these capabilities, you must call specific functions within this category, such as `Output()`, `Domain()`, `AttributeValue()`, etc.

### Example 1: Basic Use of Output() Function

This example demonstrates the basic usage of the `Output()` function to display a simple string. The `Output()` function is crucial for rendering AMPscript variables and expressions into the final content.

```html
%%[
    /* Declare a variable to hold a greeting message */
    VAR @greeting
    SET @greeting = "Hello, World!"

    /* Check if the greeting variable is not empty before outputting */
    IF NOT EMPTY(@greeting) THEN
        /* Output the greeting message */
        Output(@greeting)
    ELSE
        /* Output a default message if the greeting is empty */
        Output("No greeting available.")
    ENDIF
]%%
```

### Example 2: Advanced Scenario with Domain() Function

This example illustrates how to extract the domain from an email address using the `Domain()` function. This can be useful for segmenting subscribers by their email provider or for displaying personalized content based on their domain.

```html
%%[
    /* Declare a variable to hold an email address */
    VAR @emailAddress
    SET @emailAddress = "john.doe@example.com"

    /* Declare a variable to hold the extracted domain */
    VAR @domain

    /* Check if the email address is not empty before processing */
    IF NOT EMPTY(@emailAddress) THEN
        /* Extract the domain from the email address */
        SET @domain = Domain(@emailAddress)

        /* Check if a domain was successfully extracted before outputting */
        IF NOT EMPTY(@domain) THEN
            Output(Concat("The domain for ", @emailAddress, " is: ", @domain))
        ELSE
            Output(Concat("Could not extract domain from: ", @emailAddress))
        ENDIF
    ELSE
        Output("Email address is empty, cannot extract domain.")
    ENDIF
]%%
```