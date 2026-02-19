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