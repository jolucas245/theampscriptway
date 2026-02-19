---
title: "DataExtensionRowCount"
---


Returns the number of rows in a specified data extension. This function is useful for checking the size of a data extension or for conditional logic based on the number of records it contains.

### Arguments

| Ordinal | Type   | Required | Description                                    |
|---------|--------|----------|------------------------------------------------|
| 1       | String | Yes      | The name of the data extension to count rows from. |

### Example 1: Basic Use

This example demonstrates how to retrieve and display the total number of rows in a data extension named "Subscribers".

```html
%%[VAR @deName, @rowCount]

/* Define the name of the Data Extension */
SET @deName = "Subscribers"

/* Check if the Data Extension name is not empty before proceeding */
IF NOT EMPTY(@deName) THEN
    /* Retrieve the row count for the specified Data Extension */
    SET @rowCount = DataExtensionRowCount(@deName)

    /* Check if the row count is not empty/null before displaying */
    IF NOT EMPTY(@rowCount) THEN
        /* Display the row count */
        Output(Concat("The Data Extension '", @deName, "' has ", @rowCount, " rows."))
    ELSE
        /* Handle cases where row count could not be retrieved */
        Output(Concat("Could not retrieve row count for Data Extension '", @deName, "'."))
    ENDIF
ELSE
    /* Handle cases where Data Extension name is empty */
    Output("Data Extension name cannot be empty.")
ENDIF
```

### Example 2: Conditional Logic Based on Row Count

This example shows how to use `DataExtensionRowCount` to implement conditional logic, such as sending a personalized message only if a certain number of records exist in a promotional data extension.

```html
%%[VAR @promoDEName, @promoRowCount]

/* Define the name of the promotional Data Extension */
SET @promoDEName = "PromotionalOffers"

/* Check if the Data Extension name is not empty */
IF NOT EMPTY(@promoDEName) THEN
    /* Get the row count of the promotional Data Extension */
    SET @promoRowCount = DataExtensionRowCount(@promoDEName)

    /* Check if the row count is not empty/null and greater than 0 */
    IF NOT EMPTY(@promoRowCount) AND @promoRowCount > 0 THEN
        /* If there are promotional offers, display a message */
        Output(Concat("Great news! We have ", @promoRowCount, " special offers for you today!"))
        /* Further logic to retrieve and display offers would go here */
    ELSE
        /* If no promotional offers are available */
        Output("Currently, there are no special offers available.")
    ENDIF
ELSE
    /* Handle cases where promotional Data Extension name is empty */
    Output("Promotional Data Extension name cannot be empty.")
ENDIF
```