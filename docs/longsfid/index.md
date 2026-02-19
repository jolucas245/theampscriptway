---
title: "LongSFID"
---


This function converts a 15-character Salesforce ID into its 18-character, case-safe equivalent. This is particularly useful when interacting with Salesforce APIs or other systems that require the 18-character ID format, as the 15-character ID is case-sensitive and can lead to issues in certain contexts.

### Arguments

| Ordinal | Type   | Required | Description                                                              |
|---------|--------|----------|--------------------------------------------------------------------------|
| 1       | String | Yes      | The 15-character Salesforce ID to be converted to an 18-character ID.    |

> NOTE: This function works only for accounts integrated with a Salesforce account.

### Example 1: Basic Use

This example demonstrates the basic conversion of a 15-character Salesforce ID to its 18-character equivalent.

```html
%%[VAR @shortSfid, @longSfid]

SET @shortSfid = "001A000000XyZ12"

/* Check if the short SFID is not empty before attempting conversion */
IF NOT EMPTY(@shortSfid) THEN
    SET @longSfid = LongSfid(@shortSfid)
    /* Output the converted 18-character SFID */
    OutputLine(CONCAT("The 18-character SFID is: ", @longSfid))
ELSE
    OutputLine("The provided short SFID is empty.")
ENDIF
```

### Example 2: Advanced Scenario - Using in a Lookup

This example shows how `LongSfid` can be used in conjunction with a `Lookup` function to ensure that a case-safe ID is used when querying data from a Salesforce Data Extension.

```html
%%[VAR @shortContactId, @longContactId, @contactName]

SET @shortContactId = "003A000000XyZ12"

/* Ensure the short Contact ID is valid before proceeding */
IF NOT EMPTY(@shortContactId) THEN
    SET @longContactId = LongSfid(@shortContactId)

    /* Look up contact name using the 18-character ID */
    SET @contactName = Lookup("Salesforce_Contacts", "Name", "Id", @longContactId)

    IF NOT EMPTY(@contactName) THEN
        OutputLine(CONCAT("Contact Name for ID ", @longContactId, ": ", @contactName))
    ELSE
        OutputLine(CONCAT("No contact found for ID: ", @longContactId))
    ENDIF
ELSE
    OutputLine("The provided short Contact ID is empty.")
ENDIF
```