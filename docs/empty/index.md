---
title: "Empty"
---


This function provides a conditional evaluation of an expression. If the expression evaluates as `null` or empty, the function will output `true`, otherwise it will output `false`.

### Argument

`Empty(1)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | An attribute, variable or nested function to evaluate |

### Example

The following example evaluates the MemberId attribute. If the attribute field is empty, then the function will evaluate to `true`.

```html
%%[

var @memberId, @nonMember

set @memberId = MemberId

if empty(@memberId) then
  set @displayMemberId = "You are not a member"
else
  set @displayMemberId = Concat("Your member id is ",@memberId)
endif

]%%
<p>%%=v(@displayMemberId)=%%.</p>
```

#### Output

For records without a MemberId attribute value, the following string will be displayed.

```html
<p>You are not a member</p>
```