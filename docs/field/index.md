--- 
title: "Field"
---


The `field` function returns a specific field from a data row.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | Yes | The row object that contains the field that you want to return. |
| 2 | String | Yes | The name of the field to return from the row. |
| 3 | Boolean | No | If `true`, the function returns an exception if the specified field doesn’t exist. If `false`, the function returns an empty string if the field doesn’t exist. The default value is `true`. |

> NOTE: This function is often used with the `Row()` function to access data from a specific row within a rowset.

### Example 1: Basic Use

This example demonstrates how to retrieve a field from the first row of a rowset.

```html
%%[

/* Assume @rowset is populated from a LookupRows() call */
var @rowset, @row, @field
set @rowset = LookupRows("Orders","OrderID", "12345")

if not empty(@rowset) then
  set @row = Row(@rowset, 1)
  set @field = Field(@row, "ProductName")
else
  set @field = "Product Not Found"
endif

]%%

Product Name: %%=v(@field)=%%
```

### Example 2: Advanced Scenario

This example shows how to loop through a rowset and retrieve a field from each row.

```html
%%[

var @rowset, @i, @rowCount, @row, @field
set @rowset = LookupRows("OrderItems","OrderID", "12345")
set @rowCount = RowCount(@rowset)

if @rowCount > 0 then
  for @i = 1 to @rowCount do
    set @row = Row(@rowset, @i)
    set @field = Field(@row, "SKU")

    /* Output the SKU for each order item */
    output(concat("SKU: ", @field, "<br>"))

  next @i
else
  outputline(concat("No order items found."))
endif

]%%
```