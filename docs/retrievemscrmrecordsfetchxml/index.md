---
title: "RetrieveMscrmRecordsFetchXML"
---


Accepts a Fetch XML string and returns the specified Microsoft Dynamics CRM entity attributes as a rowset. This function provides more flexibility than `RetrieveMSCRMRecords()` by allowing the use of Fetch XML queries, which support complex filtering, sorting, and linked entity lookups.

### Arguments

`RetrieveMSCRMRecordsFetchXML(1)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | A valid Microsoft Dynamics CRM Fetch XML query string. |

> NOTE: This function requires an active Microsoft Dynamics CRM connector configured in your Marketing Cloud account.

### Example 1: Basic Use

This example retrieves contact details from Microsoft Dynamics CRM using a Fetch XML query filtered by subscriber key.

```html
%%[

VAR @subscriberKey, @xml, @records, @rowCount, @i

SET @subscriberKey = AttributeValue("_subscriberkey")

/* Build the Fetch XML query */
SET @xml = ""
SET @xml = Concat(@xml, "<fetch mapping='logical' count='50' version='1.0'>")
SET @xml = Concat(@xml, "  <entity name='contact'>")
SET @xml = Concat(@xml, "    <attribute name='contactid'/>")
SET @xml = Concat(@xml, "    <attribute name='emailaddress1'/>")
SET @xml = Concat(@xml, "    <attribute name='firstname'/>")
SET @xml = Concat(@xml, "    <attribute name='lastname'/>")
SET @xml = Concat(@xml, "    <filter>")
SET @xml = Concat(@xml, "      <condition attribute='contactid' operator='eq' value='", @subscriberKey, "'/>")
SET @xml = Concat(@xml, "    </filter>")
SET @xml = Concat(@xml, "  </entity>")
SET @xml = Concat(@xml, "</fetch>")

/* Execute the Fetch XML query */
SET @records = RetrieveMSCRMRecordsFetchXML(@xml)
SET @rowCount = RowCount(@records)

IF @rowCount > 0 THEN
  FOR @i = 1 TO @rowCount DO
    VAR @record, @firstName, @lastName, @email
    SET @record = Row(@records, @i)
    SET @firstName = Field(@record, "firstname")
    SET @lastName = Field(@record, "lastname")
    SET @email = Field(@record, "emailaddress1")

    Output(Concat("Name: ", @firstName, " ", @lastName, "<br>"))
    Output(Concat("Email: ", @email, "<br><br>"))
  NEXT @i
ELSE
  Output("No CRM records found for this subscriber.")
ENDIF

]%%
```

### Example 2: Fetch XML with Linked Entities

This example retrieves contacts along with their associated account name using a linked entity join.

```html
%%[

VAR @xml, @records, @rowCount, @i

SET @xml = ""
SET @xml = Concat(@xml, "<fetch mapping='logical' count='100' version='1.0'>")
SET @xml = Concat(@xml, "  <entity name='contact'>")
SET @xml = Concat(@xml, "    <attribute name='fullname'/>")
SET @xml = Concat(@xml, "    <attribute name='emailaddress1'/>")
SET @xml = Concat(@xml, "    <link-entity name='account' from='accountid' to='parentcustomerid' alias='account'>")
SET @xml = Concat(@xml, "      <attribute name='name'/>")
SET @xml = Concat(@xml, "    </link-entity>")
SET @xml = Concat(@xml, "    <filter>")
SET @xml = Concat(@xml, "      <condition attribute='statecode' operator='eq' value='0'/>")
SET @xml = Concat(@xml, "    </filter>")
SET @xml = Concat(@xml, "  </entity>")
SET @xml = Concat(@xml, "</fetch>")

SET @records = RetrieveMSCRMRecordsFetchXML(@xml)
SET @rowCount = RowCount(@records)

IF @rowCount > 0 THEN
  FOR @i = 1 TO @rowCount DO
    VAR @record, @fullName, @accountName
    SET @record = Row(@records, @i)
    SET @fullName = Field(@record, "fullname")
    SET @accountName = Field(@record, "account.name")

    Output(Concat(@fullName, " — ", @accountName, "<br>"))
  NEXT @i
ENDIF

]%%
```
