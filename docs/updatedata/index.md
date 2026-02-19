--- 
title: "UpdateData"
---


The `updatedata` function updates one or more rows in a Data Extension. It returns the number of rows affected. This function is available for use in CloudPages, landing pages, microsites, and SMS messages.

> NOTE: For email sends, use the `UpdateDE()` function instead.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | The name of the target Data Extension. |
| 2 | Number | True | The number of column-value pairs to use as filters to identify the rows to update. |
| 3 | String | True | The name of the column to use for the first filter criterion. |
| 4 | String | True | The value to match in the column specified in the preceding argument. |
| 5+ | String | True | Subsequent pairs of column names and values to identify the rows to update. |
| 6+ | String | True | The name of the column to update. |
| 7+ | String | True | The new value for the column specified in the preceding argument. |

### Example 1: Basic Use

This example updates the `Status` of a subscriber in the `Subscribers` Data Extension. We identify the subscriber by their `EmailAddress`.

```html
%%[

/* Set variables for the subscriber's email and new status */
VAR @email, @status
SET @email = "subscriber@example.com"
SET @status = "Inactive"

/* Check if the email address is not empty before proceeding */
IF NOT EMPTY(@email) THEN

  /* Update the 'Status' field in the 'Subscribers' Data Extension 
     where the 'EmailAddress' matches the provided email. */
  UpdateData("Subscribers", 1, "EmailAddress", @email, "Status", @status)

ENDIF

]%%
```

### Example 2: Advanced Scenario

This example demonstrates updating multiple fields for a product in the `Products` Data Extension. The product is identified by its `SKU`.

```html
%%[

/* Define variables for product identification and new values */
VAR @sku, @newPrice, @newStockLevel
SET @sku = "ABC-123"
SET @newPrice = 79.99
SET @newStockLevel = 50

/* Ensure the SKU is not empty before attempting the update */
IF NOT EMPTY(@sku) THEN

  /* Update the 'Price' and 'StockLevel' fields for the product with the matching 'SKU'. */
  UpdateData("Products", 1, "SKU", @sku, "Price", @newPrice, "StockLevel", @newStockLevel)

ENDIF

]%%
```