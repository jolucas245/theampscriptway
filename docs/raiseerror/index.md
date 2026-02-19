---
title: "RaiseError"
---


The `RaiseError` function is an AMPscript utility that allows for explicit error handling within Salesforce Marketing Cloud email, SMS, and other message sends. When invoked, it raises a custom error message and, depending on its configuration, can either halt the entire send job or prevent the current subscriber from receiving the message while allowing the job to continue for others. This function is crucial for implementing robust exception handling, ensuring data integrity, and managing undesirable send scenarios.

### Arguments

| Ordinal | Type    | Required | Description                                                                                             |
|---------|---------|----------|---------------------------------------------------------------------------------------------------------|
| 1       | String  | Yes      | The custom error message to be displayed when the error is raised.                                      |
| 2       | Boolean | No       | If `true`, the send job will continue for other subscribers. If `false` or omitted, the entire send job will be stopped. |

> NOTE: When `RaiseError` is used in a send context (e.g., email send), the error message will typically be visible in the tracking or error logs within Marketing Cloud. The behavior regarding job continuation (stopping for all vs. continuing for others) is controlled by the second boolean argument.

### Example 1: Basic Use - Halting the Send for Critical Data Issues

This example demonstrates how to use `RaiseError` to stop an entire email send if a critical piece of data, such as a `SubscriberKey`, is missing or invalid. This ensures that no emails are sent without essential recipient information.

```html
%%[VAR @subscriberKey
SET @subscriberKey = AttributeValue("SubscriberKey")

/* Check if SubscriberKey is empty or null */
IF NOT EMPTY(@subscriberKey) THEN
    /* Proceed with content generation if SubscriberKey is valid */
    SET @firstName = ProperCase(AttributeValue("FirstName"))
    SET @lastName = ProperCase(AttributeValue("LastName"))

    IF NOT EMPTY(@firstName) THEN
        Output(Concat("Hello ", @firstName, ","))
    ELSE
        Output("Hello,")
    ENDIF

    Output(Concat("\n\nYour SubscriberKey is: ", @subscriberKey, "."))
ELSE
    /* Raise an error and stop the entire send if SubscriberKey is missing */
    RaiseError("Critical Error: SubscriberKey is missing. Halting entire send job.", false)
ENDIF
]%%
```

### Example 2: Advanced Scenario - Skipping Individual Subscribers with Invalid Data

This example illustrates how to use `RaiseError` to skip sending an email to a specific subscriber if their data does not meet certain criteria (e.g., an invalid email address format), while allowing the send job to continue for all other valid subscribers. This is useful for maintaining send volume while filtering out problematic records.

```html
%%[VAR @emailAddress, @isValidEmail
SET @emailAddress = AttributeValue("EmailAddress")
SET @isValidEmail = IIF(IndexOf(@emailAddress, "@") > 0 AND IndexOf(@emailAddress, ".") > 0, true, false)

/* Check if the email address is valid */
IF @isValidEmail THEN
    /* Proceed with email content if the email address is valid */
    SET @customerName = ProperCase(AttributeValue("Name"))
    Output(Concat("Dear ", @customerName, ",\n\nThank you for your interest."))
ELSE
    /* Raise an error for the current subscriber and continue the send for others */
    RaiseError(Concat("Invalid Email Address for subscriber: ", @emailAddress, ". Skipping this subscriber."), true)
ENDIF
]%%
```