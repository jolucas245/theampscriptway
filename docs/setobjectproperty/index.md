---
title: "SetObjectProperty"
---


The `SetObjectProperty()` function is used to assign a value to a specific property of an API object that was previously created using the `CreateObject()` function. This is crucial for dynamically constructing API requests within AMPscript, allowing you to interact with Salesforce Marketing Cloud's SOAP API to perform operations such as creating subscribers, updating data extensions, or managing other entities.

### Arguments

| Ordinal | Type        | Required | Description                                          |
|---------|-------------|----------|------------------------------------------------------|
| 1       | API Object  | Yes      | The API Object to which the property will be assigned. |
| 2       | String      | Yes      | The name of the property to set.                     |
| 3       | String      | Yes      | The value to assign to the property.                 |

> NOTE: This function is primarily used in conjunction with other SOAP API functions like `CreateObject()`, `InvokeCreate()`, `InvokeUpdate()`, and `InvokeDelete()` to build complex API interactions within AMPscript.

### Example 1: Basic Use - Setting Subscriber Email Address

This example demonstrates how to create a `Subscriber` object and set its `EmailAddress` property using `SetObjectProperty()`.

```html
%%[/* Initialize variables for email and subscriber object */
VAR @email, @subscriber

/* Define the email address */
SET @email = "john.doe@example.com"

/* Create a new API object of type 'Subscriber' */
SET @subscriber = CreateObject('Subscriber')

/* Set the 'EmailAddress' property of the @subscriber object */
IF NOT EMPTY(@subscriber) THEN
    CALL SetObjectProperty(@subscriber, 'EmailAddress', @email)
ELSE
    /* Handle case where subscriber object could not be created */
    OutputLine(Concat("Error: Could not create Subscriber object."))
ENDIF

/* Further API interactions (e.g., InvokeCreate) would follow here */
/* Output for demonstration purposes */
OutputLine(Concat("Subscriber Email Set: ", @email))
]%%
```

### Example 2: Advanced Scenario - Creating a Data Extension Row

This example illustrates how to create a new row in a Data Extension by constructing a `DataExtensionObject` and setting its properties using `SetObjectProperty()`.

```html
%%[/* Initialize variables for Data Extension and fields */
VAR @deName, @deObject, @field1Name, @field1Value, @field2Name, @field2Value

/* Define Data Extension name and field values */
SET @deName = "MyNewDataExtension"
SET @field1Name = "SubscriberKey"
SET @field1Value = "12345"
SET @field2Name = "FirstName"
SET @field2Value = "Jane"

/* Create a new API object of type 'DataExtensionObject' */
SET @deObject = CreateObject('DataExtensionObject')

/* Set the 'CustomerKey' property to the Data Extension's external key */
IF NOT EMPTY(@deObject) THEN
    CALL SetObjectProperty(@deObject, 'CustomerKey', @deName)

    /* Create a 'Properties' object to hold the Data Extension fields */
    VAR @properties
    SET @properties = CreateObject('Properties')

    /* Set individual field properties */
    IF NOT EMPTY(@properties) THEN
        /* Field 1 */
        VAR @prop1
        SET @prop1 = CreateObject('Property')
        CALL SetObjectProperty(@prop1, 'Name', @field1Name)
        CALL SetObjectProperty(@prop1, 'Value', @field1Value)
        CALL AddObjectArray(@properties, 'Property', @prop1)

        /* Field 2 */
        VAR @prop2
        SET @prop2 = CreateObject('Property')
        CALL SetObjectProperty(@prop2, 'Name', @field2Name)
        CALL SetObjectProperty(@prop2, 'Value', @field2Value)
        CALL AddObjectArray(@properties, 'Property', @prop2)

        /* Add the 'Properties' object to the DataExtensionObject */
        CALL SetObjectProperty(@deObject, 'Properties', @properties)

        /* Further API interactions (e.g., InvokeCreate) would follow here to save the DE row */
        /* Output for demonstration purposes */
        OutputLine(Concat("Data Extension Object created for ", @deName, ". Fields: ", @field1Name, "=", @field1Value, ", ", @field2Name, "=", @field2Value))
    ELSE
        OutputLine(Concat("Error: Could not create Properties object."))
    ENDIF
ELSE
    OutputLine(Concat("Error: Could not create DataExtensionObject."))
ENDIF
]%%
```