---
title: "RetrieveSalesforceJobSources"
---


The `RetrieveSalesforceJobSources()` function returns a rowset containing information about the data sources used in a Salesforce send job. This rowset includes the `SourceID`, `SourceType`, and `IsInclusionSource` values for the specified job ID. It is important to note that this function does not provide information about the status of the job itself. It will return data even if the job was canceled, and therefore, should not be used to determine job completion.

### Arguments

| Ordinal | Type   | Required | Description                                                              |
| :------ | :----- | :------- | :----------------------------------------------------------------------- |
| 1       | Number | Yes      | The numeric job ID of the Salesforce send for which to retrieve information. |

> NOTE: This function is specifically designed to retrieve information about Salesforce send jobs within Marketing Cloud Engagement. It does not provide details on the job's execution status or success.

### Example 1: Basic Use

This example demonstrates how to retrieve and display the source IDs and types for a given Salesforce job ID.

```html
%%[VAR @jobId, @jobData, @rowCount, @i, @sourceID, @sourceType, @isInclusionSource]

/* Define the Salesforce Job ID */
SET @jobId = 90492034

/* Retrieve the job sources as a rowset */
SET @jobData = RetrieveSalesforceJobSources(@jobId)

/* Check if any data was returned */
IF NOT EMPTY(@jobData) THEN
    SET @rowCount = RowCount(@jobData)

    IF @rowCount > 0 THEN
        OutputLine(Concat("<h2>Job Sources for Job ID: ", @jobId, "</h2>"))
        OutputLine("<ul>")

        /* Loop through each row in the rowset */
        FOR @i = 1 TO @rowCount DO
            SET @row = Row(@jobData, @i)
            SET @sourceID = Field(@row, "SourceID")
            SET @sourceType = Field(@row, "SourceType")
            SET @isInclusionSource = Field(@row, "IsInclusionSource")

            OutputLine(Concat("<li><b>Source ID:</b> ", @sourceID, ", <b>Source Type:</b> ", @sourceType, ", <b>Is Inclusion Source:</b> ", @isInclusionSource, "</li>"))
        NEXT @i
        OutputLine("</ul>")
    ELSE
        OutputLine(Concat("<p>No job sources found for Job ID: ", @jobId, "</p>"))
    ENDIF
ELSE
    OutputLine(Concat("<p>Failed to retrieve job sources for Job ID: ", @jobId, ". The job data is empty.</p>"))
ENDIF

/* Example of handling a non-existent job ID */
SET @jobId = 12345678 /* A hypothetical non-existent job ID */
SET @jobData = RetrieveSalesforceJobSources(@jobId)
IF NOT EMPTY(@jobData) THEN
    /* Process data if it exists */
ELSE
    OutputLine(Concat("<p>No data returned for hypothetical Job ID: ", @jobId, ". This is expected if the job ID does not exist.</p>"))
ENDIF
```

### Example 2: Advanced Scenario - Conditional Processing Based on Source Type

This example demonstrates how to retrieve job sources and perform conditional logic based on the `SourceType`.

```html
%%[VAR @jobId, @jobData, @rowCount, @i, @row, @sourceID, @sourceType, @isInclusionSource]

/* Define the Salesforce Job ID */
SET @jobId = 90492034

/* Retrieve the job sources */
SET @jobData = RetrieveSalesforceJobSources(@jobId)

/* Check if job data is not empty and contains rows */
IF NOT EMPTY(@jobData) THEN
    SET @rowCount = RowCount(@jobData)

    IF @rowCount > 0 THEN
        OutputLine(Concat("<h2>Detailed Job Source Analysis for Job ID: ", @jobId, "</h2>"))

        FOR @i = 1 TO @rowCount DO
            SET @row = Row(@jobData, @i)
            SET @sourceID = Field(@row, "SourceID")
            SET @sourceType = Field(@row, "SourceType")
            SET @isInclusionSource = Field(@row, "IsInclusionSource")

            OutputLine(Concat("<p>Processing Source ID: ", @sourceID, " (Type: ", @sourceType, ")</p>"))

            /* Conditional logic based on SourceType */
            IF @sourceType == "DataExtension" THEN
                OutputLine(Concat("<p style=\"color:blue;\">This source is a Data Extension. Further actions for Data Extensions can be implemented here.</p>"))
            ELSEIF @sourceType == "SalesforceReport" THEN
                OutputLine(Concat("<p style=\"color:green;\">This source is a Salesforce Report. Specific processing for reports goes here.</p>"))
            ELSE
                OutputLine(Concat("<p style=\"color:gray;\">This source is of type: ", @sourceType, ". Default handling.</p>"))
            ENDIF
        NEXT @i
    ELSE
        OutputLine(Concat("<p>No specific sources found for Job ID: ", @jobId, ".</p>"))
    ENDIF
ELSE
    OutputLine(Concat("<p>Error: Could not retrieve job sources for Job ID: ", @jobId, ". The returned data was empty.</p>"))
ENDIF
```