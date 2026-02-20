---
title: "AddObjectArrayItem"
---


Adds an object to an array in a Marketing Cloud Engagement API object. This function is typically used in conjunction with `CreateObject` and `SetObjectProperty` to construct complex API objects for interactions with the Marketing Cloud Engagement SOAP API.

### Arguments

| Ordinal | Type       | Required | Description                                                              |
|---------|------------|----------|--------------------------------------------------------------------------|
| 1       | API Object | Yes      | The API object that contains the array to which you want to add an item. |
| 2       | String     | Yes      | The name of the array property within the API object to modify.          |
| 3       | String     | Yes      | The item (object or value) to add to the specified array.                |

### Notes

> NOTE: This function is primarily used for programmatic interaction with the Salesforce Marketing Cloud Engagement SOAP API and is not typically used for direct data manipulation within emails or landing pages without an API context.

### Example 1: Basic Use

This example demonstrates how to create a simple API object, set a property, and then add an item to an array within that object.

```html
/* Initialize an API object */
VAR @mySubscriber
SET @mySubscriber = CreateObject("Subscriber")

/* Set a property on the API object */
IF NOT EMPTY(@mySubscriber) THEN
    Call SetObjectProperty(@mySubscriber, "EmailAddress", "test@example.com")
ENDIF

/* Add an attribute to the "Attributes" array of the subscriber object */
IF NOT EMPTY(@mySubscriber) THEN
    Call AddObjectArrayItem(@mySubscriber, "Attributes", "myNewAttribute")
ENDIF

/* Further processing with the @mySubscriber object, e.g., InvokeCreate */
/* ... */

/* Output for demonstration (not typically done in production for API objects) */
/* IF NOT EMPTY(@mySubscriber) THEN */
/*     OutputLine(Concat("Subscriber Object Created: ", Stringify(@mySubscriber))) */
/* ENDIF */
```

### Example 2: Advanced Scenario - Creating a Subscriber with Multiple Attributes

This example demonstrates how to create a new subscriber in Marketing Cloud Engagement using `CreateObject`, `SetObjectProperty`, and `AddObjectArrayItem` to include multiple custom attributes, followed by `InvokeCreate` to persist the data.

```html
%%[
/* --- Variable Declarations --- */
VAR @subscriber, @emailAddress, @firstName, @lastName, @customAttribute1, @customAttribute2
VAR @status, @requestId, @error

/* --- Input Values (e.g., from a CloudPage form or Data Extension) --- */
SET @emailAddress = "john.doe@example.com"
SET @firstName = "John"
SET @lastName = "Doe"
SET @customAttribute1 = "Value1"
SET @customAttribute2 = "Value2"

/* --- Create Subscriber API Object --- */
SET @subscriber = CreateObject("Subscriber")

/* --- Set Standard Subscriber Properties --- */
IF NOT EMPTY(@subscriber) THEN
    Call SetObjectProperty(@subscriber, "EmailAddress", @emailAddress)
    Call SetObjectProperty(@subscriber, "SubscriberKey", @emailAddress) /* Often same as EmailAddress */
ENDIF

/* --- Add Custom Attributes using AddObjectArrayItem --- */
/* Custom attributes are added to the "Attributes" array of the Subscriber object */
IF NOT EMPTY(@subscriber) THEN
    /* Add FirstName */
    VAR @attr1
    SET @attr1 = CreateObject("Attribute")
    Call SetObjectProperty(@attr1, "Name", "FirstName")
    Call SetObjectProperty(@attr1, "Value", @firstName)
    Call AddObjectArrayItem(@subscriber, "Attributes", @attr1)

    /* Add LastName */
    VAR @attr2
    SET @attr2 = CreateObject("Attribute")
    Call SetObjectProperty(@attr2, "Name", "LastName")
    Call SetObjectProperty(@attr2, "Value", @lastName)
    Call AddObjectArrayItem(@subscriber, "Attributes", @attr2)

    /* Add CustomAttribute1 */
    VAR @attr3
    SET @attr3 = CreateObject("Attribute")
    Call SetObjectProperty(@attr3, "Name", "CustomAttribute1")
    Call SetObjectProperty(@attr3, "Value", @customAttribute1)
    Call AddObjectArrayItem(@subscriber, "Attributes", @attr3)

    /* Add CustomAttribute2 */
    VAR @attr4
    SET @attr4 = CreateObject("Attribute")
    Call SetObjectProperty(@attr4, "Name", "CustomAttribute2")
    Call SetObjectProperty(@attr4, "Value", @customAttribute2)
    Call AddObjectArrayItem(@subscriber, "Attributes", @attr4)
ENDIF

/* --- Invoke Create Operation --- */
IF NOT EMPTY(@subscriber) THEN
    SET @status = InvokeCreate(@subscriber, @requestId)

    /* --- Check Status and Handle Errors --- */
    IF @status == "OK" THEN
        /* Subscriber created successfully */
        OutputLine(Concat("Subscriber ", @emailAddress, " created successfully. Request ID: ", @requestId))
    ELSE
        /* Error occurred during creation */
        SET @error = _message
        OutputLine(Concat("Error creating subscriber ", @emailAddress, ": ", @error))
    ENDIF
ENDIF
]%%
```