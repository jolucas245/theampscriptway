---
title: "InvokeRetrieve"
---


The `InvokeRetrieve()` function is used in AMPscript to invoke the Retrieve method on a Marketing Cloud Engagement API Object. It facilitates the retrieval of data from various Marketing Cloud objects by returning the API status message and a request ID, which can then be used to process the retrieved data.

### Arguments

| Ordinal | Type              | Required | Description                                                                                             |
|---------|-------------------|----------|---------------------------------------------------------------------------------------------------------|
| 1       | API Object        | Yes      | The API Object on which the Retrieve method will be invoked (e.g., `Email`, `DataExtension`, `Subscriber`). |
| 2       | AMPscript variable | Yes      | An AMPscript variable to store the API status message returned by the invocation.                       |
| 3       | AMPscript variable | Yes      | An AMPscript variable to store the request ID returned by the invocation.                               |

> NOTE: The `InvokeRetrieve()` function is primarily used for interacting with the Marketing Cloud SOAP API. It requires a well-formed `RetrieveRequest` object to specify the object type, properties to retrieve, and optional filters.

### Example 1: Basic Email Retrieval

This example demonstrates how to retrieve basic information (Name and Subject) for all emails within the Marketing Cloud account using `InvokeRetrieve()`.

```html
%%[
    /* Declare variables for the RetrieveRequest object and results */
    VAR @rr, @statusMessage, @requestId, @emails, @emailRow, @emailName, @emailSubject

    /* Create a RetrieveRequest object */
    SET @rr = CreateObject("RetrieveRequest")

    /* Specify the ObjectType to retrieve (e.g., 'Email') */
    SetObjectProperty(@rr, "ObjectType", "Email")

    /* Add properties to retrieve for the Email object */
    AddObjectArrayItem(@rr, "Properties", "Name")
    AddObjectArrayItem(@rr, "Properties", "Subject")

    /* Invoke the Retrieve method and capture the status and request ID */
    SET @emails = InvokeRetrieve(@rr, @statusMessage, @requestId)

    /* Check if the retrieval was successful */
    IF NOT EMPTY(@statusMessage) AND @statusMessage == "OK" THEN
        /* Check if any emails were returned */
        IF RowCount(@emails) > 0 THEN
            /* Loop through the retrieved emails */
            FOR @i = 1 TO RowCount(@emails) DO
                SET @emailRow = Row(@emails, @i)
                SET @emailName = Field(@emailRow, "Name")
                SET @emailSubject = Field(@emailRow, "Subject")

                /* Output the email name and subject */
                OutputLine(Concat("Email Name: ", @emailName, "<br>"))
                OutputLine(Concat("Email Subject: ", @emailSubject, "<br>"))
            NEXT @i
        ELSE
            OutputLine("No emails found.<br>")
        ENDIF
    ELSE
        OutputLine(Concat("Error retrieving emails. Status: ", @statusMessage, " Request ID: ", @requestId, "<br>"))
    ENDIF
]%%
```

### Example 2: Retrieving Data Extension Rows with a Filter

This example illustrates how to retrieve rows from a specific Data Extension, applying a filter to get only records where a certain field matches a value. This requires constructing a `SimpleFilterPart`.

```html
%%[
    /* Declare variables for the RetrieveRequest, filter, and results */
    VAR @rr, @statusMessage, @requestId, @deRows, @deRow, @customerKey, @customerName
    VAR @sfp, @filterProperty, @filterValue

    /* Define the Data Extension external key and filter criteria */
    SET @dataExtensionExternalKey = "MyCustomerDataExtension"
    SET @filterProperty = "Status"
    SET @filterValue = "Active"

    /* Create a RetrieveRequest object */
    SET @rr = CreateObject("RetrieveRequest")

    /* Specify the ObjectType to retrieve (e.g., 'DataExtensionObject') */
    SetObjectProperty(@rr, "ObjectType", Concat("DataExtensionObject[", @dataExtensionExternalKey, "]"))

    /* Add properties (fields) to retrieve from the Data Extension */
    AddObjectArrayItem(@rr, "Properties", "CustomerKey")
    AddObjectArrayItem(@rr, "Properties", "CustomerName")
    AddObjectArrayItem(@rr, "Properties", @filterProperty)

    /* Create a SimpleFilterPart for filtering */
    SET @sfp = CreateObject("SimpleFilterPart")
    SetObjectProperty(@sfp, "Property", @filterProperty)
    SetObjectProperty(@sfp, "SimpleOperator", "equals")
    AddObjectArrayItem(@sfp, "Value", @filterValue)

    /* Apply the filter to the RetrieveRequest */
    SetObjectProperty(@rr, "Filter", @sfp)

    /* Invoke the Retrieve method */
    SET @deRows = InvokeRetrieve(@rr, @statusMessage, @requestId)

    /* Check if the retrieval was successful */
    IF NOT EMPTY(@statusMessage) AND @statusMessage == "OK" THEN
        /* Check if any rows were returned */
        IF RowCount(@deRows) > 0 THEN
            OutputLine(Concat("Retrieved ", RowCount(@deRows), " active customer records:<br>"))
            /* Loop through the retrieved Data Extension rows */
            FOR @i = 1 TO RowCount(@deRows) DO
                SET @deRow = Row(@deRows, @i)
                SET @customerKey = Field(@deRow, "CustomerKey")
                SET @customerName = Field(@deRow, "CustomerName")

                /* Output the customer information */
                OutputLine(Concat("Customer Key: ", @customerKey, ", Name: ", @customerName, "<br>"))
            NEXT @i
        ELSE
            OutputLine("No active customer records found.<br>")
        ENDIF
    ELSE
        OutputLine(Concat("Error retrieving Data Extension rows. Status: ", @statusMessage, " Request ID: ", @requestId, "<br>"))
    ENDIF
]%%
```