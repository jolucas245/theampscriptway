---
title: "Personalization Strings Overview"
---


Personalization strings in Salesforce Marketing Cloud are placeholders that allow dynamic insertion of subscriber attributes or system-defined values into emails, landing pages, SMS, and push notifications. They are a fundamental mechanism for delivering personalized content without requiring complex AMPscript logic for simple data retrieval. These strings are processed by the Marketing Cloud platform at the time of send or page rendering, replacing the placeholder with the actual value relevant to the individual subscriber or the system context.

### Arguments

| Ordinal | Type | Required | Description |
| :------ | :--- | :------- | :---------- |
| N/A     | N/A  | N/A      | This is a conceptual overview, not a callable AMPscript function. Therefore, it does not accept any arguments. |

> NOTE: Personalization strings are distinct from AMPscript variables. While both provide dynamic content, personalization strings are pre-defined placeholders, whereas AMPscript variables are declared and manipulated within AMPscript blocks. Personalization strings are often used in conjunction with AMPscript for more complex conditional logic or data manipulation.

### Example 1: Basic Use of Subscriber Attributes

This example demonstrates how to use personalization strings to insert a subscriber's first name and email address into an email. It includes defensive checks to ensure that if the attributes are empty, a default value is used.

```html
%%[ /* Start AMPscript block */
    /* Define default values for personalization strings */
    SET @firstName = AttributeValue("FirstName")
    SET @emailAddress = AttributeValue("EmailAddress")

    /* Check if FirstName is empty and assign a default if it is */
    IF NOT EMPTY(@firstName) THEN
        SET @displayFirstName = @firstName
    ELSE
        SET @displayFirstName = "Valued Customer"
    ENDIF

    /* Check if EmailAddress is empty and assign a default if it is */
    IF NOT EMPTY(@emailAddress) THEN
        SET @displayEmailAddress = @emailAddress
    ELSE
        SET @displayEmailAddress = "your email address"
    ENDIF
]%%

Hello %%=v(@displayFirstName)=%%,

Thank you for being a part of our community. We'll send updates to %%=v(@displayEmailAddress)=%%.

```

### Example 2: Using System Personalization Strings

This example illustrates the use of system personalization strings, such as the Job ID and Member ID, which are automatically populated by Marketing Cloud during a send. These are useful for tracking or linking back to specific send contexts.

```html
%%[ /* Start AMPscript block */
    /* System personalization strings do not require explicit AttributeValue calls */
    /* They are directly accessible as placeholders */

    /* Example of retrieving Job ID and Member ID */
    SET @jobID = Jobid
    SET @memberID = Memberid

    /* You can also use them directly in the HTML content */
]%%

<p>This email was sent as part of Job ID: %%=v(@jobID)=%%.</p>
<p>Your Member ID in our system is: %%=v(@memberID)=%%.</p>

<p>To view this email in your browser, click <a href="%%=ViewEmailURL()=%%">here</a>.</p>

```