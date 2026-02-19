--- 
title: "InvokeUpdate"
---


The `invokeupdate` function invokes the Update method on an API object.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | API object | True | The API object to update. |
| 2 | AMPscript variable | False | An AMPscript variable that stores the API status message. |
| 3 | AMPscript variable | False | An AMPscript variable that stores the response error code (if one occurs). |
| 4 | API object | False | An `UpdateOptions` API object. |

> NOTE: This function is only available in landing pages, and SMS messages. It is not supported in emails.

### Example 1: Basic Use

This example updates a subscriber's first name. It assumes the subscriber already exists in the Marketing Cloud.

```html
%%[

/* Set the subscriber key of the subscriber to update */
var @subscriberKey, @emailAddress, @firstName
set @subscriberKey = "subscriber_key_example"
set @emailAddress = "example@example.com"
set @firstName = "John"

if not empty(@subscriberKey) and not empty(@emailAddress) and not empty(@firstName) then

  /* Create the Subscriber object */
  var @subscriber
  set @subscriber = CreateObject("Subscriber")
  SetObjectProperty(@subscriber, "SubscriberKey", @subscriberKey)
  SetObjectProperty(@subscriber, "EmailAddress", @emailAddress)

  /* Create an attribute to update the first name */
  var @attribute
  set @attribute = CreateObject("Attribute")
  SetObjectProperty(@attribute, "Name", "FirstName")
  SetObjectProperty(@attribute, "Value", @firstName)
  AddObjectArrayItem(@subscriber, "Attributes", @attribute)

  /* Set the update options */
  var @options, @save
  set @options = CreateObject("UpdateOptions")
  set @save = CreateObject("SaveOption")
  SetObjectProperty(@save, "SaveAction", "UpdateAdd")
  SetObjectProperty(@save, "PropertyName", "*")
  AddObjectArrayItem(@options, "SaveOptions", @save)

  /* Invoke the update */
  var @statusCode, @statusMsg, @errorCode
  set @statusCode = InvokeUpdate(@subscriber, @statusMsg, @errorCode, @options)

  if @statusCode == "OK" then
    output(concat("Subscriber updated successfully."))
  else
    output(concat("Error updating subscriber: ", @statusMsg, " (", @errorCode, ")"))
  endif

else

  output(concat("Required variables are empty."))

endif

]%%
```

### Example 2: Advanced Scenario - Updating a Subscriber in a List

This example updates a subscriber and adds them to a list. If the subscriber does not exist, it will be created.

```html
%%[

/* Set subscriber and list information */
var @subscriberKey, @emailAddress, @listId
set @subscriberKey = "new_subscriber_key"
set @emailAddress = "new_subscriber@example.com"
set @listId = 12345 /* Replace with your List ID */

if not empty(@subscriberKey) and not empty(@emailAddress) and not empty(@listId) then

  /* Create the Subscriber object */
  var @subscriber
  set @subscriber = CreateObject("Subscriber")
  SetObjectProperty(@subscriber, "SubscriberKey", @subscriberKey)
  SetObjectProperty(@subscriber, "EmailAddress", @emailAddress)

  /* Add the subscriber to a list */
  var @list
  set @list = CreateObject("SubscriberList")
  SetObjectProperty(@list, "ID", @listId)
  SetObjectProperty(@list, "Status", "Active")
  AddObjectArrayItem(@subscriber, "Lists", @list)

  /* Set the update options to create the subscriber if they don't exist */
  var @options, @save
  set @options = CreateObject("UpdateOptions")
  set @save = CreateObject("SaveOption")
  SetObjectProperty(@save, "SaveAction", "UpdateAdd")
  SetObjectProperty(@save, "PropertyName", "*")
  AddObjectArrayItem(@options, "SaveOptions", @save)

  /* Invoke the update */
  var @statusCode, @statusMsg, @errorCode
  set @statusCode = InvokeUpdate(@subscriber, @statusMsg, @errorCode, @options)

  if @statusCode == "OK" then
    output(concat("Subscriber updated and added to list successfully."))
  else
    output(concat("Error: ", @statusMsg, " (", @errorCode, ")"))
  endif

else

  output(concat("Required variables are empty."))

endif

]%%
```