---
title: "UpsertData"
---


Updates data in a data extension if matching columns and values are found, and inserts rows if no matches are found. This function returns the number of rows updated or inserted.

> NOTE: This function is for use in landing pages, microsites, and SMS messages in MobileConnect. For email, use the `UpsertDE()` function.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | The name of the data extension to update or insert into. |
| 2 | Number | True | The number of column and value pairs to match against. |
| 3 | String | True | The name of the column to search for the data you want to update or insert. |
| 4 | String | True | The value that the function uses to determine which row to update or insert. You can specify multiple column and value pairs to match against. |
| 5 | String | True | The column to update or insert data into. |
| 6 | String | True | The value to update or insert into the specified column. You can specify multiple column and value pairs to upsert. |

### Example 1: Basic Use

This example updates a 'Subscribers' Data Extension. It finds a subscriber by their 'Email' and updates their 'FirstName' and 'LastName'.

```html
%%[

/* Set subscriber information */
var @email, @firstName, @lastName
set @email = "[email@example.com](mailto:email@example.com)"
set @firstName = "John"
set @lastName = "Doe"

/* Check if the email is not empty before upserting */
if not empty(@email) then

  /* Upsert the data into the 'Subscribers' Data Extension. */
  /* We are matching on one column ('Email') and updating two columns ('FirstName', 'LastName'). */
  UpsertData("Subscribers", 1, "Email", @email, "FirstName", @firstName, "LastName", @lastName)

endif

]%%
```

### Example 2: Advanced Scenario

This example demonstrates updating a 'ProductInventory' Data Extension. It uses two columns ('ProductID' and 'StoreId') to identify the record and then updates the 'StockLevel'.

```html
%%[

/* Set product and store information */
var @productID, @storeId, @stockLevel
set @productID = "PROD123"
set @storeId = "STORE456"
set @stockLevel = 100

/* Check if the productID and storeId are not empty before upserting */
if not empty(@productID) and not empty(@storeId) then

  /* Upsert the data into the 'ProductInventory' Data Extension. */
  /* We are matching on two columns ('ProductID', 'StoreId') and updating one column ('StockLevel'). */
  UpsertData("ProductInventory", 2, "ProductID", @productID, "StoreId", @storeId, "StockLevel", @stockLevel)

endif

]%%
```