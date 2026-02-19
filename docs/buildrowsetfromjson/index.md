---
title: "BuildRowsetFromJSON"
---


This function creates a rowset from a JSON string. It returns an error or an empty rowset if there are no matches to the specified JSON path.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | The JSON data to parse. |
| 2 | String | True | The JSONPath expression that parses the source data. |
| 3 | Boolean | True | If `false`, the function returns an empty rowset when there’s a syntax error in the function or the JSONPath expression. If `true`, the function returns an exception when an error occurs. |

> NOTE: The `jsonData` parameter can’t be a simple JSON object such as `{"first": "John", "last": "Smith", "country": "US"}`.

### Example 1: Basic Use

This example demonstrates how to parse a simple JSON array of objects.

```html
/* Create a JSON object of flights */
SET @json = '{
    "Flights": [
        {
            "Origin": "IND",
            "Dest": "NYC",
            "Price": 100
        },
        {
            "Origin": "IND",
            "Dest": "LAX",
            "Price": 200
        },
        {
            "Origin": "IND",
            "Dest": "SEA",
            "Price": 500,
            "PerBagSurcharge": 25
        }
    ]
}'

/* Create a rowset from the JSON object */
SET @rows = BuildRowsetFromJson(@json, "$.Flights[*]")

/* Check if the rowset is not empty */
IF RowCount(@rows) > 0 THEN

  /* Iterate through the rowset and display the data */
  FOR @i = 1 TO RowCount(@rows) DO
    SET @row = Row(@rows, @i)
    SET @origin = Field(@row, "Origin")
    SET @dest = Field(@row, "Dest")
    SET @price = Field(@row, "Price")
    SET @perBagSurcharge = Field(@row, "PerBagSurcharge")

    Output(Concat("Origin: ", @origin, ", Destination: ", @dest, ", Price: ", @price, ", Per Bag Surcharge: ", @perBagSurcharge, "<br>"))
  NEXT @i

ELSE

    /* Fallback message if the rowset is empty */
    Output(Concat("No flights found."))

ENDIF
```

### Example 2: Advanced Scenario

This example demonstrates how to handle nested JSON and potential errors.

```html
/* Create a more complex JSON object with nested data */
SET @json = '{
    "data": {
        "trips": [
            {
                "id": "trip-1",
                "legs": [
                    {
                        "from": "New York",
                        "to": "London"
                    },
                    {
                        "from": "London",
                        "to": "Paris"
                    }
                ]
            },
            {
                "id": "trip-2",
                "legs": []
            }
        ]
    }
}'

/* Create a rowset from the JSON object */
SET @rows = BuildRowsetFromJson(@json, "$.data.trips[*].legs[*]")

/* Check if the rowset is not empty */
IF NOT EMPTY(@rows) THEN

  /* Iterate through the rowset and display the data */
  FOR @i = 1 TO RowCount(@rows) DO
    SET @row = Row(@rows, @i)
    SET @from = Field(@row, "from")
    SET @to = Field(@row, "to")

    /* Check if the fields are not empty */
    IF NOT EMPTY(@from) AND NOT EMPTY(@to) THEN
      Output(Concat("From: ", @from, ", To: ", @to, "<br>"))
    ENDIF

  NEXT @i

ELSE

    /* Fallback message if the rowset is empty */
    Output(Concat("No trip legs found."))

ENDIF
```