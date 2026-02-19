---
title: "UpdateSingleSalesforceObject"
---


This function updates a record in a Sales or Service Cloud standard or custom object. The function returns `1` if the record is updated successfully or `0` if it fails.

### Arguments

| Ordinal | Type | Required | Description |
|---|---|---|---|
| 1 | String | True | The name of the Salesforce object to update. |
| 2 | String | True | The ID of the record to update. |
| 3 | String | True | The name of the first field to update. |
| 4 | String | True | The value for the first field. |
| 5 | String | False | The name of the second field to update. |
| 6 | String | False | The value for the second field. |

> NOTE: For best performance, minimize the use of this function in sends. Using this function in large sends can result in the sends failing to complete.

### Example 1: Basic Use

This example updates the `FirstName` and `LastName` of a Lead with a specific ID.

```html
%%[

VAR @leadId, @firstName, @lastName, @updateResult

SET @leadId = "00Q1I00000j9gL3UAI"
SET @firstName = "John"
SET @lastName = "Doe"

IF NOT EMPTY(@leadId) THEN

  /* Update the lead record */
  SET @updateResult = UpdateSingleSalesforceObject(
    "Lead", @leadId,
    "FirstName", @firstName,
    "LastName", @lastName
  )

  IF @updateResult == 1 THEN
    Output(CONCAT("Lead record updated successfully."))
  ELSE
    Output(CONCAT("Failed to update lead record."))
  ENDIF

ELSE
  Output(CONCAT("Lead ID is empty."))
ENDIF

]%%
```

### Example 2: Advanced Scenario

This example updates a custom object `CustomObject__c` and sets a field to `null`.

```html
%%[

VAR @customObjectId, @fieldToNull, @updateResult

SET @customObjectId = "a011I00000g9gL3UAI"
SET @fieldToNull = "Some_Date_Field__c"

IF NOT EMPTY(@customObjectId) THEN

  /* Update the custom object record and set a field to null */
  SET @updateResult = UpdateSingleSalesforceObject(
    "CustomObject__c", @customObjectId,
    "fieldsToNull", @fieldToNull
  )

  IF @updateResult == 1 THEN
    Output(CONCAT("Custom object record updated successfully."))
  ELSE
    Output(CONCAT("Failed to update custom object record."))
  ENDIF

ELSE
  Output(CONCAT("Custom Object ID is empty."))
ENDIF

]%%
```