---
title: "GetSocialPublishUrlByName"
---


This function returns HTML for sharing a predefined region of content using a social network name found in the table below. When a recipient clicks on a social link defined by this function, they are directed to the social network and the default content to be shared is the Marketing Cloud landing page that contains the content defined in the predefined content region.

### Arguments

`GetSocialPublishURLByName(1,2,[3a,3b]...)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | Name of the social network (see below) |
| 2 | String | True | Name of the predefined content region to share on the social network |
| 3a | String | False | Optional parameter name specific to the selected social network (see note) |
| 3a | String | False | Optional parameter value specific to the selected social network (see note) |

> NOTE: Additional pairs of columns and values can be appended as arguments.

Valid social network names are as follows:

| Social Network |
| --- |
| Del.icio.us |
| Digg |
| Facebook |
| Google |
| Google+ |
| LinkedIn |
| Microsoft |
| MySpace |
| ShareThis |
| StumbleUpon |
| Twitter |
| Yahoo |

In the following example, content is surrounded by a social content slot and then referenced in the function as the content to share:

### Example

```html
<!-- RegionStart[contentslot:"limedash-loyalty", title:"Join the Limedash Loyalty Program Today"] -->
Join the <a href="https://limedash.com/join">Limedash</a> Loyalty Program Today!
<!-- RegionEnd[contentslot:"limedash-loyalty"] -->

<br><br><a href="%%=GetSocialPublishURL('Facebook','limedash-loyalty')=%%">Share on Facebook</a>
<br><a href="%%=GetSocialPublishURL('Twitter','limedash-loyalty')=%%">Share on Twitter</a>
```

#### Output

```html
<!-- RegionStart[contentslot:"limedash-loyalty", title:"Join the Limedash Loyalty Program Today"] -->
Join the <a href="http://cl.S7.exct.net/?qs=69824b638bd8e36e7f8594ea85ce01efac0641753cd0b6cb51f33e9b009c6e8ec48662ad22858410655d420eba31bbd3">Limedash</a> Loyalty Program Today!
<!-- RegionEnd[contentslot:"limedash-loyalty"] -->

<br><br><a href="http://pages.S7.exacttarget.com/Publish.aspx?qs=71b8883ce06d4a85ee3a3b44ed76c8255d6095655ba67d40656454bab98292855b79ce4567eb1c47b7fe3482668b1c3f3c876a93d3f53d09741fa5c97cb7110b4fd57bdee8261b3c71f741224aeb0fd57a5ca8457f867872046a2c87a4f844e987a19b2d74a6a712f0e5b62682e6e86fea665dfa0d2e2de7">Share on Facebook</a>
<br><a href="http://pages.S7.exacttarget.com/Publish.aspx?qs=71b8883ce06d4a85ee3a3b44ed76c8255d6095655ba67d40656454bab9829285ede778d2f596ba9812d21883826ec05006a8c8824a62794e7938ee0c5e76bdde24b8b6d61b79d6a00bacc6758e4926f1d4a534c9be67e6dfa15aa03ce73f5fb5049e51aa521c73d7ca847372758ab27f8c62016d4998f90e">Share on Twitter</a>
```