---
title: "RetrieveMscrmRecords"
---


Retrieves data from Microsoft Dynamics CRM entities based on specified criteria. This function allows you to fetch records from your Microsoft Dynamics CRM instance directly within AMPscript, enabling dynamic content personalization and data-driven messaging.

### Arguments

| Ordinal | Type   | Required | Description                                                               |
|---------|--------|----------|---------------------------------------------------------------------------|
| 1       | String | Yes      | The name of the Microsoft Dynamics CRM entity to retrieve records from.   |
| 2       | String | Yes      | A comma-separated list of fields to retrieve from the specified entity.   |
| 3       | String | Yes      | The name of the field to filter records on.                               |
| 4       | String | Yes      | The operator to use for the filter (e.g., `=`, `!=`, `>`, `<`, `LIKE`). |
| 5       | String | Yes      | The value to filter on for the specified `queryFieldName`.                |

> NOTE: This function is specifically designed for integration with Microsoft Dynamics CRM. Ensure your Marketing Cloud account is properly configured with the necessary CRM integration to utilize this function effectively.

### Example 1: Basic Use

This example retrieves the `ContactId`, `FirstName`, and `LastName` for all contacts where the `LastName` is 'Santos'. It then iterates through the retrieved records to display the contact information.

```html
%%[
/* Define variables for the CRM entity and fields */
VAR @entityName, @fieldsToRetrieve, @queryFieldName, @queryFieldOperator, @queryFieldValue
VAR @records_retrieved, @rowCount, @i, @contactId, @firstName, @lastName

SET @entityName = "contact"
SET @fieldsToRetrieve = "contactid,firstname,lastname"
SET @queryFieldName = "lastname"
SET @queryFieldOperator = "="
SET @queryFieldValue = "Santos"

/* Retrieve records from Microsoft Dynamics CRM */
SET @records_retrieved = RetrieveMscrmRecords(@entityName, @fieldsToRetrieve, @queryFieldName, @queryFieldOperator, @queryFieldValue)
SET @rowCount = RowCount(@records_retrieved)

/* Check if any records were retrieved */
IF NOT EMPTY(@records_retrieved) THEN
    IF @rowCount > 0 THEN
        FOR @i = 1 TO @rowCount DO
            SET @row = Row(@records_retrieved, @i)
            SET @contactId = Field(@row, "contactid")
            SET @firstName = Field(@row, "firstname")
            SET @lastName = Field(@row, "lastname")

            /* Output the contact information */
            Output(Concat("Contact ID: ", @contactId, ", Name: ", @firstName, " ", @lastName, "<br>"))
        NEXT @i
    ELSE
        Output(Concat("No contacts found with last name '", @queryFieldValue, "'.<br>"))
    ENDIF
ELSE
    Output("Error: Could not retrieve records from Microsoft Dynamics CRM.<br>")
ENDIF
]%%
```

### Example 2: Advanced Scenario - Filtering by Multiple Criteria (Conceptual)

While `RetrieveMscrmRecords` directly supports only a single filter criterion, you can conceptually achieve more complex filtering by retrieving a broader set of records and then using AMPscript's conditional logic to further refine the results. This example demonstrates how you might retrieve contacts by `City` and then filter them by `Status` within AMPscript. (Note: For true multi-criteria filtering directly in CRM, consider using `RetrieveMscrmRecordsFetchXml` if available and suitable for your use case).

```html
%%[
/* Define variables for the CRM entity and fields */
VAR @entityName, @fieldsToRetrieve, @queryFieldName, @queryFieldOperator, @queryFieldValue
VAR @records_retrieved, @rowCount, @i, @contactId, @firstName, @lastName, @city, @status

SET @entityName = "contact"
SET @fieldsToRetrieve = "contactid,firstname,lastname,address1_city,statuscode"
SET @queryFieldName = "address1_city"
SET @queryFieldOperator = "="
SET @queryFieldValue = "New York"

/* Retrieve records from Microsoft Dynamics CRM based on city */
SET @records_retrieved = RetrieveMscrmRecords(@entityName, @fieldsToRetrieve, @queryFieldName, @queryFieldOperator, @queryFieldValue)
SET @rowCount = RowCount(@records_retrieved)

/* Check if any records were retrieved */
IF NOT EMPTY(@records_retrieved) THEN
    IF @rowCount > 0 THEN
        Output(Concat("Contacts in ", @queryFieldValue, " with 'Active' status:<br>"))
        FOR @i = 1 TO @rowCount DO
            SET @row = Row(@records_retrieved, @i)
            SET @contactId = Field(@row, "contactid")
            SET @firstName = Field(@row, "firstname")
            SET @lastName = Field(@row, "lastname")
            SET @city = Field(@row, "address1_city")
            SET @status = Field(@row, "statuscode") /* Assuming statuscode is an integer or string representation */

            /* Further filter by status within AMPscript */
            IF @status == 1 THEN /* Assuming '1' represents an 'Active' status */
                Output(Concat("Contact ID: ", @contactId, ", Name: ", @firstName, " ", @lastName, ", City: ", @city, ", Status: Active<br>"))
            ENDIF
        NEXT @i
    ELSE
        Output(Concat("No contacts found in '", @queryFieldValue, "'.<br>"))
    ENDIF
ELSE
    Output("Error: Could not retrieve records from Microsoft Dynamics CRM.<br>")
ENDIF
]%%
```