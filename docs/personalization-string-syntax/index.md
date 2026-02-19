--- 
title: "Personalization String Syntax"
---


Personalization strings are placeholders in your content that are replaced with subscriber-specific information when a message is sent. They allow you to display data from your data extensions, such as a subscriber's name or email address, directly in your emails, landing pages, or SMS messages. These are not functions, but a syntax to access data.

### Arguments

Personalization strings do not have arguments in the traditional sense like a function. Instead, they are referenced by the name of the data extension column or system-defined value.

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| N/A | String | No | The name of the attribute or system variable to be personalized. |

> NOTE: Personalization strings are processed after AMPscript. If you need to use a personalization string within an AMPscript block, it is best practice to use the `AttributeValue()` function to ensure the value is properly handled, especially for values that might be empty.

### Example 1: Basic Use in Email

This example shows how to use a personalization string to display a subscriber's first name in an email greeting.

```html
%%[ /* AMPscript block for more complex logic if needed */ ]%%

Hello %%FirstName%%,

Welcome to our newsletter!
```

### Example 2: Using with AMPscript for Defensive Coding

This example demonstrates how to use a personalization string with the `AttributeValue()` function to provide a fallback if the `FirstName` attribute is empty.

```html
%%[

  /* Retrieve the value of the FirstName attribute */
  VAR @firstName
  SET @firstName = AttributeValue("FirstName")

  /* Check if the FirstName is not empty */
  IF NOT EMPTY(@firstName) THEN
    SET @greeting = CONCAT("Hello ", @firstName, ",")
  ELSE
    SET @greeting = "Hello,"
  ENDIF

]%%

%%=v(@greeting)=%%

Welcome to our newsletter!
```
