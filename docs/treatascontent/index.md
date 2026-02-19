---
title: "TreatAsContent"
---


The `treatascontent` function is used to parse and render a string as if it were a content area in Salesforce Marketing Cloud. This is particularly useful when you have AMPscript or personalization strings stored in a variable or a Data Extension field, and you want to execute that code.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | Yes | The string containing the content to be processed. |

> NOTE: Always sanitize user input within a `treatascontent` block. Remove, escape, or disallow input that contains HTML tags or AMPscript code, or use an allowlist of safe characters.

### Example 1: Basic Use

This example demonstrates how to use `treatascontent` to render a personalized message stored in a variable.

```html
%%[

/* Set a variable with a personalized message */
VAR @message
SET @message = "Hello, %%FirstName%%! Welcome to our newsletter."

]%%

%%=TreatAsContent(@message)=%%
```

### Example 2: Advanced Scenario

In this scenario, we retrieve a block of HTML and AMPscript from a Data Extension and use `treatascontent` to render it. This allows for dynamic content blocks that can be managed outside of the email.

```html
%%[

/* Assume 'SubscriberKey' is the key for the lookup */
VAR @SubscriberKey, @dynamicContent
SET @SubscriberKey = _subscriberkey

/* Retrieve the dynamic content from a Data Extension */
SET @dynamicContent = Lookup("DynamicContentDE", "Content", "SubscriberKey", @SubscriberKey)

/* Check if the content is not empty before attempting to render it */
IF NOT EMPTY(@dynamicContent) THEN

  /* Use TreatAsContent to render the retrieved content */
  TreatAsContent(@dynamicContent)

ELSE

  /* Fallback content if no dynamic content is found */
  Write("Welcome, valued subscriber!")

ENDIF

]%%
```
