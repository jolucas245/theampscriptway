---
title: "System Strings"
---


System strings in Salesforce Marketing Cloud are a library of predefined personalization strings that can be included in messages or on pages to output values based on the context of the Subscriber, Contact, or message. These strings provide dynamic content such as current dates, email metadata, subscriber attributes, sender information, and various URLs, without requiring explicit function calls.

### Arguments

System strings are not functions and therefore do not accept arguments. They are direct references to system-defined values that are resolved at the time of send or page rendering.

### Notes

> NOTE: Date-based personalization strings use the system time (the data center location of your Marketing Cloud account) and appear in US format. However, these values can be transformed using AMPscript [date functions](https://ampscript.guide/date-time-functions/).

> NOTE: The `_CarrierID` field values for MobileConnect Contact Data Strings are reportedly incorrect or inconsistent. Use with caution.

### Example 1: Basic Use of Date and Subscriber Data

This example demonstrates how to display the current date and a subscriber's first name using system strings. It includes defensive checks to ensure values are not empty before displaying them.

```html
%%[
    /* Define variables for system strings */
    VAR @currentDate, @firstName

    /* Retrieve system string values */
    SET @currentDate = AttributeValue("xtlongdate") /* Retrieves the long date format */
    SET @firstName = AttributeValue("firstname_")   /* Retrieves the subscriber's first name */

    /* Check if values are not empty before displaying */
    IF NOT EMPTY(@currentDate) THEN
]%%
Today's Date: %%=v(@currentDate)=%%
%%[
    ENDIF

    IF NOT EMPTY(@firstName) THEN
]%%
Hello, %%=v(@firstName)=%%!
%%[
    ENDIF
]%%
```

### Example 2: Advanced Scenario with Email Data and URLs

This example shows how to use email-related system strings and a personalization string for the view-as-web-page URL. It also includes a check for the message context.

```html
%%[
    /* Define variables for system strings */
    VAR @emailName, @messageContext, @viewEmailURL

    /* Retrieve system string values */
    SET @emailName = AttributeValue("emailname_")
    SET @messageContext = AttributeValue("_messagecontext")
    SET @viewEmailURL = AttributeValue("view_email_url")

    /* Check if values are not empty before displaying */
    IF NOT EMPTY(@emailName) THEN
]%%
Email Name: %%=v(@emailName)=%%
%%[
    ENDIF

    IF NOT EMPTY(@messageContext) THEN
]%%
Message Context: %%=v(@messageContext)=%%
%%[
    ENDIF

    /* Display View as Web Page URL if available and in SEND context */
    IF NOT EMPTY(@viewEmailURL) AND @messageContext == "SEND" THEN
]%%
View this email in your browser: <a href="%%=RedirectTo(@viewEmailURL)=%%">Click Here</a>
%%[
    ENDIF
]%%
```