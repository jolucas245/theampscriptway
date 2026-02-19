---
title: "GetValue"
---


This function returns the value of the specified Subscriber attribute or AMPscript variable.

### Arguments

| Ordinal | Type   | Required | Description                                                  |
| ------- | ------ | -------- | ------------------------------------------------------------ |
| 1       | String | True     | Subscriber attribute or AMPscript variable from which to return a value |

> NOTE: The function is prefixed with an `Attribute` object to retrieve Subscriber attributes (either [Attribute Strings](https://ampscript.guide/attribute-strings/) or [System Strings](https://ampscript.guide/system-strings/)) or a `Variable` object to retrieve AMPscript variables. Prefixing AMPscript variables with an `@` character is optional.

### Example 1: Basic Use

This example demonstrates how to retrieve the value of an AMPscript variable using `GetValue` within a Server-Side JavaScript (SSJS) block.

```html
%%[
    VAR @firstName

    /* Check if the 'firstName' attribute exists and is not empty */
    IF NOT EMPTY(AttributeValue("firstName")) THEN
        SET @firstName = AttributeValue("firstName") /* Get value from attribute or Data Extension column */
    ELSE
        SET @firstName = "Guest" /* Default value if attribute is empty */
    ENDIF
]%%
<script runat="server">
    Platform.Load("core","1.1.5");

    /* Retrieve the AMPscript variable @firstName using Variable.GetValue */
    var firstName = Variable.GetValue("@firstName");

    /* Output the retrieved value */
    Write("<br>First Name: " + firstName);
</script>
```

### Example 2: Advanced Scenario - Retrieving Multiple Attributes

This example shows how to retrieve multiple subscriber attributes using `Attribute.GetValue` within an SSJS block, providing a more robust way to handle personalization.

```html
%%[
    VAR @subscriberKey, @emailAddress, @jobID

    /* Initialize variables with default empty strings */
    SET @subscriberKey = ""
    SET @emailAddress = ""
    SET @jobID = ""

    /* Check and set SubscriberKey */
    IF NOT EMPTY(AttributeValue("_subscriberKey")) THEN
        SET @subscriberKey = AttributeValue("_subscriberKey")
    ENDIF

    /* Check and set Email Address */
    IF NOT EMPTY(AttributeValue("emailaddr")) THEN
        SET @emailAddress = AttributeValue("emailaddr")
    ENDIF

    /* Check and set Job ID */
    IF NOT EMPTY(AttributeValue("jobid")) THEN
        SET @jobID = AttributeValue("jobid")
    ENDIF
]%%
<script runat="server">
    Platform.Load("core","1.1.5");

    /* Retrieve AMPscript variables using Attribute.GetValue */
    var subscriberKey = Attribute.GetValue("_subscriberKey");
    var email = Attribute.GetValue("emailaddr");
    var jobid = Attribute.GetValue("jobid");

    /* Output all retrieved values */
    Write("<br>Subscriber Key: " + subscriberKey);
    Write("<br>Email: " + email);
    Write("<br>Job ID: " + jobid);
</script>
```