---
title: "GUID"
---


The `GUID()` function generates a globally unique identifier (GUID) as a string value. This function is commonly used to create unique keys or identifiers for various purposes, such as tracking, data extension primary keys, or generating unique links.

### Arguments

| Ordinal | Type   | Required | Description                      |
|---------|--------|----------|----------------------------------|
| N/A     | N/A    | No       | The `GUID()` function accepts no arguments. |

> NOTE: The `GUID()` function generates a new unique identifier each time it is called. If you need to use the same GUID multiple times within a single email or Cloud Page, it is recommended to store the generated GUID in a variable.

### Example 1: Basic Use

This example demonstrates the basic usage of the `GUID()` function to generate and display a single GUID.

```html
%%[VAR @myGuid]
SET @myGuid = GUID()

/* Output the generated GUID */
IF NOT EMPTY(@myGuid) THEN
    Output(Concat("Generated GUID: ", @myGuid))
ELSE
    Output("Error: GUID could not be generated.")
END IF
```

### Example 2: Generating Multiple GUIDs for Data Extension Insertion

This example shows how to generate multiple unique GUIDs and use them as primary keys when inserting records into a data extension. This is a common scenario for ensuring data uniqueness.

```html
%%[
VAR @i, @rowCount, @newGuid
SET @rowCount = 3 /* Number of records to insert */

FOR @i = 1 TO @rowCount DO
    SET @newGuid = GUID()

    /* Check if GUID was successfully generated before using it */
    IF NOT EMPTY(@newGuid) THEN
        /* Insert into a Data Extension named 'MyTrackingDE' with a primary key 'RecordID' */
        /* Replace 'MyTrackingDE', 'RecordID', 'SomeDataField' with your actual Data Extension and field names */
        InsertData("MyTrackingDE", "RecordID", @newGuid, "SomeDataField", Concat("Data for ", @newGuid))
        Output(Concat("Inserted record with GUID: ", @newGuid, "<br>"))
    ELSE
        Output(Concat("Failed to generate GUID for iteration ", @i, "<br>"))
    END IF
NEXT @i
]%%
```