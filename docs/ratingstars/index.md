---
title: "RatingStars"
---


This function generates a rating star image, based on a rating attribute of the recommended product.

### Arguments

`RatingStars(1,2,3)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | Number | True | The highest ranking to display |
| 2 | String | True | Star color as html hex code or color name |
| 3 | Number | True | Size and width of star in pixels |

### Example

When used in conjunction with [Einstein Email Recommendations Code](https://help.salesforce.com/articleView?id=mc_pb_insert_einstein_email_recommendations.htm&type=5), the following example will generate a rating star image in the context of the recommended product.

```html
%%=RatingStars(5, "yellow", 25)=%%
```

#### Output

This function will return an `img` element with a `src` attribute set as the URL of the generated image.