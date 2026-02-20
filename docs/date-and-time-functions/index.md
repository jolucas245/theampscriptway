---
title: "Date & Time Functions"
---

## Overview

The date and time AMPscript functions are used to return, convert and adjust date and time values.

For functions with date-input arguments, those arguments must take one of the following forms:

* Includes a date only
* Includes both a date and time
* Includes a time only; in this case, the current date is assumed.
* Includes the GMT qualifier and conforms to the [RFC 1123](https://www.ietf.org/rfc/rfc1123.txt) time format
* Includes the date, time and a timezone offset. These must conform to the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format.
## Functions

| Function | Description |
|---|---|
| [DateAdd](/dateadd) | Adds a specified amount of time to a date value and returns the resulting date. |
| [DateDiff](/datediff) | Returns the difference between two dates in a specified unit (years, months, days, hours, or minutes). |
| [DateParse](/dateparse) | Returns a DateTime object from a date string. |
| [DatePart](/datepart) | Extracts a specific component (year, month, day, etc.) from a date or timestamp string. |
| [FormatDate](/formatdate) | Formats a date value as a string using a specified format pattern and optional locale. |
| [GetSendTime](/getsendtime) | Returns a timestamp for the beginning or end of an email send job. |
| [LocalDateToSystemDate](/localdatetosystemdate) | Converts a local datetime string to the Marketing Cloud system time (Central Time). |
| [Now](/now) | Returns the current system timestamp at the time of processing. |
| [StringToDate](/stringtodate) | Converts a date string to a .NET DateTime object. |
| [SystemDateToLocalDate](/systemdatetolocaldate) | Converts the Marketing Cloud system time to a local datetime string based on a specified timezone. |