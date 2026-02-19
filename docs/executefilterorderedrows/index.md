---
title: "ExecuteFilterOrderedRows"
---


This function executes the specified Data Extension Data Filter and returns a row set with the specified number of rows. Rows are returned sorted by the columns specified in the third parameter.

### Arguments

`ExecuteFilterOrderedRows(1,2,3)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | Customer/External Key of the Data Filter to execute |
| 2 | Number | True | Number of rows to return. A value of 0 returns all rows. No maximum limit on rows returned. |
| 3 | String | True | Name of column used to sort resulting row set. Add a `ASC` or `DESC` suffix to specify the sort order. `ASC` is the default. Specify multiple sort columns by separating them with a comma. |

> NOTE: This function only works in a landing page, microsite page or CloudPage, or in an SMS message in MobileConnect.
>
> NOTE: This function will not work on Profile Attribute Data Filters.

### Example

```html
%%[

var @rows, @row, @rowCount, @numRowsToReturn, @i

set @numRowsToReturn = 2 /* 0 means return all rows, no limit */
set @rows = ExecuteFilterOrderedRows("DataExtension_Test_Example_Emails",@numRowsToReturn,"emailAddress desc")
set @rowCount = rowcount(@rows)

if @rowCount > 0 then

  output(concat("rowCount: ", @rowCount))

  for @i = 1 to @rowCount do

    var @emailAddress
    set @row = row(@rows, @i) /* get row based on counter */
    set @emailAddress = field(@row,"emailAddress")

    ]%%

    <br>Row %%=v(@i)=%%, emailAddress is %%=v(@emailAddress)=%%

    %%[

  next @i ]%%

%%[ else ]%%

No rows found

%%[ endif ]%%
```

#### Output

```html
rowCount: 2
Row 1, emailAddress is dale@limedash.com
Row 2, emailAddress is suzy@limedash.com
```