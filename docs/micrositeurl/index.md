---
title: "MicrositeURL"
---


The `micrositeurl` function returns a microsite URL with an encrypted query string. This function is primarily used to link to microsites created in Classic Content from emails. By encrypting the query parameters, it prevents the submission of sensitive customer data in plain text.

### Arguments

| Ordinal | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| 1 | Number | Yes | The page identifier of the microsite or CloudPages landing page. |
| 2 | String | No | The name of the first parameter to include as an encrypted query string parameter. |
| 3 | String | No | The value of the first parameter. |
| ... | String | No | Additional parameter names and values can be appended. |

> NOTE: This function is intended for use in emails to link to microsites. The encrypted parameters can be retrieved on the landing page using the `RequestParameter()` AMPscript function.

### Example 1: Basic Use

This example demonstrates how to generate a link to a microsite with a single encrypted parameter.

```html
%%[

/* Set the page ID of the microsite */
VAR @micrositePageId
SET @micrositePageId = 12345

/* Set the subscriber key to be passed as a parameter */
VAR @subscriberKey
SET @subscriberKey = AttributeValue("subcriberKey") /* or _subscriberkey */

/* Generate the microsite URL with an encrypted subscriber key */
VAR @micrositeUrl

IF NOT EMPTY(@subscriberKey) THEN
    SET @micrositeUrl = MicrositeURL(@micrositePageId, "skey", @subscriberKey)
ELSE
    SET @micrositeUrl = MicrositeURL(@micrositePageId)
ENDIF

]%%

<a href="%%=v(@micrositeUrl)=%%" title="Visit our microsite">Click here</a>
```

### Example 2: Advanced Scenario with Multiple Parameters

This example shows how to pass multiple encrypted parameters to a microsite, including a static value and a value from a data extension field.

```html
%%[

/* Define the microsite page ID */
VAR @micrositePageId
SET @micrositePageId = 54321

/* Retrieve the email address from an attribute */
VAR @email
SET @email = AttributeValue("emailAddr")

/* Define a static campaign code */
VAR @campaignCode
SET @campaignCode = "SUMMER2024"

/* Generate the microsite URL with multiple encrypted parameters */
VAR @micrositeUrl

IF NOT EMPTY(@email) THEN
    SET @micrositeUrl = MicrositeURL(@micrositePageId, "email", @email, "campaign", @campaignCode)
ELSE
    SET @micrositeUrl = MicrositeURL(@micrositePageId, "campaign", @campaignCode)
ENDIF

]%%

<p>To view your personalized offers, please <a href="%%=v(@micrositeUrl)=%%">visit our campaign page</a>.</p>
```
