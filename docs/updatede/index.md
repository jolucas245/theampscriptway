--- 
title: "UpdateDE"
---


The `updatede` function updates a row of data in a data extension. This function does not return any output and is specifically used within the context of an email.

> NOTE: For CloudPages, landing pages, microsites, and SMS messages, use the `UpdateData()` function instead.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | The name of the data extension to update. |
| 2 | Number | True | The number of column-value pairs to use as criteria for finding the correct row to update. |
| 3 | String | True | The name of the column to use for identifying the row to update. |
| 4 | String | True | The value in the column specified in the preceding argument that identifies the row to update. |
| 5 | String | True | The name of the column that contains the data to be updated. |
| 6 | String | True | The new value to be written into the column specified in the preceding argument. |

### Example 1: Basic Use

This example demonstrates how to update a single field in a data extension named `Subscribers`. We want to update the `Status` of a subscriber with the `SubscriberKey` of `12345` to `Unsubscribed`.

```html
%%[

/* Set the SubscriberKey of the record to update */
SET @subscriberKey = "12345"

/* Check if the SubscriberKey is not empty before proceeding */
IF NOT EMPTY(@subscriberKey) THEN

  /* Update the 'Status' field to 'Unsubscribed' for the matching SubscriberKey */
  updatede("Subscribers", 1, "SubscriberKey", @subscriberKey, "Status", "Unsubscribed")

ENDIF

]%%
```

### Example 2: Advanced Scenario

In this scenario, we'll update multiple fields for a product in the `Products` data extension. We need to update the `Price` and `StockLevel` for the product with the `SKU` of `SHOE-001`.

```html
%%[

/* Define the SKU and the new values for Price and Stock Level */
SET @sku = "SHOE-001"
SET @newPrice = 79.99
SET @newStock = 50

/* Ensure the SKU is not empty before attempting the update */
IF NOT EMPTY(@sku) THEN

  /* Update the 'Price' and 'StockLevel' for the product with the specified SKU */
  updatede("Products", 1, "SKU", @sku, "Price", @newPrice, "StockLevel", @newStock)

ENDIF

]%%
```