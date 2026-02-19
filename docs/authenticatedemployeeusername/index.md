---
title: "AuthenticatedEmployeeUsername"
---


This function returns the username of the authenticated Marketing Cloud account user who is accessing the page. This is useful when creating customized pages for child Business Units (a feature available in earlier Enterprise 2.0 accounts).

### Arguments

`AuthenticatedEmployeeUserName()`

This function does not accept any arguments.

> NOTE: This function will only return the correct value when used in classic landing pages or microsites (a feature available in earlier Enterprise 2.0 accounts). When used in CloudPages, it will return the value related to the user who created the CloudPage, not a value related to the user who is accessing the page from the public URL.

### Example

The following example displays the username of the Marketing Cloud user accessing the page (with an active Marketing Cloud session) on a customized page.

```html
%%[

var @UserName

set @UserName = AuthenticatedEmployeeUserName()

]%%
<p>Hello %%=v(@UserName)=%%,</p>
```

#### Output

The function returns the username associated with the Marketing Cloud user account (see note).

```html
<p>Hello Sam,</p>
```