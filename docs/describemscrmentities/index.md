---
title: "DescribeMscrmEntities"
---


This function returns the logical and display names for all available Microsoft Dynamics CRM entities.

### Arguments

`DescribeMSCRMEntities()`

This function does not accept any arguments.

### Example

```html
%%[

var @i
var @entities
var @rowcount

set @entities = DescribeMSCRMEntities()
set @rowCount = rowcount(@entities)

for @i = 1 to @rowCount do

  var @entity
  var @entityName
  var @entityDisplayName

  set @entity = row(@entities,@i)
  set @Name = field(@entity, "Name")
  set @DisplayName = field(@entity, "DisplayName")

  output(concat("<br><br>Name: ", @Name))
  output(concat("<br>DisplayName: ", @DisplayName))

next @i

]%%
```

#### Output

```html
Name: Account
DisplayName: account

Name: Campaign
DisplayName: campaign

Name: Case
DisplayName: case

Name: Contact
DisplayName: contact

Name: Lead
DisplayName: lead

Name: Opportunity
DisplayName: opportunity
...
```