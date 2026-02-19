---
title: "Logical Operators"
---


Logical operators in AMPscript are used to combine or modify conditional expressions, allowing for more complex decision-making within your scripts. They evaluate boolean expressions (true/false) and return a single boolean result, which is crucial for controlling the flow of execution in `If` statements and other conditional logic.

### Arguments

Logical operators do not take arguments in the traditional sense. Instead, they operate on boolean expressions. The following table describes the available logical operators:

| Ordinal | Type      | Required | Description                                     |
|---------|-----------|----------|-------------------------------------------------|
| 1       | Boolean   | Yes      | The first boolean expression to evaluate.       |
| 2       | Operator  | Yes      | The logical operator (`and`, `or`, `not`).      |
| 3       | Boolean   | Yes      | The second boolean expression to evaluate (if applicable). |

> NOTE: When combining multiple logical operators, use parentheses to explicitly define the order of evaluation and prevent unexpected results.

### Example 1: Basic Use of AND and OR

This example demonstrates how to use `and` and `or` operators to check multiple conditions for personalizing an email message. It checks if a subscriber is an active customer AND has a high engagement score, OR if they are a new subscriber.

```html
%%[VAR @is_active_customer, @engagement_score, @is_new_subscriber, @message

SET @is_active_customer = true
SET @engagement_score = 85
SET @is_new_subscriber = false

/* Evaluate conditions using logical AND and OR */
IF NOT EMPTY(@is_active_customer) AND NOT EMPTY(@engagement_score) AND NOT EMPTY(@is_new_subscriber) THEN
    IF (@is_active_customer == true AND @engagement_score > 70) OR @is_new_subscriber == true THEN
        SET @message = "We have a special offer just for you!"
    ELSE
        SET @message = "Check out our latest products."
    ENDIF
ELSE
    /* Handle cases where critical variables are empty or null */
    SET @message = "Hello there! We hope you're having a great day."
ENDIF
]%%

<p>%%=v(@message)=%%</p>
```

### Example 2: Using NOT Operator

This example shows how to use the `not` operator to reverse a condition. It checks if a subscriber is NOT opted out from a specific communication type.

```html
%%[VAR @opt_out_status, @communication_type, @send_email

SET @opt_out_status = "Marketing"
SET @communication_type = "Promotional"
SET @send_email = false

/* Check if the subscriber has NOT opted out of promotional emails */
IF NOT EMPTY(@opt_out_status) AND NOT EMPTY(@communication_type) THEN
    IF NOT (@opt_out_status == @communication_type) THEN
        SET @send_email = true
        /* Further logic for sending email */
    ELSE
        /* Subscriber has opted out */
        SET @send_email = false
    ENDIF
ELSE
    /* Default to not sending if opt-out status is unknown */
    SET @send_email = false
ENDIF

/* Display whether the email will be sent */
IF @send_email == true THEN
    OUTPUT(Concat("Email will be sent for ", @communication_type, " communications."))
ELSE
    OUTPUT(Concat("Email will NOT be sent for ", @communication_type, " communications."))
ENDIF
]%%
```