---
title: "RedirectTo"
---


The `RedirectTo` function is used within AMPscript to create a clickable hyperlink that redirects users to a specified URL. This function is particularly useful when the target URL is dynamic, stored in a data extension, or held within a variable, allowing for personalized and tracked links in email communications.

### Arguments

| Ordinal | Type   | Required | Description                                     |
|---------|--------|----------|-------------------------------------------------|
| 1       | String | Yes      | The URL string to which the user will be redirected. |

> NOTE: This function is primarily designed for use within the `href` attribute of an `<a>` HTML tag in HTML emails. When used in text-based emails, ensure the URL includes the `http://` or `https://` prefix and contains no spaces within the parentheses. For proper click tracking, the `<a>...</a>` anchor tags should be present within the email body, not solely within the URL retrieved by this function.

### Example 1: Basic Use

This example demonstrates how to use `RedirectTo` with a static URL.

```html
%%[VAR @myURL]
SET @myURL = "https://www.example.com/landing-page"

/* Check if the URL is not empty before creating the link */
IF NOT EMPTY(@myURL) THEN
    /* Create a clickable link that redirects to the specified URL */
    /* The RedirectTo function ensures proper URL encoding and tracking */
    Output(Concat('<a href="', RedirectTo(@myURL), '">Visit Our Website</a>'))
ELSE
    /* Provide a fallback or handle the error if the URL is empty */
    Output(Concat('<span>Website link not available.</span>'))
ENDIF
]%%
```

### Example 2: Dynamic URL from a Data Extension

This example shows how to retrieve a dynamic URL from a Data Extension and use `RedirectTo` to create a personalized link.

Assume a Data Extension named `ProductLinks` with columns `ProductID` and `ProductURL`.

```html
%%[VAR @productID, @productURL, @lookupRows, @row, @i]

SET @productID = AttributeValue("ProductID") /* Get ProductID from subscriber attribute */

/* Look up the ProductURL from the ProductLinks Data Extension */
SET @lookupRows = LookupRows("ProductLinks", "ProductID", @productID)
SET @row = Row(@lookupRows, 1)
SET @productURL = Field(@row, "ProductURL")

/* Check if a valid URL was found before creating the link */
IF NOT EMPTY(@productURL) THEN
    /* Create a personalized link for the product */
    Output(Concat('<a href="', RedirectTo(@productURL), '">View Product Details</a>'))
ELSE
    /* Handle cases where no product URL is found */
    Output(Concat('<span>Product details not available for Product ID: ', @productID, '</span>'))
ENDIF
]%%
```