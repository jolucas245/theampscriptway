---
title: "Length"
---


This function returns the number of characters in the specified string.

### Argument

`Length(1)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | String to measure |

### Example

```html
%%[

var @terms, @termsBlurb, @len, @max

set @max = 105

set @terms = AttributeValue("terms") /* value from attribute or DE column in send context */
set @terms = "" /* or a literal value */
set @terms = concat(@terms, "The Rewards program is intended for personal use only. ")
set @terms = concat(@terms, "Commercial use is prohibited. This program is not targeted towards, ")
set @terms = concat(@terms, "nor intended for use by, anyone under the age of 13. ")
set @terms = concat(@terms, "If you are between the ages of 13 and 18, you may only use Rewards ")
set @terms = concat(@terms, "under the supervision of a parent or legal guardian who agrees to ")
set @terms = concat(@terms, "be bound by these Terms of Use.")

set @termsBlurb = @terms

set @len = length(@terms)

if @len > @max then
  set @termsBlurb = concat(trim(substring(@terms, 1, @max)), "...")
endif

]%%
terms: %%=v(@terms)=%%
<br>len: %%=v(@len)=%%
<br>termsBlurb: %%=v(@termsBlurb)=%%
```

#### Output

```html
terms: The Rewards program is intended for personal use only. Commercial use is prohibited. This program is not targeted towards, nor intended for use by, anyone under the age of 13. If you are between the ages of 13 and 18, you may only use Rewards under the supervision of a parent or legal guardian who agrees to be bound by these Terms of Use.
len: 340
termsBlurb: The Rewards program is intended for personal use only. Commercial use is prohibited. This program is not...
```