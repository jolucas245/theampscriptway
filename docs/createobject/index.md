---
title: "CreateObject"
---


This function creates a Marketing Cloud Engagement API Object. It is a foundational function used to instantiate various API objects that can then be manipulated using other AMPscript API functions like `InvokeCreate()`, `InvokeUpdate()`, `InvokeDelete()`, etc. The object created by `CreateObject()` serves as a temporary representation of a Marketing Cloud entity (e.g., Subscriber, DataExtensionObject) for a single API interaction.

### Arguments

| Ordinal | Type   | Required | Description                          |
|---------|--------|----------|--------------------------------------|
| 1       | string | Yes      | The name of the new API Object to create. This typically corresponds to a Marketing Cloud API object type (e.g., 'Subscriber', 'DataExtensionObject'). |

> NOTE: An object created with `CreateObject()` only persists for the duration of a single subsequent Invoke API call. It is not designed for long-term persistence or for passing between multiple, independent API calls. For instance, if you create a Subscriber object and then attempt to update it using `InvokeUpdate()` in a separate context, you cannot directly pass the `CreateObject()` result to a Triggered Send or other asynchronous processes.

### Example 1: Basic Use - Creating a Subscriber Object

This example demonstrates how to create a basic Subscriber object, which can then be used with functions like `InvokeCreate()` to add a new subscriber to All Subscribers.

```html
%%[
/* Define variables for the Subscriber object properties */
VAR @subscriberKey, @emailAddress, @listID
SET @subscriberKey = "example@example.com"
SET @emailAddress = "example@example.com"
SET @listID = 12345 /* Replace with your actual List ID */

/* Create the Subscriber API object */
VAR @subscriber
SET @subscriber = CreateObject("Subscriber")

/* Check if the object was created successfully before proceeding */
IF NOT EMPTY(@subscriber) THEN
    /* Add properties to the Subscriber object */
    CALL AddObjectArrayItem(@subscriber, "EmailAddress", @emailAddress)
    CALL AddObjectArrayItem(@subscriber, "SubscriberKey", @subscriberKey)
    CALL AddObjectArrayItem(@subscriber, "Lists")

    /* Create a List object and add it to the Subscriber's Lists array */
    VAR @list
    SET @list = CreateObject("List")
    IF NOT EMPTY(@list) THEN
        CALL AddObjectArrayItem(@list, "ID", @listID)
        CALL AddObjectArrayItem(@subscriber, "Lists", @list)
    ELSE
        /* Handle error if List object creation failed */
        OutputLine(Concat("<!-- Error: Failed to create List object for List ID: ", @listID, " -->"))
    ENDIF

    /* The @subscriber object is now ready to be used with InvokeCreate() */
    /* Example: SET @createStatus = InvokeCreate(@subscriber, @createResults) */
    OutputLine(Concat("<!-- Subscriber object created for: ", @emailAddress, " -->"))
ELSE
    /* Handle error if Subscriber object creation failed */
    OutputLine("<!-- Error: Failed to create Subscriber object -->")
ENDIF
]%%
```

### Example 2: Advanced Scenario - Creating a Data Extension Row Object

This example illustrates how to create a `DataExtensionObject` to insert a new row into a specific Data Extension. This is commonly used for transactional data or custom data storage.

```html
%%[
/* Define variables for the Data Extension and its fields */
VAR @deName, @customerKey, @orderID, @productName, @quantity
SET @deName = "OrderDetails" /* Replace with your Data Extension name */
SET @customerKey = "CUST123" /* Example Customer Key */
SET @orderID = "ORD456" /* Example Order ID */
SET @productName = "Widget A"
SET @quantity = 2

/* Create the DataExtensionObject API object */
VAR @deObject
SET @deObject = CreateObject("DataExtensionObject")

/* Check if the object was created successfully before proceeding */
IF NOT EMPTY(@deObject) THEN
    /* Set the CustomerKey (External Key) of the Data Extension */
    CALL SetObjectProperty(@deObject, "CustomerKey", @deName)

    /* Create a Property array to hold the Data Extension fields */
    CALL AddObjectArrayItem(@deObject, "Properties")

    /* Add individual fields as Property objects */
    VAR @prop1, @prop2, @prop3, @prop4

    /* Field: CustomerKey */
    SET @prop1 = CreateObject("Property")
    IF NOT EMPTY(@prop1) THEN
        CALL SetObjectProperty(@prop1, "Name", "CustomerKey")
        CALL SetObjectProperty(@prop1, "Value", @customerKey)
        CALL AddObjectArrayItem(@deObject, "Properties", @prop1)
    ENDIF

    /* Field: OrderID */
    SET @prop2 = CreateObject("Property")
    IF NOT EMPTY(@prop2) THEN
        CALL SetObjectProperty(@prop2, "Name", "OrderID")
        CALL SetObjectProperty(@prop2, "Value", @orderID)
        CALL AddObjectArrayItem(@deObject, "Properties", @prop2)
    ENDIF

    /* Field: ProductName */
    SET @prop3 = CreateObject("Property")
    IF NOT EMPTY(@prop3) THEN
        CALL SetObjectProperty(@prop3, "Name", "ProductName")
        CALL SetObjectProperty(@prop3, "Value", @productName)
        CALL AddObjectArrayItem(@deObject, "Properties", @prop3)
    ENDIF

    /* Field: Quantity */
    SET @prop4 = CreateObject("Property")
    IF NOT EMPTY(@prop4) THEN
        CALL SetObjectProperty(@prop4, "Name", "Quantity")
        CALL SetObjectProperty(@prop4, "Value", @quantity)
        CALL AddObjectArrayItem(@deObject, "Properties", @prop4)
    ENDIF

    /* The @deObject is now ready to be used with InvokeCreate() */
    /* Example: SET @createStatus = InvokeCreate(@deObject, @createResults) */
    OutputLine(Concat("<!-- Data Extension Object created for Order ID: ", @orderID, " -->"))
ELSE
    /* Handle error if DataExtensionObject creation failed */
    OutputLine("<!-- Error: Failed to create DataExtensionObject -->")
ENDIF
]%%
```