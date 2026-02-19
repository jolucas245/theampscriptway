---
title: "InvokeCreate"
---


This function executes the creation of the instantiated [Marketing Cloud API Object](https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/supported_operations_for_objects_and_methods.htm). The function returns a status code, message and an error code.

API error codes are outlined in the [official documentation](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/error_codes.htm).

### Arguments

`InvokeCreate(1,2,3,4)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | API Object | True | The API Object to be created |
| 2 | Variable | True | The AMPscript variable in which the resulting status message is stored |
| 3 | Variable | True | The AMPscript variable in which the resulting error code is stored |
| 4 | API Object | False | The optional [CreateOptions API Object](https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/createoptions.htm) |

### Example

The following example creates a new `DataFolder` object in the specified parent folder. The attributes of the object are specified with the `SetObjectProperty()` function.

```html
%%[

var @df, @parentFolder, @createStatusCode, @createStatusMessage, @createErrorCode
set @df = CreateObject("DataFolder")
SetObjectProperty(@df, "Name", "Test Folder")
SetObjectProperty(@df, "Description", "Test Folder Description")
SetObjectProperty(@df, "CustomerKey", "Test Folder")
SetObjectProperty(@df, "ContentType", "email")
SetObjectProperty(@df, "IsActive", "true")
SetObjectProperty(@df, "IsEditable", "true")
SetObjectProperty(@df, "AllowChildren", "true")

set @parentFolder = CreateObject("DataFolder")
SetObjectProperty(@parentFolder, "ID", "13738") /* CategoryID of "my emails" folder */

SetObjectProperty(@df, "ParentFolder", @parentFolder)

set @createStatusCode = InvokeCreate(@df, @createStatusMessage, @createErrorCode)

]%%
createStatusCode: %%=v(@createStatusCode)=%%
<br>createStatusMessage: %%=v(@createStatusMessage)=%%
<br>createErrorCode: %%=v(@createErrorCode)=%%
```

#### Output

```html
createStatusCode: OK
createStatusMessage: Folder created successfully.
createErrorCode: 0
```

If the `DataFolder` already exists, it will return an error:

```html
createStatusCode: Error
createStatusMessage: ParentFolder ID: "13738" already has a child Folder named "Test Folder". Please select a different Name.
createErrorCode: 396007
```