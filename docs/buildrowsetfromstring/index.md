---
title: "BuildRowsetFromString"
---


The `buildrowsetfromstring` function parses a string of delimited data into a rowset. This is particularly useful for handling data stored in a single string, allowing it to be iterated over as if it were a data extension.

### Arguments

| Ordinal | Type   | Required | Description                                      |
| :------ | :----- | :------- | :----------------------------------------------- |
| 1       | String | Yes      | The delimited string to be converted to a rowset. |
| 2       | String | Yes      | The delimiter character separating the values.   |

> NOTE: This function is available in emails, landing pages, and other Marketing Cloud content. It is a fundamental function for data manipulation in AMPscript.

### Example 1: Basic Use

This example demonstrates how to parse a simple pipe-delimited string into a rowset and display each value.

```html
%%[

/* --- Variable Declaration --- */
var @myString, @rows, @rowCount, @i, @row, @value

/* --- Initialization --- */
set @myString = "Apple|Banana|Orange"

/* --- Processing --- */
if not empty(@myString) then

  set @rows = buildrowsetfromstring(@myString, "|")
  set @rowCount = rowcount(@rows)

  if @rowCount > 0 then

    for @i = 1 to @rowCount do

      set @row = row(@rows, @i)
      set @value = field(@row, 1)

      ]%%=
      Value %%=v(@i)=%%: %%=v(@value)=%%<br>
      %%=[

    next @i

  else

    /* No rows found in the string */
    output(concat("No values found in the string."))

  endif

else

  /* The initial string is empty */
  output(concat("The source string is empty."))

endif

]%%
```

### Example 2: Advanced Scenario with CSV data

This example shows how to handle a string with multiple columns of data, similar to a CSV file. Each row is separated by a newline character, and each field within the row is separated by a comma.

```html
%%[

/* --- Variable Declaration --- */
var @csvString, @rows, @rowCount, @i, @row, @cols, @colCount, @j, @col, @product, @price

/* --- Initialization --- */
set @csvString = "T-Shirt,15.99\nJeans,45.50\nShoes,89.95"

/* --- Processing --- */
if not empty(@csvString) then

  set @rows = buildrowsetfromstring(@csvString, "\n")
  set @rowCount = rowcount(@rows)

  if @rowCount > 0 then

    for @i = 1 to @rowCount do

      set @row = row(@rows, @i)
      set @cols = buildrowsetfromstring(field(@row, 1), ",")
      set @colCount = rowcount(@cols)

      if @colCount == 2 then

        set @product = field(row(@cols, 1), 1)
        set @price = field(row(@cols, 2), 1)

        ]%%=
        Product: %%=v(@product)=%%, Price: %%=v(@price)=%%<br>
        %%=[

      endif

    next @i

  else

    /* No rows found in the string */
    output(concat("No data found in the CSV string."))

  endif

else

  /* The initial string is empty */
  output(concat("The source CSV string is empty."))

endif

]%%
```
