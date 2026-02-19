--- 
title: "LookupRows"
---


The `lookuprows` function retrieves a rowset of data from a specified data extension based on a matching value in a specified column. This function is case-insensitive and can return a maximum of 2,000 rows.

### Arguments

| Ordinal | Type | Required | Description |
|---|---|---|---|
| 1 | String | Yes | The name of the data extension to look up rows from. |
| 2 | String | Yes | The name of the column to use for matching. |
| 3 | String | Yes | The value to match in the specified column. |
| 4+ | String | No | Additional pairs of column names and values for more specific matching. |

> NOTE: This function only works in emails and landing pages.

### Example 1: Basic Use

This example demonstrates how to retrieve all rows from a data extension where the `Area` is 'Chelsea'.

```html
%%[

/* Look up all members in the 'Chelsea' area */
var @rows, @rowCount, @i
set @rows = LookupRows("MembershipRewardsProgramme", "Area", "Chelsea")
set @rowCount = rowcount(@rows)

if @rowCount > 0 then

  /* Iterate through the rowset and display member information */
  for @i = 1 to @rowCount do

    var @row, @firstName, @surname
    set @row = row(@rows, @i)
    set @firstName = field(@row, "FirstName")
    set @surname = field(@row, "Surname")

]%%

<p>Member: %%=v(@firstName)=%% %%=v(@surname)=%%</p>

%%[

  next @i

endif

]%%
```

### Example 2: Advanced Scenario

This example demonstrates how to retrieve all rows from a data extension where the `PLAN_TYPE` is 'Type 1' and the `CUSTOMER_TYPE` is 'Active'.

```html
%%[

/* Look up all active members with a 'Type 1' plan */
var @rows, @rowCount, @i
set @rows = LookupRows("My_DE", "PLAN_TYPE", "Type 1", "CUSTOMER_TYPE", "Active")
set @rowCount = rowcount(@rows)

if @rowCount > 0 then

  /* Iterate through the rowset and display member information */
  for @i = 1 to @rowCount do

    var @row, @memberName, @memberNumber
    set @row = row(@rows, @i)
    set @memberName = field(@row, "MEMBER_NAME")
    set @memberNumber = field(@row, "MEMBER_NUMBER")

]%%

<p>Member Name: %%=v(@memberName)=%%, Member Number: %%=v(@memberNumber)=%%</p>

%%[

  next @i

endif

]%%
```
