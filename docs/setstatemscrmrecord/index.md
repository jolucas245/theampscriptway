---
title: "SetStateMscrmRecord"
---


This function sets the state and status of the specified Microsoft Dynamics CRM entity. It does not return a value.

### Arguments

`SetStateMSCRMRecord(1,2,3,4)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | GUID of the record for which the state and status will be set |
| 2 | String | True | Name of the entity for record |
| 3 | String | True | State value to use. Valid values include `Active` and `Inactive`. |
| 4 | String | True | Status value to use. Valid values include `0`, `1` and `-1`. The value of `-1` resets to the default value. |

### Example

```html
%%[

var @GUID
var @entity
var @status
var @state

set @GUID = "84dfdf51-4741-4e15-92b9-67cc595c22b7"
set @entity = "Contact"
set @status = "Invactive"
set @state = "0"

SetStateMscrmRecord(@GUID, @entity, @status, @state)

]%%
```