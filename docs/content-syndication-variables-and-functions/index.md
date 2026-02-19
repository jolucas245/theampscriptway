---
title: "Content Syndication: Variables And Functions"
---


This entry clarifies the behavior and limitations regarding the use of AMPscript variables and inline functions within syndicated content URLs in Salesforce Marketing Cloud. It is important to note that `content-syndication-variables-and-functions` is not a standalone AMPscript function, but rather a descriptive term for a specific constraint within the platform.

When working with syndicated content, which typically involves fetching content from external, publicly accessible HTTP sources, AMPscript variables and inline functions are **not supported** directly within the syndicated content URLs. The URL provided for syndicated content must be a constant string.

### Arguments

| Ordinal | Type | Required | Description |
|---|---|---|---|
| N/A | N/A | N/A | This is not a function and therefore does not accept arguments. |

> NOTE: AMPscript variables and inline functions cannot be used within the URL specified for syndicated content. The URL must be a static value.

### Example 1: Incorrect Use (Will Not Work)

This example demonstrates an **incorrect** attempt to use an AMPscript variable within a syndicated content URL. This approach will fail because the platform does not process AMPscript within the syndicated content URL itself.

```html
/* Define a variable for a dynamic part of the URL */
VAR @dynamicPath
SET @dynamicPath = "my-dynamic-content"

/* Attempt to use the variable in a syndicated content URL - THIS WILL FAIL */
/* The platform expects a static URL for content syndication */
SET @syndicatedContent = ContentBlockByUrl(Concat("https://example.com/syndicated/", @dynamicPath, "/article.html"))

/* Outputting the content (will likely be empty or error) */
IF NOT EMPTY(@syndicatedContent) THEN
    Output(@syndicatedContent)
ELSE
    OutputLine("<!-- Error: Syndicated content could not be retrieved. -->")
ENDIF
```

### Example 2: Correct Approach for Syndicated Content

This example illustrates the **correct** way to use syndicated content. The URL provided to `ContentBlockByUrl` (or similar functions for content syndication) must be a static, constant string. If dynamic content is required, it should be handled *within* the syndicated content itself, or the entire URL should be determined and passed as a static string.

```html
/* Define the static URL for the syndicated content */
/* This URL must be constant and not contain AMPscript variables or functions */
VAR @staticSyndicatedUrl
SET @staticSyndicatedUrl = "https://example.com/syndicated/static-content/article.html"

/* Retrieve the syndicated content using the static URL */
VAR @syndicatedContent
SET @syndicatedContent = ContentBlockByUrl(@staticSyndicatedUrl)

/* Check if content was retrieved successfully and output it */
IF NOT EMPTY(@syndicatedContent) THEN
    Output(@syndicatedContent)
ELSE
    /* Provide a fallback or error message if content is not available */
    OutputLine("<!-- Syndicated content is currently unavailable. Please try again later. -->")
ENDIF

/* If dynamic content is needed, it should be managed within the external syndicated source */
/* For example, the external URL could point to a server-side script that generates dynamic content */
/* Or, if the URL itself needs to be dynamic, it must be fully resolved before being passed to ContentBlockByUrl */
/* For instance, if you have a lookup that returns a full, static URL: */
/* VAR @dynamicFullUrl */
/* SET @dynamicFullUrl = Lookup("MyUrlsDataExtension", "FullUrl", "Key", "Article123") */
/* IF NOT EMPTY(@dynamicFullUrl) THEN */
/*     SET @syndicatedContent = ContentBlockByUrl(@dynamicFullUrl) */
/* ENDIF */
```