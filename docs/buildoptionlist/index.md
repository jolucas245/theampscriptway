---
title: "BuildOptionList"
---


This function creates a set of `<option>` HTML elements for use within a `<select>`, `<optgroup>`, or `<datalist>` element in an HTML form.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String or Number | True | The value of the option to be selected by default. |
| 2 | String | True | The value for the first `<option>` tag. |
| 3 | String | True | The display text for the first `<option>` tag. |
| 4+ | String | False | Additional pairs of option values and display text can be appended as arguments. |

> NOTE: This function is intended for use in web pages and landing pages, not directly within an email, as `<select>` elements have limited support in email clients.

### Example 1: Basic Use

This example demonstrates how to create a simple dropdown list of rankings.

```html
%%[

/* Set a default ranking */
VAR @defaultRank
SET @defaultRank = "3"

/* Build the option list */
VAR @optionList
SET @optionList = BuildOptionList(@defaultRank, "1", "Good", "2", "Better", "3", "Best")

]%%

<form>
  <label for="rank">Ranking:</label>
  <select name="rank" id="rank">
    %%=v(@optionList)=%%
  </select>
</form>
```

### Example 2: Advanced Scenario with Data Extension

This example demonstrates how to dynamically build an option list from a Data Extension named "Products".

```html
%%[

/* Assume a subscriber attribute "favorite_product" exists */
VAR @favoriteProduct
SET @favoriteProduct = AttributeValue("favorite_product")

/* If the subscriber has no favorite product, set a default */
IF EMPTY(@favoriteProduct) THEN
  SET @favoriteProduct = "SKU-001"
ENDIF

/* Retrieve product information from a Data Extension */
VAR @products, @product, @optionList, @i
SET @products = LookupRows("Products", "IsActive", "True")

/* Initialize the option list with the default selection */
SET @optionList = BuildOptionList(@favoriteProduct, "", "-- Select a Product --")

/* Loop through the products and append them to the option list */
IF RowCount(@products) > 0 THEN
  FOR @i = 1 TO RowCount(@products) DO
    SET @product = Row(@products, @i)
    SET @optionList = CONCAT(@optionList, BuildOptionList(Field(@product, "SKU"), Field(@product, "ProductName")))
  NEXT @i
ENDIF

]%%

<form>
  <label for="product-select">Choose a product:</label>
  <select name="product-select" id="product-select">
    %%=v(@optionList)=%%
  </select>
</form>
```