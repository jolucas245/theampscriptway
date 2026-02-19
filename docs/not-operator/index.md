---
title: "Not Operator"
---


A `not` operator can be used to reverse the logic of a Boolean evaluation.

### Example 1

```html
%%[

var @statusTier, @amount, @freeShipping
set @statusTier = "Gold"
set @amount = 125

if @statusTier == "Gold" and not @amount > 100 then
  set @freeShipping = true
endif

]%%

<p>You %%=Iif(@freeShipping == true, "qualify","do not qualify")=%% for free shipping.</p>
```

#### Output

In the above example, the logic evaluation of the second expression is reversed, so the following output will be displayed:

```html
<p>You do not qualify for free shipping.</p>
```

### Example 2

The `not` operator can also be used to reverse the evaluation of an AMPscript function:

```html
<p>Dear %%=Iif(not Empty(FirstName), FirstName, "Member")=%%,</p>
```

#### Output

In this example, if the ‘FirstName’ attribute is not empty, then the attribute will be displayed; otherwise the constant value ‘Member’ will be displayed:

```html
<p>Dear Member,</p>
```