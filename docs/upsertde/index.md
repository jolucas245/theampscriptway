---
title: "UpsertDE"
---


Updates existing rows in a data extension or inserts new rows if no matching records are found. This function is specifically designed for use within emails and does not return any output. It allows for flexible updates or insertions based on specified search criteria and new values.

### Arguments

| Ordinal | Type | Required | Description |
|---|---|---|---|
| 1 | String | True | The name of the data extension to update or insert data into. |
| 2 | Number | True | The number of column and value pairs used for matching existing rows. |
| 3 | String | True | The name of the first column to use for searching. |
| 4 | String | True | The value to match in the first search column. |
| 5a | String | False | (Optional) Additional column name for searching. |
| 5b | String | False | (Optional) Additional value to match in the corresponding search column. |
| 6 | String | True | The name of the first column to update or insert data into. |
| 7 | String | True | The value to update or insert into the first specified column. |
| 8a | String | False | (Optional) Additional column name to update or insert data into. |
| 8b | String | False | (Optional) Additional value to update or insert into the corresponding column. |

> NOTE: This function is exclusively for use within emails. For updating or inserting data into data extensions on landing pages, microsites, CloudPages, or via SMS messages in MobileConnect, use the `UpsertData()` function instead.

> NOTE: Upsert operations performed by `UpsertDE()` are processed at the completion of the entire send. If a `RaiseError()` function is triggered during the send process, causing the send to abort, any pending `UpsertDE()` operations will not be completed.

> NOTE: If the number of `columnValuePairs` specified does not match the actual number of search column and value pairs provided, the function will throw an exception.

> NOTE: Providing a `searchColumnName` that does not exist in the target data extension will result in an exception.

> NOTE: If the `upsertedValue` data type does not match the data type of the `columnToUpsert`, the function will fail to update or insert data and will return `0` (though `UpsertDE` does not return output, this indicates an internal failure).

> NOTE: If the number of search parameters does not equal the number of upsert parameters, only the columns for which search parameters were provided will be updated, or a new row will be inserted with only those columns populated. You can repeat upsert parameters multiple times if necessary.

### Example 1: Basic Use

This example demonstrates updating a subscriber's first name and a last updated timestamp in a Data Extension named "Subscribers" based on their `SubscriberKey`. If the `SubscriberKey` does not exist, a new row will be inserted.

```html
%%[
    VAR @subscriberKey, @newFirstName, @lastUpdated

    /* Set the SubscriberKey to identify the row. */
    SET @subscriberKey = AttributeValue("SubscriberKey") /* Retrieves from send context */
    IF EMPTY(@subscriberKey) THEN
        SET @subscriberKey = "example@example.com" /* Fallback or literal value */
    ENDIF

    /* Set the new first name to update. */
    SET @newFirstName = "John"

    /* Set the current timestamp for the last updated field. */
    SET @lastUpdated = NOW()

    /* Perform the UpsertDE operation. */
    /* It searches by SubscriberKey and updates FirstName and LastUpdated. */
    UpsertDE("Subscribers", 1, "SubscriberKey", @subscriberKey, "FirstName", @newFirstName, "LastUpdated", @lastUpdated)
]%%
```

### Example 2: Advanced Scenario with Multiple Search Criteria

This example illustrates how to use `UpsertDE` with multiple search criteria to update or insert a customer's order status and notes in an "Orders" Data Extension. The function will search for a record matching both `OrderID` and `CustomerID`.

```html
%%[
    VAR @orderID, @customerID, @newStatus, @orderNotes

    /* Define the OrderID and CustomerID for searching. */
    SET @orderID = "ORD12345"
    SET @customerID = "CUST67890"

    /* Define the new status and notes for the order. */
    SET @newStatus = "Shipped"
    SET @orderNotes = "Item dispatched from warehouse. Tracking information sent."

    /* Perform the UpsertDE operation with two search criteria. */
    /* It searches by OrderID and CustomerID, then updates OrderStatus and OrderNotes. */
    UpsertDE("Orders", 2, 
        "OrderID", @orderID, 
        "CustomerID", @customerID, 
        "OrderStatus", @newStatus, 
        "OrderNotes", @orderNotes
    )
]%%
```