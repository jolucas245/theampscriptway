---
title: "ExecuteFilter"
---


Executes a data filter and returns an unordered rowset that contains the results. This function is specifically designed for data filters based on data extensions and does not support data filters based on profile attributes. Its usage is restricted to CloudPages, landing pages, microsites, and SMS messages created within MobileConnect.

### Arguments

| Ordinal | Type   | Required | Description                                                                                                                            |
|---------|--------|----------|----------------------------------------------------------------------------------------------------------------------------------------|
| 1       | String | Yes      | The external ID of the data filter to execute. This filter must be based on a data extension.                                          |

> NOTE: This function exclusively operates with data filters that are based on data extensions. It cannot be used with data filters that are based on profile attributes.
> NOTE: This function is only supported for use on CloudPages, landing pages, microsites, and SMS messages created in MobileConnect.

### Example 1: Basic Use

This example demonstrates how to execute a predefined data filter to retrieve a rowset of members with more than 50,000 reward points from a data extension named "MembershipRewardsProgramme".

```html
%%[
    /* Define the external key of the data filter */
    SET @dataFilterExternalId = "c5a7e0d9-41e0-4068-bdcc-8766d7c1af94"

    /* Execute the data filter and store the resulting rowset */
    SET @filteredRows = ExecuteFilter(@dataFilterExternalId)

    /* Check if any rows were returned by the filter */
    IF NOT IsEmpty(@filteredRows) THEN
        SET @rowCount = RowCount(@filteredRows)
        Output(Concat("Number of members with over 50,000 points: ", @rowCount, "<br>"))

        /* Loop through the filtered rows and display relevant information */
        FOR @i = 1 TO @rowCount DO
            SET @row = Row(@filteredRows, @i)
            SET @memberId = Field(@row, "MemberId")
            SET @firstName = Field(@row, "FirstName")
            SET @surname = Field(@row, "Surname")
            SET @rewardsPoints = Field(@row, "RewardsPoints")

            Output(Concat("Member ID: ", @memberId, ", Name: ", @firstName, " ", @surname, ", Points: ", @rewardsPoints, "<br>"))
        NEXT @i
    ELSE
        Output(Concat("No members found with over 50,000 points.<br>"))
    ENDIF
]%%
```

### Example 2: Displaying Filtered Data in a Table

This example shows how to execute the same data filter and then display the results in an HTML table format, providing a structured view of the filtered data.

```html
%%[
    /* Define the external key of the data filter */
    SET @dataFilterExternalId = "c5a7e0d9-41e0-4068-bdcc-8766d7c1af94"

    /* Execute the data filter */
    SET @filteredRows = ExecuteFilter(@dataFilterExternalId)
]%%

<!-- Check if the filter returned any rows before attempting to display -->
%%[ IF NOT IsEmpty(@filteredRows) THEN ]%%
    <table border="1">
        <thead>
            <tr>
                <th>Rank</th>
                <th>Member ID</th>
                <th>First Name</th>
                <th>Surname</th>
                <th>Rewards Points</th>
                <th>Area</th>
            </tr>
        </thead>
        <tbody>
            %%[ FOR @i = 1 TO RowCount(@filteredRows) DO ]%%
                %%[ SET @row = Row(@filteredRows, @i) ]%%
                <tr>
                    <td>%%=v(@i)=%%</td>
                    <td>%%=v(Field(@row, "MemberId"))=%%</td>
                    <td>%%=v(Field(@row, "FirstName"))=%%</td>
                    <td>%%=v(Field(@row, "Surname"))=%%</td>
                    <td>%%=v(Field(@row, "RewardsPoints"))=%%</td>
                    <td>%%=v(Field(@row, "Area"))=%%</td>
                </tr>
            %%[ NEXT @i ]%%
        </tbody>
    </table>
%%[ ELSE ]%%
    <p>No matching members found for the specified filter.</p>
%%[ ENDIF ]%%
```