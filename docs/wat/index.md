---
title: "WAT"
---


This function returns a specific set of Web Analytics Tracking parameters and values. Once the WAT parameters and values are returned, they can be manually appended to any URLs as needed. By default, parameter names and values must be static values.

### Arguments

`WAT(1,2,n)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | External key of the WAT parameter set |
| 2 | String | True | Value for parameter 1 in the set |
| n | String | False | Value for parameter 2 in the set (see note) |

> NOTE: Additional parameter values can be appended as arguments.

[Parameter Manager](https://help.salesforce.com/s/articleView?id=sf.mc_overview_parameter_management.htm&type=5), when enabled, automatically appends a set of URL parameters and values to every link at email send time. This string can include in line personalization strings and AMPscript.

The `WAT` function requires the `SPECIAL_LINK_PARAMS` business rule. In addition, a *Brand Tag* named `ENHANCED_WEB_ANALYTICS_TRACKING` must be enabled. Unlike the `email_XtraLinkParameters` set of parameters, these analytics strings are stored with *key* values:

```html
verifyParams,?verify=%%=urlencode(lowercase(trim(WATP(1))))=%%
nameParams,?fName=%%=urlencode(WATP(1))=%%&lName=%%=urlencode(WATP(2))=%%
```

At send time, WAT parameters and values are added before the automatic parameters and values from Parameter Manager.

In this example, the WAT parameter and value is retrieved, set and appended to a login URL:

### Example 1

```html
%%[

var @loginURL

set @loginURL = concat("https://limedash.com/login", WAT("verifyParams", "DfkSyhtdtYRBb"))

]%%
<a href="%%=redirectto(@loginURL)=%%" alias="Login">Login</a>
```

#### Output

```html
<a href="https://limedash.com/login?verify=DfkSyhtdtYRBb" alias="Login">Login</a>
```

To overcome for the static value limitation, the [TreatAsContent](/treatascontent) function can be used to evaluate the WAT function prior to appending it to the URL:

### Example 2

```html
%%[

var @firstName
var @lastName
var @wat
var @profileURL

set @firstName = AttributeValue("FirstName") /* value from attribute or DE column in send context */
set @firstName = "Nora" /* or a literal value */

set @lastName = AttributeValue("LastName") /* value from attribute or DE column in send context */
set @lastName = "Taylor" /* or a literal value */

set @wat = treatascontent(concat('%%=WAT("nameParams","', @firstName,'","', @lastName,'")=%%'))

set @profileURL = concat("https://limedash.com/profile", @wat)

]%%
<a href="%%=redirectto(@profileURL)=%%" alias="Profile">Profile</a>
```

#### Output

```html
<a href="https://limedash.com/profile?fName=Nora&lName=Taylor" alias="Profile">Profile</a>
```