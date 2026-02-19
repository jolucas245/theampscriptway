---
title: "AuthenticatedEmployeeNotificationAddress"
---


Returns the notification email address of the authenticated Marketing Cloud Engagement user who is currently accessing the page. This function is primarily used within Microsites when leveraging Sender Authenticated Redirection.

### Arguments

| Ordinal | Type | Required | Description |
|---|---|---|---|
| N/A | N/A | N/A | This function does not accept any arguments. |

> NOTE: This function is intended for use only with Microsites and requires Sender Authenticated Redirection to be configured.

### Example 1: Basic Use

This example demonstrates how to retrieve and display the authenticated employee's notification email address.

```html
%%[
    /* Retrieve the authenticated employee's notification email address */
    SET @employeeNotificationAddress = AuthenticatedEmployeeNotificationAddress()

    /* Check if the address is not empty before displaying */
    IF NOT EMPTY(@employeeNotificationAddress) THEN
        Output(Concat("Authenticated Employee Notification Address: ", @employeeNotificationAddress))
    ELSE
        Output("No authenticated employee notification address found.")
    ENDIF
]%%
```

### Example 2: Conditional Content Based on Employee Address

This example shows how to use the authenticated employee's notification address to display conditional content, such as a personalized message or specific links.

```html
%%[
    /* Retrieve the authenticated employee's notification email address */
    SET @employeeNotificationAddress = AuthenticatedEmployeeNotificationAddress()

    /* Define a specific email address for comparison */
    SET @adminEmail = "admin@example.com"
]%%

<p>Welcome!</p>

%%[
    /* Check if the authenticated address matches a specific admin email */
    IF NOT EMPTY(@employeeNotificationAddress) AND @employeeNotificationAddress == @adminEmail THEN
]%%
        <p>You have administrative access. <a href="/admin-dashboard">Go to Admin Dashboard</a></p>
%%[
    ELSEIF NOT EMPTY(@employeeNotificationAddress) THEN
]%%
        <p>Your notification email is: %%=v(@employeeNotificationAddress)=%%</p>
        <p>Access your personalized content <a href="/my-content">here</a>.</p>
%%[
    ELSE
]%%
        <p>Please log in to view personalized content.</p>
%%[
    ENDIF
]%%
```