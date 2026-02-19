---
title: "CloudPagesURL"
---


The `cloudpagesurl` function returns a URL to a CloudPage, with an AES-GCM encrypted query string. This is the recommended method for linking to CloudPages from emails, as it securely passes subscriber and journey data.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | Number | True | The ID of the CloudPage. You can find this in the properties of the page in CloudPages. |
| 2 | String | False | The name of a parameter to be passed in the encrypted query string. |
| 3 | String or Number | False | The value of the parameter to be passed in the encrypted query string. |
| 4a | String | False | Additional parameter name. You can add as many name/value pairs as you need. |
| 4b | String or Number | False | Additional parameter value. |

> NOTE: This function is intended for use in emails. While it may work in other contexts like SMS or push messages, it will fail if the subscriber is not on the All Subscribers list.

### Example 1: Basic Use

This example shows how to create a simple link to a CloudPage. The Subscriber's ID is passed as a parameter.

```html
%%[

  /* Set the CloudPage ID */
  var @cloudPageId
  set @cloudPageId = 12345

  /* Get the Subscriber Key */
  var @subscriberKey
  set @subscriberKey = [_subscriberkey]

  /* Check if subscriberKey is not empty */
  if not empty(@subscriberKey) then

    /* Generate the CloudPage URL */
    var @cloudPageUrl
    set @cloudPageUrl = CloudPagesURL(@cloudPageId, 'sk', @subscriberKey)

  endif

]%%

<a href="%%=v(@cloudPageUrl)=%%">Click here to view your personalized page</a>
```

### Example 2: Advanced Scenario with Multiple Parameters

This example demonstrates passing multiple parameters to a CloudPage, including a static value and a value from a data extension attribute.

```html
%%[

  /* Set the CloudPage ID */
  var @cloudPageId
  set @cloudPageId = 12345

  /* Get the Subscriber Key and a DE attribute */
  var @subscriberKey, @productInterest
  set @subscriberKey = [_subscriberkey]
  set @productInterest = [ProductInterest]

  /* Check if required values are not empty */
  if not empty(@subscriberKey) and not empty(@productInterest) then

    /* Generate the CloudPage URL with multiple parameters */
    var @cloudPageUrl
    set @cloudPageUrl = CloudPagesURL(@cloudPageId, 'sk', @subscriberKey, 'interest', @productInterest, 'source', 'email')

  endif

]%%

<a href="%%=v(@cloudPageUrl)=%%">Click here for a special offer!</a>
```
