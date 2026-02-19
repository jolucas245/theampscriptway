---
title: "EndImpressionRegion"
---


This function marks the end of a previously defined Impression Region set with the [BeginImpressionRegion](/beginimpressionregion) function. It has no output.

### Argument

`EndImpressionRegion(1)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | Boolean | False | Scope of regions closed by the function. A value of `True` closes all previous Impression Regions. A value of `False` closes only the preceding Impression Region. The default value is `False.` |

### Example

```html
%%=BeginImpressionRegion("PrimaryNavigation")=%%

<a href="https://limedash.com/shop" alias="Shop">Shop</a> |
<a href="https://limedash.com/contact" alias="Contact">Contact</a>

%%=EndImpressionRegion(0)=%%
```