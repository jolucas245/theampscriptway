---
title: "InsertDE"
---


The `insertde` function inserts a row of data into a specified Data Extension. This function is primarily used within the context of emails and does not return any value.

> NOTE: For CloudPages, landing pages, microsites, and SMS messages, it is recommended to use the `InsertData` function instead.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | Yes | The name of the target Data Extension. |
| 2 | String | Yes | The name of the first column to insert data into. |
| 3 | String | Yes | The value to be inserted into the first column. |
| 4+ | String | No | Additional pairs of column names and values can be appended. |

### Example 1: Basic Use

This example demonstrates how to insert a new subscriber\'s information into a \'Subscribers\' Data Extension.

```html
/*
  This script inserts a new record into the \'Subscribers\' Data Extension.
  We are capturing the subscriber\'s email address and the current date.
*/

var @email, @currentDate
set @email = AttributeValue("emailAddr") /* or RequestParameter("emailAddr") */
set @currentDate = Now()

if not empty(@email) then
  InsertDE("Subscribers", "EmailAddress", @email, "JoinDate", @currentDate)
endif
```

### Example 2: Advanced Scenario

This example shows how to handle multiple fields and conditional logic before inserting a record into an \'EventRegistrations\' Data Extension.

```html
/*
  This script handles a registration form submission for an event.
  It checks for required fields before inserting the data.
*/

var @firstName, @lastName, @email, @eventID

set @firstName = RequestParameter("FirstName")
set @lastName = RequestParameter("LastName")
set @email = RequestParameter("EmailAddress")
set @eventID = "EVENT-001"

if not empty(@firstName) and not empty(@lastName) and not empty(@email) then

  /* Insert the new registration record */
  InsertDE(
    "EventRegistrations",
    "FirstName", @firstName,
    "LastName", @lastName,
    "EmailAddress", @email,
    "EventID", @eventID,
    "RegistrationDate", Now()
  )

else

  /* Handle missing information - you could redirect or show an error */
  Platform.Function.Redirect("http://example.com/error.html")

endif
```
