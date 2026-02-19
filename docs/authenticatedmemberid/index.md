---
title: "AuthenticatedMemberID"
---


This function returns the MID of the Marketing Cloud account, based on the context of the authenticated user’s session. This is useful when creating customized pages for child Business Units (a feature available in earlier Enterprise 2.0 accounts).

### Arguments

`AuthenticatedMemberID()`

This function does not accept any arguments.

> NOTE: This function will only return the correct value when used in classic landing pages or microsites (a feature available in earlier Enterprise 2.0 accounts). When used in CloudPages, it will return the MID value of the Business Unit where the page is published, not the MID value based on the context of the authenticated user accessing the published URL.
>
> TIP: You can also use the `memberid` [personalization string](/sender-data-strings) to display the related Business Unit MID of a published landing page or code resource.

### Example

The following example displays the Business Unit MID on a customized page, based on the context of the authenticated user.

```html
%%[

var @MemberID

set @MemberID = AuthenticatedMemberID()

]%%
<p>This Business Unit MID is %%=v(@MemberID)=%%.</p>
```

#### Output

The function returns the Business Unit MID based on the context of the authenticated user’s Marketing Cloud session (see note).

```html
<p>This Business Unit MID is 10987456.</p>
```