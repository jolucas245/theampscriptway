---
title: "BeginImpressionRegion"
---


This function marks the beginning of a region to be tracked within the impression tracking infrastructure. It has no output.

### Argument

`BeginImpressionRegion(1)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | Name of the Impression Region to track |

> NOTE: By default, the Impression Region name cannot be an AMPscript variable.
>
> NOTE: Impression Regions are implicitly closed at the end of the email. They can be (and typically are) closed explicitly with the [EndImpressionRegion](/endimpressionregion) function.

### Example 1

```html
%%=BeginImpressionRegion("PrimaryNavigation")=%%

<a href="https://limedash.com/shop" alias="Shop">Shop</a> |
<a href="https://limedash.com/contact" alias="Contact">Contact</a>

%%=EndImpressionRegion(0)=%%
```

### Example 2

While it is not explicitly supported, dynamically named Impression Regions can be created by forcing AMPscript to be evaluated using the [TreatAsContent](/treatascontent) function.

```html
%%=TreatAsContent(concat("%", "%=BeginImpressionRegion('", "PrimaryNavigation_", _messagecontext, "')=%", "%"))=%%

<a href="https://limedash.com/shop" alias="Shop">Shop</a> |
<a href="https://limedash.com/contact" alias="Contact">Contact</a>

%%=EndImpressionRegion(0)=%%
```