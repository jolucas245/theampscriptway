---
title: "InvokeDelete"
---


This function executes the deletion of the instantiated [Marketing Cloud API Object](https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/supported_operations_for_objects_and_methods.htm). In order to delete an object, you must specify a `ID`, `ObjectID` or `CustomerKey` property for the object. API error codes are outlined in the [official documentation](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/error_codes.htm).

### Arguments

`InvokeDelete(1,2,3,4)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | API Object | True | The API Object to be deleted |
| 2 | Variable | True | The AMPscript variable in which the resulting status message is stored |
| 3 | Variable | True | The AMPscript variable in which the resulting error code is stored |
| 4 | API Object | False | The optional [DeleteOptions API Object](https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/deleteoptions.htm) |

### Example

The following example deletes an existing `DataFolder` object. The `CustomerKey` property indicates the `DataFolder` to delete. It returns a status code, message and an error code.

```html
%%[

var @df, @deleteStatusCode, @deleteStatusMessage, @deleteErrorCode
set @df = CreateObject("DataFolder")
SetObjectProperty(@df, "CustomerKey", "Test Folder")

set @deleteStatusCode = InvokeDelete(@df, @deleteStatusMessage, @deleteErrorCode)

]%%
deleteStatusCode: %%=v(@deleteStatusCode)=%%
<br>deleteStatusMessage: %%=v(@deleteStatusMessage)=%%
<br>deleteErrorCode: %%=v(@deleteErrorCode)=%%
```

#### Output

```html
deleteStatusCode: OK
deleteStatusMessage: Folder deleted successfully.
deleteErrorCode: 0
```

If the `DataFolder` is not found, it will return an error:

```html
deleteStatusCode: Error
deleteStatusMessage: Folder with CustomerKey: "Test Folder " could not be found.
deleteErrorCode: 396009
```