---
title: "ContentImageByKey"
---


This function returns an HTML `img` tag with the specified Content Builder image. It also sets the `title`, `alt`, `border` and `thid` attributes on the `img` tag. The `title` and `alt` values are set to the name of the image as defined in Content Builder. The `border` is set to `0` in all circumstances. The `thid` is a proprietary Marketing Cloud attribute that contains the ID of the specified image in Content Builder.

### Arguments

`ContentImageByKey(1,2)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | Customer/External Key value of the image to return |
| 2 | String | True | Customer/External Key value of the image to return if the image for the specified Customer/External Key is not found |

> NOTE: The ID for the image can be found in the Properties menu, accessible from the drop-down menu on the right-hand side of the Content Builder asset listing page.
>
> NOTE: This function will only return Content Builder assets that are images. It will *not* return Image Block from Content Builder.

### Example 1

```html
%%[

var @imageKey, @imageKeyFallBack, @imageTag
set @imageKey = "limedash-logo-green" /* id: 5940  */
set @imageKeyFallBack = "limedash-logo-gray" /* id: 5941 */

set @imageTag = ContentImageByKey(@imageKey, @imageKeyFallBack)

]%%
<a href="https://limedash.com">
%%=v(@imageTag)=%%
</a>
```

#### Output

```html
<a href="https://limedash.com">
<img title="limedash-logo-green" alt="limedash-logo-green" src="https://image.S7.exacttarget.com/lib/fe9213727567077b7d/m/1/087ae025-7205-4121-8d5c-366f4a3dc117.png" border="0" thid="5940">
</a>
```

### Example 2

This example illustrates the output when the specified Customer/External Key does not exist and the fallback image is returned:

```html
%%[

var @imageKey, @imageKeyFallBack, @imageTag
set @imageKey = "limedash-logo-pink" /* does not exist */
set @imageKeyFallBack = "limedash-logo-gray" /* id: 5941 */

set @imageTag = ContentImageByKey(@imageKey, @imageKeyFallBack)

]%%
<a href="https://limedash.com">
%%=v(@imageTag)=%%
</a>
```

#### Output

```html
<a href="https://limedash.com">
<img title="limedash-logo-gray" alt="limedash-logo-gray" src="https://image.S7.exacttarget.com/lib/fe9213727567077b7d/m/1/8aabd3b9-cf2a-4d41-a56b-bec76e2efd54.png" border=0 thid="5941">
</a>
```