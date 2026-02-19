---
title: "Row"
---


The `Row` function in AMPscript is used to retrieve a specific row from a previously defined rowset or array. It is commonly used in conjunction with functions like `LookupRows`, `BuildRowsetFromString`, or other functions that return a rowset, to access individual data records within that set. The function returns a single row object, which can then be further processed using the `Field` function to extract specific column values.

### Arguments

| Ordinal | Type    | Required | Description                                                    |
|---------|---------|----------|----------------------------------------------------------------|
| 1       | Rowset  | Yes      | The rowset or array from which to retrieve a row.              |
| 2       | Number  | Yes      | The 1-based index of the row to return from the rowset.        |

> NOTE: The `rowPosition` argument is 1-based, meaning the first row in a rowset is at index 1, not 0.

### Example 1: Basic Use

This example demonstrates how to retrieve a single row from a data extension using `LookupRows` and then access a specific field from that row using `Row` and `Field`.

```html
%%[
    /* Define variables */
    VAR @emailAddress, @subscriberKey, @firstName, @lookupRows, @rowCount, @row, @fieldValue

    /* Set the email address to look up */
    SET @emailAddress = "john.doe@example.com"

    /* Look up rows in the 'Subscribers' Data Extension where EmailAddress matches */
    SET @lookupRows = LookupRows("Subscribers", "EmailAddress", @emailAddress)
    SET @rowCount = RowCount(@lookupRows)

    /* Check if any rows were found */
    IF NOT EMPTY(@lookupRows) AND @rowCount > 0 THEN
        /* Get the first row from the rowset */
        SET @row = Row(@lookupRows, 1)

        /* Get the 'FirstName' field value from the retrieved row */
        SET @firstName = Field(@row, "FirstName")

        /* Output the first name */
        Output(Concat("Hello, ", @firstName, "!"))
    ELSE
        /* Handle case where no subscriber is found */
        Output(Concat("No subscriber found with email: ", @emailAddress))
    ENDIF
]%%
```

### Example 2: Advanced Scenario - Iterating Through a Rowset

This example shows how to retrieve multiple rows from a data extension and then iterate through each row to display specific information, demonstrating defensive coding practices.

```html
%%[
    /* Define variables */
    VAR @orderID, @orderItems, @itemCount, @i, @itemRow, @productName, @quantity, @price

    /* Set the Order ID to look up */
    SET @orderID = "ORD12345"

    /* Look up all items for a specific order from 'Order_Items' Data Extension */
    SET @orderItems = LookupRows("Order_Items", "OrderID", @orderID)
    SET @itemCount = RowCount(@orderItems)

    /* Check if any order items were found */
    IF NOT EMPTY(@orderItems) AND @itemCount > 0 THEN
        Output(Concat("<h2>Order Details for Order ID: ", @orderID, "</h2>"))
        Output("<ul>")

        /* Loop through each item in the rowset */
        FOR @i = 1 TO @itemCount DO
            /* Get the current row */
            SET @itemRow = Row(@orderItems, @i)

            /* Extract field values from the current row */
            SET @productName = Field(@itemRow, "ProductName")
            SET @quantity = Field(@itemRow, "Quantity")
            SET @price = Field(@itemRow, "Price")

            /* Output item details, checking for empty values defensively */
            IF NOT EMPTY(@productName) AND NOT EMPTY(@quantity) AND NOT EMPTY(@price) THEN
                Output(Concat("<li>", @productName, " (Quantity: ", @quantity, ", Price: ", @price, ")</li>"))
            ELSE
                Output("<li>Error: Incomplete item data.</li>")
            ENDIF
        NEXT @i
        Output("</ul>")
    ELSE
        /* Handle case where no order items are found */
        Output(Concat("<h3>No items found for Order ID: ", @orderID, "</h3>"))
    ENDIF
]%%
```