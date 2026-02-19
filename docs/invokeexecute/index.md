---
title: "InvokeExecute"
---


The `invokeexecute` function executes a specified method on a Marketing Cloud API Object. It is used to trigger asynchronous API operations within an AMPscript context, returning a request ID to track the operation's status.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | APIObject | True | The API Object to execute the method on. This object must be created and configured using the `CreateObject` and `SetObjectProperty` functions. |
| 2 | String | True | A variable that will be populated with the status message of the API call. |
| 3 | String | True | A variable that will be populated with the request ID of the asynchronous operation. |

> NOTE: The `invokeexecute` function is primarily used for the `LogUnsubEvent` and `Refresh` Group objects. Its use with other API objects is not officially documented and may lead to unexpected results.

### Example 1: Basic Use - Logging an Unsubscribe Event

This example demonstrates how to log an unsubscribe event for a subscriber. This is the most common use case for the `invokeexecute` function.

```html
%%[

/* Set the subscriber key of the user to unsubscribe */
var @subscriberKey, @emailAddress
set @subscriberKey = "subscriber_key_to_unsubscribe"
set @emailAddress = "example@example.com"

if not empty(@subscriberKey) and not empty(@emailAddress) then

  /* Create the LogUnsubEvent object */
  var @lue
  set @lue = CreateObject("LogUnsubEvent")

  /* Set the properties for the LogUnsubEvent object */
  SetObjectProperty(@lue, "SubscriberKey", @subscriberKey)
  SetObjectProperty(@lue, "EmailAddress", @emailAddress)

  /* Execute the LogUnsubEvent */
  var @statusCode, @statusMessage, @requestId
  set @statusCode = InvokeExecute(@lue, @statusMessage, @requestId)

  /* Check the status of the operation */
  if @statusCode == "OK" then
    output(concat("Successfully initiated unsubscribe for ", @subscriberKey, ". Request ID: ", @requestId))
  else
    output(concat("Failed to initiate unsubscribe. Status: ", @statusCode, ", Message: ", @statusMessage))
  endif

else

  output(concat("SubscriberKey or EmailAddress is empty."))

endif

]%%
```

### Example 2: Advanced Scenario - Refreshing a Group

This example shows how to refresh a group. This is useful when you need to update the membership of a group based on its defined rules.

```html
%%[

/* Set the CustomerKey of the Group to refresh */
var @groupCustomerKey
set @groupCustomerKey = "YOUR_GROUP_CUSTOMER_KEY"

if not empty(@groupCustomerKey) then

  /* Create the Group object */
  var @group
  set @group = CreateObject("Group")

  /* Set the CustomerKey of the Group */
  SetObjectProperty(@group, "CustomerKey", @groupCustomerKey)

  /* Create the Refresh action */
  var @refreshAction
  set @refreshAction = CreateObject("Refresh")

  /* Set the object for the Refresh action */
  SetObjectProperty(@refreshAction, "Object", @group)

  /* Execute the Refresh action */
  var @statusCode, @statusMessage, @requestId
  set @statusCode = InvokeExecute(@refreshAction, @statusMessage, @requestId)

  /* Check the status of the operation */
  if @statusCode == "OK" then
    output(concat("Successfully initiated refresh for group ", @groupCustomerKey, ". Request ID: ", @requestId))
  else
    output(concat("Failed to initiate refresh. Status: ", @statusCode, ", Message: ", @statusMessage))
  endif

else

  output(concat("GroupCustomerKey is empty."))

endif

]%%
```
