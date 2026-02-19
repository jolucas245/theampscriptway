---
title: "Image"
---


Returns an `<img>` tag with the `src` attribute populated with the path to an image from your Portfolio. The `<img>` tag also includes the `title` and `alt` attributes from the image in your Portfolio, a `border` attribute set to `0`, and a `thid` attribute that contains the ID of the image in the Portfolio.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | Yes | The external key of an image in your Portfolio. |
| 2 | String | No | The external key of a fallback image in your Portfolio. This image is used if the image specified in the first argument can't be found. |

> NOTE: This function returns a complete `<img>` tag. To add or modify attributes, such as `width` or `height`, you must use the `Replace()` function.

### Example 1: Basic Use

This example shows how to display an image using its external key.

```html
%%[

  /* Set the external key of the image to display */
  VAR @imageKey
  SET @imageKey = "my_image"

  /* Display the image */
  IF NOT EMPTY(@imageKey) THEN
    output(concat("Your image is: ", Image(@imageKey)))
  ELSE
    output(concat("Image key is empty."))
  ENDIF

]%%
```

### Example 2: Advanced Scenario

This example shows how to display an image and add `width` and `height` attributes to the `<img>` tag.

```html
%%[

  /* Set the external key of the image to display */
  VAR @imageKey, @imgTag, @modifiedImgTag
  SET @imageKey = "my_image"

  /* Check if the image key is not empty */
  IF NOT EMPTY(@imageKey) THEN

    /* Get the image tag */
    SET @imgTag = Image(@imageKey)

    /* Add width and height attributes to the image tag */
    SET @modifiedImgTag = Replace(@imgTag, ' src', ' width="200" height="100" src')

    /* Display the modified image tag */
    output(concat("Your modified image is: ", @modifiedImgTag))

  ELSE

    output(concat("Image key is empty."))

  ENDIF

]%%
```