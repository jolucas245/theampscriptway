---
title: "RetrieveSalesforceObjects"
---


The `retrievesalesforceobjects` function retrieves field values from a Salesforce object, such as a Lead, Contact, or Custom Object. It returns a rowset of data that can be iterated over. This function is useful for personalizing emails and landing pages with data from Sales Cloud or Service Cloud.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | Yes | The name of the Salesforce object to retrieve data from (e.g., "Lead", "Contact", "Account"). |
| 2 | String | Yes | A comma-delimited string of field names to retrieve. |
| 3 | String | Yes | The name of the field to use for filtering the records. |
| 4 | String | Yes | The comparison operator for the filter (e.g., "=", "!=", ">", "<"). |
| 5 | String | Yes | The value to compare against in the filter. |
| 6+ | String | No | Additional sets of filter criteria can be added as subsequent arguments. |

> NOTE: This function is only available in emails, landing pages, and mobile messages sent through Marketing Cloud Engagement. It is not available in SMS messages or push notifications sent from Journey Builder.

### Example 1: Basic Use

This example retrieves the First Name and Last Name of a Lead with a specific email address.

```html
%%[

/* Set the email address to look up */
var @email
set @email = "[email@example.com](mailto:email@example.com)"

/* Retrieve the Lead record */
var @rows, @row, @rowCount
set @rows = retrievesalesforceobjects("Lead", "FirstName,LastName", "Email", "=", @email)

/* Check if any records were returned */
if not empty(@rows) then

  /* Get the first row from the rowset */
  set @row = row(@rows, 1)

  /* Get the field values from the row */
  var @firstName, @lastName
  set @firstName = field(@row, "FirstName")
  set @lastName = field(@row, "LastName")

  /* Output the values */
  output(concat("First Name: ", @firstName, "<br>"))
  output(concat("Last Name: ", @lastName, "<br>"))

else

  /* Output a message if no records were found */
  output(concat("No Lead found with email: ", @email))

endif

]%%
```

### Example 2: Advanced Scenario

This example retrieves all contacts from a specific Account with a custom field value and displays them in a list.

```html
%%[

/* Set the Account ID and custom field value to look up */
var @accountId, @customFieldValue
set @accountId = "001xxxxxxxxxxxxxxx"
set @customFieldValue = "Value"

/* Retrieve the Contact records */
var @rows, @rowCount, @i
set @rows = retrievesalesforceobjects("Contact", "FirstName,LastName,Email", "AccountId", "=", @accountId, "CustomField__c", "=", @customFieldValue)

/* Check if any records were returned */
set @rowCount = rowcount(@rows)
if @rowCount > 0 then

  /* Output the number of contacts found */
  output(concat("Found ", @rowCount, " contacts:<br><br>"))

  /* Loop through the rowset and output the values */
  for @i = 1 to @rowCount do

    /* Get the row from the rowset */
    var @row, @firstName, @lastName, @email
    set @row = row(@rows, @i)

    /* Get the field values from the row */
    set @firstName = field(@row, "FirstName")
    set @lastName = field(@row, "LastName")
    set @email = field(@row, "Email")

    /* Output the values */
    output(concat(@i, ". ", @firstName, " ", @lastName, " (", @email, ")<br>"))

  next @i

else

  /* Output a message if no records were found */
  output(concat("No contacts found for this account."))

endif

]%%
```