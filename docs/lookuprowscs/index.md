---
title: "LookupRowsCS"
---


Returns an unordered rowset from a data extension. The function can return a rowset with up to 2,000 rows. This function is case-sensitive. It is a variation of the `LookupRows()` function, which is case-insensitive.

### Arguments

| Ordinal | Type   | Required | Description                                                                                                                                     |
|---------|--------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| 1       | string | Yes      | The name of the data extension that contains the data you want to retrieve.                                                                     |
| 2       | string | Yes      | The name of the column to search. This value is case-sensitive.                                                                                 |
| 3       | string | Yes      | The value in the specified column that identifies the rows to retrieve. This value is case-sensitive.                                           |
| 4+      | string | No       | Optionally, additional search columns and values can be appended in pairs (e.g., `searchColumn2`, `searchValue2`). These are also case-sensitive. |

> NOTE: This function is case-sensitive for both the `searchColumn` and `searchValue` parameters. If case-insensitivity is required, use the `LookupRows()` function instead.

### Example 1: Basic Use

This example retrieves all rows from a Data Extension named "MembershipRewardsProgramme" where the 'Area' column exactly matches 'Chelsea'.

```html
%%[
    /* Define variables for Data Extension name, search column, and search value */
    VAR @deName, @searchColumn, @searchValue
    SET @deName = "MembershipRewardsProgramme"
    SET @searchColumn = "Area"
    SET @searchValue = "Chelsea"

    /* Perform the case-sensitive lookup */
    VAR @rows
    SET @rows = LookupRowsCS(@deName, @searchColumn, @searchValue)

    /* Check if any rows were returned */
    IF NOT EMPTY(@rows) THEN
        VAR @rowCount, @i, @row
        SET @rowCount = RowCount(@rows)

        Output(Concat("Found ", @rowCount, " members in ", @searchValue, ":<br>"))

        /* Loop through the returned rows and display MemberId and FirstName */
        FOR @i = 1 TO @rowCount DO
            SET @row = Row(@rows, @i)
            VAR @memberId, @firstName
            SET @memberId = Field(@row, "MemberId")
            SET @firstName = Field(@row, "FirstName")
            Output(Concat("- Member ID: ", @memberId, ", Name: ", @firstName, "<br>"))
        NEXT @i
    ELSE
        Output(Concat("No members found in ", @searchValue, ".<br>"))
    ENDIF
]%%
```

### Example 2: Advanced Scenario with Multiple Search Criteria

This example demonstrates how to use `LookupRowsCS` with multiple search criteria to find members in 'Chelsea' with a 'RewardsTier' of '4'.

```html
%%[
    /* Define variables for Data Extension name and search criteria */
    VAR @deName, @searchColumn1, @searchValue1, @searchColumn2, @searchValue2
    SET @deName = "MembershipRewardsProgramme"
    SET @searchColumn1 = "Area"
    SET @searchValue1 = "Chelsea"
    SET @searchColumn2 = "RewardsTier"
    SET @searchValue2 = "4"

    /* Perform the case-sensitive lookup with multiple criteria */
    VAR @rows
    SET @rows = LookupRowsCS(@deName, @searchColumn1, @searchValue1, @searchColumn2, @searchValue2)

    /* Check if any rows were returned */
    IF NOT EMPTY(@rows) THEN
        VAR @rowCount, @i, @row
        SET @rowCount = RowCount(@rows)

        Output(Concat("Found ", @rowCount, " members in ", @searchValue1, " with Rewards Tier ", @searchValue2, ":<br>"))

        /* Loop through the returned rows and display MemberId, FirstName, and RewardsTier */
        FOR @i = 1 TO @rowCount DO
            SET @row = Row(@rows, @i)
            VAR @memberId, @firstName, @rewardsTier
            SET @memberId = Field(@row, "MemberId")
            SET @firstName = Field(@row, "FirstName")
            SET @rewardsTier = Field(@row, "RewardsTier")
            Output(Concat("- Member ID: ", @memberId, ", Name: ", @firstName, ", Tier: ", @rewardsTier, "<br>"))
        NEXT @i
    ELSE
        Output(Concat("No members found matching the criteria.<br>"))
    ENDIF
]%%
```