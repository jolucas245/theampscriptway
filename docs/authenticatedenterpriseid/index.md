---
title: "AuthenticatedEnterpriseID"
---


This function returns the enterprise identifier of Marketing Cloud account (the MID of the Parent Business Unit, or ‘EID’).

### Arguments

`AuthenticatedEnterpriseID()`

This function does not accept any arguments.

### Example

The following example displays the enterprise identifier of the Marketing Cloud account on a customized page.

```html
%%[

var @EnterpriseID

set @EnterpriseID = AuthenticatedEnterpriseID()

]%%
<p>The Parent MID is %%=v(@EnterpriseID)=%%.</p>
```

#### Output

The function returns the Parent MID of the Marketing Cloud user account.

```html
<p>The Parent MID is 10987654.</p>
```