---
title: "Sales & Service Cloud Functions"
---


Marketing Cloud includes several AMPscript functions that enable interaction with Sales and Service Cloud object records. These functions require an active Marketing Cloud Connect integration between your Marketing Cloud and Salesforce CRM instances.

### Available Functions

| Function | Description |
| --- | --- |
| [CreateSalesforceObject](/createsalesforceobject) | Creates a new record in a standard or custom Salesforce object. |
| [LongSFID](/longsfid) | Converts a 15-character Salesforce ID to an 18-character case-safe ID. |
| [RetrieveSalesforceJobSources](/retrievesalesforcejobsources) | Returns the sources associated with a Salesforce-triggered email send. |
| [RetrieveSalesforceObjects](/retrievesalesforceobjects) | Retrieves a rowset of records from a Salesforce object based on filter criteria. |
| [UpdateSingleSalesforceObject](/updatesinglesalesforceobject) | Updates a single record in a Salesforce object by its record ID. |

### Common Use Cases

These functions are commonly used for:

- Dynamically personalizing Triggered Send emails with data from Salesforce CRM objects (e.g., Opportunity, Case, or custom objects).
- Creating or updating records in Salesforce objects directly from CloudPages, such as building a custom preference center that writes back to a Contact or Lead record.
- Retrieving real-time data from Sales Cloud for use in Marketing Cloud emails, rather than relying on synchronized data extensions.
- Converting 15-digit Salesforce IDs to 18-digit case-safe IDs when creating subscriber records.

> NOTE: These functions require Marketing Cloud Connect to be configured and active. They are most commonly used in Triggered Sends where the Salesforce object data is available in the send context.
