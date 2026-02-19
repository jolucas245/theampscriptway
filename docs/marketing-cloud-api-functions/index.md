---
title: "Marketing Cloud Api Functions"
---


Marketing Cloud API functions allow AMPscript to interact with the Marketing Cloud SOAP API objects. These functions enable you to create, update, delete, and retrieve Marketing Cloud objects programmatically from within CloudPages, landing pages, and microsites.

### Available Functions

| Function | Description |
| --- | --- |
| [AddObjectArrayItem](/addobjectarrayitem) | Adds an item to an API object array. |
| [CreateObject](/createobject) | Creates an instance of a Marketing Cloud API object. |
| [InvokeCreate](/invokecreate) | Invokes the Create method on an API object. |
| [InvokeDelete](/invokedelete) | Invokes the Delete method on an API object. |
| [InvokeExecute](/invokeexecute) | Invokes the Execute method on an API object. |
| [InvokePerform](/invokeperform) | Invokes the Perform method on an API object. |
| [InvokeRetrieve](/invokeretrieve) | Invokes the Retrieve method on an API object. |
| [InvokeUpdate](/invokeupdate) | Invokes the Update method on an API object. |
| [RaiseError](/raiseerror) | Raises a custom error, optionally skipping the subscriber or halting the send. |
| [SetObjectProperty](/setobjectproperty) | Sets a property value on an API object. |
| [UpsertContact](/upsertcontact) | Upserts a contact record in Marketing Cloud. |

> NOTE: Most Marketing Cloud API functions do not work in emails at the time of send. They are designed for use on CloudPages, landing pages, and microsites where server-side processing is available. The `RaiseError()` function is an exception, as it can be used in emails to skip subscribers or halt sends.

### Typical Workflow

The typical pattern for using API functions involves creating an object, setting its properties, then invoking an action:

```html
%%[
/* 1. Create the API object */
SET @de = CreateObject("DataExtension")

/* 2. Set properties on the object */
SetObjectProperty(@de, "Name", "MyNewDE")
SetObjectProperty(@de, "CustomerKey", "my-new-de-key")

/* 3. Create fields array */
SET @fields = CreateObject("DataExtensionField")
SetObjectProperty(@fields, "Name", "EmailAddress")
SetObjectProperty(@fields, "FieldType", "EmailAddress")
SetObjectProperty(@fields, "IsPrimaryKey", "true")
SetObjectProperty(@fields, "IsRequired", "true")
AddObjectArrayItem(@de, "Fields", @fields)

/* 4. Invoke the create method */
SET @status = InvokeCreate(@de, @createStatusMsg, @createErrorCode)
]%%
```
