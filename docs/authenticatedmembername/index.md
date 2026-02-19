---
title: "AuthenticatedMemberName"
---


This function returns the name of the Marketing Cloud user’s account, based on the context of their authenticated session. This is useful when creating customized pages for child Business Units (a feature available in earlier Enterprise 2.0 accounts).

### Arguments

`AuthenticatedMemberName()`

This function does not accept any arguments.

> NOTE: This function will only return the correct value when used in classic landing pages or microsites (a feature available in earlier Enterprise 2.0 accounts). When used in CloudPages, it will only return the value related to the user who created the CloudPage, not a value related to the user who is accessing the page from the public URL.

### Example

The following example displays the name of the Marketing Cloud user’s account on a customized page, based on the context of the authenticated user.

```html
%%[

var @MemberName

set @MemberName = AuthenticatedMemberName()

]%%
<p>Hello %%=v(@MemberName)=%%,</p>
```

#### Output

The function returns the name associated with the Marketing Cloud user account (see note).

```html
<p>Hello Sam,</p>
```