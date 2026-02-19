---
title: "Email Url Data Strings"
---


This documentation describes the `email-url-data-strings` in AMPscript, which are a collection of built-in personalization strings (or variables) available within Salesforce Marketing Cloud. These strings dynamically generate and insert various email-related URLs into your email content, enabling functionalities such as viewing the email in a browser, forwarding to a friend, managing subscriptions, updating profiles, unsubscribing, and confirming double opt-in.

### Available Personalization Strings

| String | Type | Required | Description |
|---|---|---|---|
| `view_email_url` | String | N/A | The URL to view the email in a web browser. |
| `ftaf_url` | String | N/A | The URL to a Forward to a Friend form page. |
| `subscription_center_url` | String | N/A | The URL of the Subscriber’s Subscription Center, where subscribers can manage their preferences. |
| `profile_center_url` | String | N/A | The URL of the Subscriber’s Profile Center, where subscribers can update their personal information. |
| `unsub_center_url` | String | N/A | The URL of the Subscriber’s One-Click Unsubscribe page. |
| `double_opt_in_url` | String | N/A | Inserts a double opt-in link in an email, applicable only if this feature is enabled for the account. |

> NOTE: These personalization strings are primarily designed for use within email contexts in Salesforce Marketing Cloud and will dynamically resolve to the appropriate URLs based on the sending context and subscriber data.

### Example 1: Basic Use in an Email

This example demonstrates how to include various email-related URLs directly within an email body.

```html
%%[ /* Declare variables for storing the URLs */
VAR @viewEmailUrl, @forwardToFriendUrl, @subscriptionCenterUrl
VAR @profileCenterUrl, @unsubscribeUrl, @doubleOptInUrl

/* Assign the personalization strings to variables for defensive coding */
SET @viewEmailUrl = view_email_url
SET @forwardToFriendUrl = ftaf_url
SET @subscriptionCenterUrl = subscription_center_url
SET @profileCenterUrl = profile_center_url
SET @unsubscribeUrl = unsub_center_url
SET @doubleOptInUrl = double_opt_in_url
]%%

<html>
<head>
    <title>Email Update</title>
</head>
<body>
    <p>Hello %%FirstName%%,</p>
    <p>Thank you for being a valued subscriber.</p>
    
    <p>If you are having trouble viewing this email, <a href="%%=IIF(NOT EMPTY(@viewEmailUrl), @viewEmailUrl, '#')=%%">click here</a>.</p>
    <p>Know someone who might like this? <a href="%%=IIF(NOT EMPTY(@forwardToFriendUrl), @forwardToFriendUrl, '#')=%%">Forward to a Friend</a>.</p>
    <p>Manage your email preferences: <a href="%%=IIF(NOT EMPTY(@subscriptionCenterUrl), @subscriptionCenterUrl, '#')=%%">Subscription Center</a>.</p>
    <p>Update your profile: <a href="%%=IIF(NOT EMPTY(@profileCenterUrl), @profileCenterUrl, '#')=%%">Profile Center</a>.</p>
    <p>To stop receiving these emails, <a href="%%=IIF(NOT EMPTY(@unsubscribeUrl), @unsubscribeUrl, '#')=%%">unsubscribe here</a>.</p>
    
    %%[ IF NOT EMPTY(@doubleOptInUrl) THEN ]%%
        <p>Confirm your subscription: <a href="%%=IIF(NOT EMPTY(@doubleOptInUrl), @doubleOptInUrl, '#')=%%">Confirm Opt-In</a>.</p>
    %%[ ENDIF ]%%

    <p>Sincerely,<br>Your Team</p>
</body>
</html>
```

### Example 2: Dynamic Link Generation with Fallback

This example shows how to use these strings to create dynamic links with a fallback mechanism, ensuring that even if a URL is not available, a valid (though non-functional) link is still provided, preventing broken links in the email.

```html
%%[ /* Declare a variable for a generic link */
VAR @dynamicLink
VAR @linkText

/* Determine which link to use based on a hypothetical condition */
/* For demonstration, let's assume we want to prioritize the Profile Center */
SET @dynamicLink = profile_center_url
SET @linkText = "Update Your Profile"

/* If Profile Center URL is empty, fallback to Subscription Center */
IF NOT EMPTY(@dynamicLink) THEN
    /* Do nothing, use @dynamicLink as is */
ELSEIF NOT EMPTY(subscription_center_url) THEN
    SET @dynamicLink = subscription_center_url
    SET @linkText = "Manage Subscriptions"
ELSE
    /* Fallback to a generic placeholder if no specific URL is available */
    SET @dynamicLink = "#"
    SET @linkText = "Visit Our Website"
ENDIF
]%%

<p>Click here to <a href="%%=IIF(NOT EMPTY(@dynamicLink), @dynamicLink, '#')=%%">%%=v(@linkText)=%%</a>.</p>

%%[ /* Another example for unsubscribe with a check */
VAR @finalUnsubscribeUrl
SET @finalUnsubscribeUrl = unsub_center_url

/* Ensure the unsubscribe link is always present and valid */
IF NOT EMPTY(@finalUnsubscribeUrl) THEN ]%%
    <p><a href="%%=v(@finalUnsubscribeUrl)=%%">Unsubscribe</a> from our mailing list.</p>
%%[ ELSE ]%%
    <p>Please contact support to unsubscribe.</p>
%%[ ENDIF ]%%
```