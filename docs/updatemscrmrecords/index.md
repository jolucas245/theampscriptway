---
title: "UpdateMscrmRecords"
---


This function updates one of more records in the specified Microsoft Dynamics CRM entity. It returns the number of records updated.

### Arguments

`UpdateMSCRMRecords(1,2,3,4)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | Name of the entity for records |
| 2 | String | True | Comma-separated list of record GUIDs to update |
| 3 | String | True | Name of attribute to update |
| 4 | String | True | Value of attribute to update |

> NOTE: Additional pairs of columns and values can be appended as arguments.

### Example

```html
%%[
var @updateCount
var @entity
var @GUIDs
var @attribute
var @attributeValue

set @entity = "Contact"
set @GUIDs = "97459725-9592-4f6d-a92b-5aee4ddd5f2d,920ee53d-a95c-4c89-b94f-6fcb7c865720"
set @attribute = "creditonhold"
set @attributeValue = "1"

set @updateCount = UpdateMSCRMRecords(@entity, @GUIDs, @attribute, @attributeValue)

]%%
updateCount: %%=v(@updateCount)=%%
```

#### Output

```html
updateCount: 2
```