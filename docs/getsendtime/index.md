---
title: "GetSendTime"
---


### Description
Returns a timestamp for the beginning or end of a list, data extension (DE), or manual send at the job or individual subscriber level. The value that the function returns is in Central Standard Time (CST) without daylight saving time.

### Arguments

| Ordinal | Type | Required | Description |
|---|---|---|---|
| 1 | Boolean | Optional | If `true`, the function returns the job publish time or time at which the job started. If `false` (default), the function returns the timestamp at which the send completed for the individual subscriber.

### Notes
> NOTE: The `GetSendTime()` function returns values in Central Standard Time (CST) without daylight saving time. This can lead to discrepancies if your account or subscribers are in a different time zone with daylight saving.
> NOTE: When called without parameters, `GetSendTime()` is equivalent to `GetSendTime(false)`.

### Example 1: Basic Use
This example demonstrates how to retrieve the individual subscriber send completion time.

```html
%%[
    /* Declare a variable to store the send time */
    VAR @sendTime

    /* Retrieve the send time for the individual subscriber */
    SET @sendTime = GetSendTime()

    /* Check if the send time is not empty before displaying */
    IF NOT EMPTY(@sendTime) THEN
]%%
    <p>Individual Subscriber Send Time: %%=Format(@sendTime, "MM/dd/yyyy hh:mm:ss tt")=%% CST</p>
%%[
    ELSE
]%%
    <p>Send time not available for this subscriber.</p>
%%[
    END IF
]%%
```

### Example 2: Advanced Scenario
This example demonstrates how to retrieve the job publish/start time.

```html
%%[
    /* Declare a variable to store the job send time */
    VAR @jobSendTime

    /* Retrieve the job publish/start time */
    SET @jobSendTime = GetSendTime(true)

    /* Check if the job send time is not empty before displaying */
    IF NOT EMPTY(@jobSendTime) THEN
]%%
    <p>Job Publish/Start Time: %%=Format(@jobSendTime, "MM/dd/yyyy hh:mm:ss tt")=%% CST</p>
%%[
    ELSE
]%%
    <p>Job publish/start time not available.</p>
%%[
    END IF
]%%
```