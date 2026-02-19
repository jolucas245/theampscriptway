---
title: "InvokePerform"
---


This function performs the instantiated [Marketing Cloud API Object](https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/supported_operations_for_objects_and_methods.htm). It returns a status code value and a status message.

> NOTE: Only certain API Objects can be performed. Current objects are listed in documentation for the [Perform API Method](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/perform.htm).

### Arguments

`InvokePerform(1,2,3)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | API Object | True | The API Object to be performed |
| 2 | String | True | The action to perform on the object. Must be a valid action for the [object](https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/perform.htm) specified in the first argument. |
| 3 | Variable | False | The AMPscript variable in which the resulting status message is stored |

### Example

The following example retrieves the `ObjectID` of a `QueryDefinition` and then performs it.

```html
%%[

var @rr, @objectID, @queryDefinitions
set @rr = CreateObject("RetrieveRequest")
SetObjectProperty(@rr, "ObjectType", "QueryDefinition")
AddObjectArrayItem(@rr, "Properties", "ObjectID")

set @sfp = CreateObject("SimpleFilterPart")
SetObjectProperty(@sfp, "Property", "CustomerKey")
SetObjectProperty(@sfp, "SimpleOperator", "equals")
AddObjectArrayItem(@sfp, "Value", "LoyaltyMembers")

SetObjectProperty(@rr,"Filter", @sfp)

set @queryDefinitions = InvokeRetrieve(@rr, @rrStatus, @rrRequestID)

output(concat("rrStatus: ", @rrStatus))
output(concat("<br>rrRequestID: ", @rrRequestID))

if rowcount(@queryDefinitions) > 0 then

  var @queryDefinition, @ObjectID, @obj

  set @queryDefinition = Row(@queryDefinitions, 1)
  set @ObjectID = Field(@queryDefinition, "ObjectID")

  set @obj = CreateObject("QueryDefinition")

  SetObjectProperty(@obj, "ObjectID", @ObjectID)
  Set @performStatusCode = InvokePerform(@obj, "start", @performStatusMessage)

endif

]%%
<br>queryDefinitions: %%=rowcount(@queryDefinitions)=%%
<br>performStatusCode: %%=v(@performStatusCode)=%%
<br>performStatusMessage: %%=v(@performStatusMessage)=%%
```

#### Output

```html
rrStatus: OK
rrRequestID: 3a78779e-6ed3-44b1-a381-3d5134949445 queryDefinitions: 1
performStatusCode: OK
performStatusMessage: QueryDefinition perform called successfully
```