---
title: "DeleteDE"
---


The `DeleteDE()` function is used to delete rows from a specified data extension within an email context. This function does not return any output upon execution. It allows for the deletion of single or multiple rows based on one or more column name-value pairs.

### Arguments

| Ordinal | Type   | Required | Description                                                                                             |
| :------ | :----- | :------- | :------------------------------------------------------------------------------------------------------ |
| 1       | String | Required | The name of the data extension from which rows will be deleted.                                         |
| 2       | String | Required | The name of the column to use for matching the data to be deleted.                                      |
| 3       | String | Required | The value that the function uses to determine which row to delete, corresponding to `columnName1`.      |
| 4+      | String | Optional | Additional column name-value pairs (`columnNameN`, `valueToDeleteN`) to refine the deletion criteria. |

> NOTE: This function is specifically designed for use within **emails**. For deleting rows in CloudPages, landing pages, microsites, or SMS messages in MobileConnect, use the `DeleteData()` function instead.

### Example 1: Basic Use

This example demonstrates how to delete a single row from a data extension named `Subscribers` where the `EmailAddress` column matches a specific value.

```html
%%[
    /* Define variables for the data extension name and deletion criteria */
    VAR @deName, @columnName, @valueToDelete
    SET @deName = "Subscribers"
    SET @columnName = "EmailAddress"
    SET @valueToDelete = "test@example.com"

    /* Check if the data extension name and deletion criteria are not empty */
    IF NOT EMPTY(@deName) AND NOT EMPTY(@columnName) AND NOT EMPTY(@valueToDelete) THEN
        /* Attempt to delete the row from the data extension */
        DeleteDE(@deName, @columnName, @valueToDelete)

        /* Output a success message */
        Output(Concat("Row with EmailAddress '", @valueToDelete, "' deleted from ", @deName, "."))
    ELSE
        /* Output an error message if criteria are missing */
        Output(Concat("Error: Missing Data Extension name or deletion criteria."))
    ENDIF
]%%
```

### Example 2: Advanced Scenario with Multiple Criteria

This example shows how to delete rows from a `ProductOrders` data extension based on multiple criteria: `OrderID` and `OrderStatus`. This ensures that only specific orders with a particular status are removed.

```html
%%[
    /* Define variables for the data extension name and multiple deletion criteria */
    VAR @deName, @orderIDColumn, @orderIDValue, @statusColumn, @statusValue
    SET @deName = "ProductOrders"
    SET @orderIDColumn = "OrderID"
    SET @orderIDValue = "12345"
    SET @statusColumn = "OrderStatus"
    SET @statusValue = "Cancelled"

    /* Check if all necessary criteria are provided */
    IF NOT EMPTY(@deName) AND NOT EMPTY(@orderIDColumn) AND NOT EMPTY(@orderIDValue) AND NOT EMPTY(@statusColumn) AND NOT EMPTY(@statusValue) THEN
        /* Attempt to delete rows matching both OrderID and OrderStatus */
        DeleteDE(@deName, @orderIDColumn, @orderIDValue, @statusColumn, @statusValue)

        /* Output a success message */
        Output(Concat("Rows with OrderID '", @orderIDValue, "' and OrderStatus '", @statusValue, "' deleted from ", @deName, "."))
    ELSE
        /* Output an error message if any criteria are missing */
        Output(Concat("Error: Missing Data Extension name or deletion criteria for advanced scenario."))
    ENDIF
]%%
```