---
title: "LookupOrderedRowsCS"
---


The `lookuporderedrowscs` function returns a specified number of rows from a data extension, sorted according to a specified column and order, based on a case-sensitive match of a value in a specified column.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | Yes | The name of the data extension to retrieve data from. |
| 2 | Number | Yes | The number of rows to return. Use 0 to return all matching rows, up to a maximum of 2000. |
| 3 | String | Yes | The column to sort the data by, followed by a space and either `ASC` (ascending) or `DESC` (descending). Multiple sort columns can be specified in a comma-separated string. |
| 4 | String | Yes | The column to search for a matching value. |
| 5 | String | Yes | The value to match in the search column. |
| 6+ | String | No | Additional pairs of search columns and values can be appended. |

> NOTE: This function is case-sensitive. For a case-insensitive version, use `lookuporderedrows`.

### Example 1: Basic Use

This example retrieves the 5 most recently published articles from a 'Content' data extension, where 'Category' is 'News'.

```html
%%[

/* Set the category to search for */
var @category
set @category = "News"

/* Retrieve the 5 most recent articles in the 'News' category */
var @rows
set @rows = lookuporderedrowscs("Content", 5, "PublishedDate DESC", "Category", @category)

/* Check if any rows were returned */
if not empty(@rows) then

  /* Loop through the returned rows and display the article title */
  for @i = 1 to rowcount(@rows) do
    var @row, @title
    set @row = row(@rows, @i)
    set @title = field(@row, "Title")

    output(concat(@i, ". ", @title, "<br>"))

  next @i

else

  /* Output a message if no articles are found */
  output(concat("No articles found in the '", @category, "' category."))

endif

]%%
```

### Example 2: Advanced Scenario

This example retrieves all products from a 'Products' data extension that are in stock and within a specific price range. The results are sorted first by 'Brand' in ascending order and then by 'Price' in descending order.

```html
%%[

/* Set the search criteria */
var @inStock, @minPrice, @maxPrice
set @inStock = "true"
set @minPrice = 50
set @maxPrice = 200

/* Retrieve all products that are in stock and within the price range */
var @rows
set @rows = lookuporderedrowscs("Products", 0, "Brand ASC, Price DESC", "InStock", @inStock, "Price >", @minPrice, "Price <", @maxPrice)

/* Check if any rows were returned */
if not empty(@rows) then

  /* Output the header for the product table */
  output("<table><tr><th>Brand</th><th>Product Name</th><th>Price</th></tr>")

  /* Loop through the returned rows and display the product information */
  for @i = 1 to rowcount(@rows) do
    var @row, @brand, @productName, @price
    set @row = row(@rows, @i)
    set @brand = field(@row, "Brand")
    set @productName = field(@row, "ProductName")
    set @price = field(@row, "Price")

    output(concat("<tr><td>", @brand, "</td><td>", @productName, "</td><td>$", format(@price, "N2"), "</td></tr>"))

  next @i

  /* Close the product table */
  output("</table>")

else

  /* Output a message if no products are found */
  output("No products found matching the criteria.")

endif

]%%
```
