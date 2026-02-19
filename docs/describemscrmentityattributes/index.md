---
title: "DescribeMscrmEntityAttributes"
---


This function returns the logical name, display name and type of the specified Microsoft Dynamics CRM entity. If the attribute is Boolean, status, a picklist or a state, the function returns a comma-separated list of option and display values.

### Argument

`DescribeMSCRMEntityAttributes(1)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | The entity from which to retrieve attributes |

### Example

```html
%%[

var @i
var @attributes
var @rowcount

set @attributes = DescribeMSCRMEntityAttributes("Lead")
set @rowCount = rowcount(@attributes)

for @i = 1 to @rowCount do

  var @attribute
  var @attributeName
  var @attributeDisplayName
  var @attributeType
  var @attributeRequired
  var @attributeOptions

  set @attribute = row(@attributes,@i)
  set @attributeName = field(@attribute, 'Name')
  set @attributeDisplayName = field(@attribute, 'DisplayName')

  set @Name = field(@attribute, "Name")
  set @DisplayName = field(@attribute, "DisplayName")
  set @Type = field(@attribute, "Type")
  set @Required = field(@attribute, "Required")
  set @Options = field(@attribute, "Options")

  output(concat("<br><br>Name: ", @Name))
  output(concat("<br>DisplayName: ", @DisplayName))
  output(concat("<br>Type: ", @Type))
  output(concat("<br>Required: ", @Required))
  output(concat("<br>Options: ", @Options))

next @i

]%%
```

#### Output

```html
Name: address1_addressid
DisplayName: Address 1: ID
Type: Guid
Required: False
Options:

Name: address1_addresstypecode
DisplayName: Address 1: Address Type
Type: Int32
Required: False
Options: Default Value

Name: address1_city
DisplayName: City
Type: String
Required: False
Options:

...
```