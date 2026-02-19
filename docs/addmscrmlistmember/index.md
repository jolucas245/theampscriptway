---
title: "AddMscrmListMember"
---


This function adds a member to the specified Microsoft Dynamics CRM list. It does not return a value.

### Arguments

`AddMSCRMListMember(1,2)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | The GUID of the member to add |
| 2 | String | True | The GUID of the list receiving the member |

### Example

```html
%%[

var @member
var @list

set @member = "43b4a7c9-7360-4753-955f-738bd89934b5"
set @list = "fdc5dfe4-e5e1-48af-87a1-4ac10433e895"

AddMscrmListMember(@member, @list)

]%%
```