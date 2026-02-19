---
title: "CreateMscrmRecord"
---


This function creates a record in the specified Microsoft Dynamics CRM entity. It returns the GUID of the record created.

### Arguments

`CreateMSCRMRecord(1,2,3,4,[5a,5b])`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | Name of the MSCRM entity |
| 2 | String | True | Number of attribute and value pairs in the preceding arguments |
| 3 | String | True | First attribute name for new record |
| 4 | String | True | First attribute value for new record |
| 5a | String | False | Additional attribute name for new record (see note) |
| 5b | String | False | Additional attribute value for new record (see note) |

> NOTE: Additional pairs of attributes and values corresponding to the count in the second ordinal can be appended as arguments.

### Example

```html
%%[

var @firstName
var @lastName
var @emailAddress
var @contact_GUID

set @firstName = AttributeValue("firstName") /* value from attribute or DE column in send context */
set @firstName = "Lily" /* or a literal value */

set @lastName = AttributeValue("lastName") /* value from attribute or DE column in send context */
set @lastName = "Baker" /* or a literal value */

set @emailAddress = AttributeValue("emailaddr") /* value from attribute or DE column in send context */
set @emailAddress = "lily@limedash.com" /* or a literal value */

set @contact_GUID = CreateMSCRMRecord("Contact", 3, "firstname", @firstName, "lastname", @lastName, "emailaddress", @emailAddress)

]%%
contact_GUID: %%=v(@contact_GUID)=%%
```

#### Output

```html
contact_GUID: a16d424b-9f68-4297-ab4c-640c48431eaf
```