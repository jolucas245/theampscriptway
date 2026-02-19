---
title: "Data Extension Functions"
---

## Overview

This set of functions provides a means of interacting with rows in Data Extensions. Applications include:

* retrieving specific column values with simple criteria
* retrieving row sets with simple criteria
* executing predefined filters on data extension rows
* adding data extension rows
* updating column values in data extension rows
* retrieving row counts.

AMPscript functions that retrieve, update and delete rows in Data Extensions share a common characteristic: they can accept one or more column name/value pairs as parameters.

> NOTE: Not all of the Data Extension functions can be used in the context of an email. A few are only intended for landing pages, microsite pages or CloudPages, while others are only for use in SMS messages.

> NOTE: All Data Extensions have a hidden identity column called `_CustomObjectKey`. It’s unique for each row in the Data Extension.