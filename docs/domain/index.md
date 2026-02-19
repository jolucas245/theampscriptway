---
title: "Domain"
---


The `Domain()` function extracts and returns the domain part of an email address. This is defined as the segment of the email address that follows immediately after the "@" symbol.

### Arguments

| Ordinal | Type   | Required | Description                |
| :------ | :----- | :------- | :------------------------- |
| 1       | String | Yes      | The email address to parse. |

> NOTE: The `Domain()` function will return `null` under the following conditions:
> *   If the provided `emailAddress` parameter does not contain an "@" symbol.
> *   If the provided `emailAddress` parameter is not a string value (e.g., an integer).

### Example 1: Basic Use

This example demonstrates how to extract the domain from a simple email address string.

```html
%%[
VAR @emailAddress, @domain
SET @emailAddress = "john.doe@example.com"

/* Check if the email address is not empty before processing */
IF NOT EMPTY(@emailAddress) THEN
    SET @domain = Domain(@emailAddress)
ELSE
    SET @domain = "Email address is empty or invalid."
ENDIF
]%%

Domain: %%=v(@domain)=%%
/* Expected Output: Domain: example.com */
```

### Example 2: Advanced Scenario with Personalization String

This example shows how to use `Domain()` with the `emailaddr` system personalization string, which dynamically retrieves the recipient's email address in a Marketing Cloud email send. It also includes a check for a valid domain before displaying.

```html
%%[
VAR @recipientEmail, @recipientDomain

/* Retrieve the recipient's email address using the emailaddr personalization string */
SET @recipientEmail = AttributeValue("emailaddr")

/* Check if the recipient email is not empty before extracting the domain */
IF NOT EMPTY(@recipientEmail) THEN
    SET @recipientDomain = Domain(@recipientEmail)

    /* Further check if a valid domain was returned */
    IF NOT EMPTY(@recipientDomain) THEN
        /* Display the extracted domain */
    ELSE
        SET @recipientDomain = "No valid domain found for recipient."
    ENDIF
ELSE
    SET @recipientDomain = "Recipient email address is not available."
ENDIF
]%%

Recipient Email Domain: %%=v(@recipientDomain)=%%
/* Example Output (if recipient email is mary.smith@example.com): Recipient Email Domain: example.com */
```