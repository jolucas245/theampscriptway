---
title: "Legal"
---


**Description:**

There is no official AMPscript function named `legal` in Salesforce Marketing Cloud. Searches of official Salesforce documentation and comprehensive AMPscript guides indicate that `legal` is not a recognized AMPscript function. References to "legal" in the context of AMPscript typically pertain to legal disclaimers, terms of service, or privacy policies, rather than a functional component of the AMPscript language itself.

### Arguments

| Ordinal | Type | Required | Description |
|---|---|---|---|
| N/A | N/A | N/A | This function does not exist. |

### Notes

> NOTE: The term `legal` is often encountered in the context of legal compliance, privacy policies, or terms and conditions related to Salesforce Marketing Cloud usage, but it does not correspond to an executable AMPscript function.

### Example 1: Attempted Use (Invalid)

```html
%%[
/*
This example demonstrates an attempt to use a hypothetical 'legal' function.
As 'legal' is not a valid AMPscript function, this code would result in an error.
*/
VAR @legalText
SET @legalText = legal('privacy_policy_id') /* This line would cause an error */

IF NOT EMPTY(@legalText) THEN
    Output(Concat("Legal Text: ", @legalText))
ELSE
    Output("Error: 'legal' function not found or returned empty.")
ENDIF
]%%
```

### Example 2: Correct Approach for Legal Content

```html
%%[
/*
To include legal content, such as a privacy policy, it should be stored
in a Content Builder block, Data Extension, or directly in the email/landing page HTML.
This example retrieves content from a Content Builder block by key.
*/
VAR @privacyPolicyContent
SET @privacyPolicyContent = ContentBlockByKey('PrivacyPolicy_2024')

IF NOT EMPTY(@privacyPolicyContent) THEN
    Output(Concat("<!-- Start Privacy Policy -->\n", @privacyPolicyContent, "\n<!-- End Privacy Policy -->"))
ELSE
    /* Log an error or provide a fallback message if the content block is not found */
    Output("<!-- Error: Privacy Policy content not found. Please contact support. -->")
ENDIF
]%%
```