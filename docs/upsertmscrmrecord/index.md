---
title: "UpsertMscrmRecord"
---


This function retrieves a record from Microsoft Dynamics CRM, using the name and value pairs to filter the results. The results are then sorted using the sort field and order specified. Records are updated with the name and value pairs from the eighth and ninth arguments. If the function does not return a record, it creates one with all provided name and value pairs. It returns the GUID of the updated or created record.

### Arguments

`UpsertMSCRMRecord(1,2,3,4,5,6,7,8,9)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | Entity to upsert |
| 2 | String | True | Field used to sort the rows returned |
| 3 | String | True | Order of rows returned. Valid values include `ASC` and `DESC`. |
| 4 | String | True | Number of attribute and value pairs in the preceding fields used to filter |
| 5 | String | True | Name of attribute to filter |
| 6 | String | True | Value of attribute to filter |
| 7 | String | True | Number of attribute and value pairs in the preceding fields used to update |
| 8 | String | True | Name of attribute to update |
| 9 | String | True | Value of attribute to update |

### Example

```html
%%[

var @entity
var @sortAttribute
var @filterAttribute
var @filterValue
var @updateAttribute
var @updateValue
var @updated

set @entity = "Contact"
set @sortAttribute = "CreatedOn"
set @filterAttribute = "jobTitle"
set @filterValue = "Manager"
set @updateAttribute = "creditLimit"
set @updateValue = "5000.00"

set @updated  = UpsertMSCRMRecord(@entity, @sortAttribute, "DESC", 1, @filterAttribute, @filterValue, 1, @updateAttribute, @updateValue)

]%%
updated: %%=v(@updated)=%%
```

#### Output

```html
updated: 3ee54c53-8b5c-4ed3-ba62-4c869b5d9fcb
```