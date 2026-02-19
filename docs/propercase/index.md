---
title: "Propercase"
---


This function capitalizes the first letter in the specified string and any other letters in the string that follow any character other than a letter. It converts all other letters into lowercase.

### Argument

`ProperCase(1)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | String to convert into proper case |

### Example

```html
%%[

var @fullName, @fullNameProperCase

set @fullName = AttributeValue("fullName") /* value from attribute or DE column in send context */
set @fullName = "BARB BROWN" /* or a literal value */

set @fullNameProperCase = ProperCase(@fullName)

]%%
fullName: %%=v(@fullName)=%%
<br>fullNameProperCase: %%=v(@fullNameProperCase)=%%
```

#### Output

```html
fullName: BARB BROWN
fullNameProperCase: Barb Brown
```