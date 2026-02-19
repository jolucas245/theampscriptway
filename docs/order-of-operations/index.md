---
title: "Order Of Operations"
---


Like other scripting languages, AMPscript is interpreted from top to bottom, which means that variables have to be declared and set before they can be used. However, email components are interpreted in the following order:

1. Preheader
2. HTML body
3. Text body
4. Subject line

For example, a variable can be declared and set in an HTML body (within an AMPscript block), then used in a subject line:

```html
<!--Appears in Body-->
%%[

var @subjectLine

if AttributeValue('Member Status') == 'VIP' then
  set @subjectLine = 'An exclusive offer for VIP members'
else
  set @subjectLine = 'A special offer for our members'
endif

]%%

<!--Appears in Subject Line-->
%%=v(@subjectLine)=%%
```

> NOTE: Nested AMPscript functions and nested variables will not be processed in subject lines from February 21, 2023. Refer to [this help document](https://help.salesforce.com/s/articleView?id=000364408&type=1) for more information on this change.