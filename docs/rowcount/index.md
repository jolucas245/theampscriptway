---
title: "RowCount"
---


The `RowCount` function returns the total number of rows within a specified rowset or array. This is particularly useful for determining the size of data retrieved from Data Extensions or other data sources before iterating through the rows or performing conditional logic based on the number of results.

### Arguments

| Ordinal | Type   | Required | Description                                     |
|---------|--------|----------|-------------------------------------------------|
| 1       | Rowset | Yes      | The rowset or array for which to count the rows.|

> NOTE: When using `RowCount` with `LookupRows`, be aware that `LookupRows` has a default limit of 2,000 rows. If you need to count more than 2,000 rows from a Data Extension, consider using `DataExtensionRowCount()` for the total count of a Data Extension, or `LookupOrderedRows()` with a sufficiently large row limit to ensure all matching rows are retrieved before counting.

### Example 1: Basic Use with LookupRows

This example demonstrates how to retrieve a rowset from a Data Extension based on a specific criterion and then use `RowCount` to determine the number of matching rows. The code includes defensive checks to ensure the rowset is not empty before proceeding.

```html
%%[
VAR @city, @rows, @rowCount

SET @city = "Indianapolis"
SET @rows = LookupRows('PostalCode','City', @city)
SET @rowCount = IIF(NOT EMPTY(@rows), RowCount(@rows), 0)

/* Check if any rows were found */
if @rowCount > 0 THEN
    /* Output the number of rows found */
    Output(Concat("Number of records for ", @city, ": ", @rowCount))
ELSE
    /* Handle cases where no rows are found */
    Output(Concat("No records found for ", @city))
ENDIF
]%%
```

### Example 2: Counting with LookupOrderedRows for Larger Datasets

This example illustrates using `RowCount` with `LookupOrderedRows` to count a potentially larger number of records, bypassing the 2,000-row limit of `LookupRows`. A large number (e.g., 50000) is specified for the row limit in `LookupOrderedRows` to ensure all relevant records are considered for the count.

```html
%%[
VAR @productCategory, @maxRows, @orderedRows, @orderedRowCount

SET @productCategory = "Electronics"
/* Set a sufficiently large number for max rows to ensure all matching records are retrieved */
SET @maxRows = 50000 

/* Retrieve ordered rows based on a category */
SET @orderedRows = LookupOrderedRows('Products', @maxRows, 'ProductName ASC', 'Category', @productCategory)
SET @orderedRowCount = IIF(NOT EMPTY(@orderedRows), RowCount(@orderedRows), 0)

/* Check if any rows were found */
if @orderedRowCount > 0 THEN
    /* Output the number of products in the category */
    Output(Concat("Total products in ", @productCategory, " category: ", @orderedRowCount))
ELSE
    /* Handle cases where no products are found */
    Output(Concat("No products found in ", @productCategory, " category."))
ENDIF
]%%
```