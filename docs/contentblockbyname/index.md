---
title: "ContentBlockByName"
---


The `contentblockbyname` function retrieves and displays content from a specified Content Builder block. It allows for dynamic content rendering within emails, landing pages, and other Marketing Cloud assets by referencing the block's full name, including its path.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | Yes | The full path and name of the Content Builder block to retrieve. For example, `Content Builder\\My Folder\\My Content Block`. |
| 2 | String | No | The name of an impression region to associate with the content block for tracking purposes. |
| 3 | Boolean | No | A boolean value that determines whether an error is thrown if the content block is not found. Defaults to `true`. If set to `false`, the function will not throw an error. |
| 4 | String | No | A fallback message to display if the content block cannot be retrieved. |
| 5 | Number | No | A status code that indicates the outcome of the function call. `0` means success, while `-1` indicates failure. |

> NOTE: This function only works for content stored in Content Builder. For content in Classic Content, use the `ContentAreaByName()` function.

### Example 1: Basic Use

This example demonstrates how to retrieve a simple content block and display it. A check is included to ensure the content block is not empty before rendering.

```html
%%[

/* Set the name of the content block to retrieve */
SET @contentBlockName = "Content Builder\\Weekly Portfolio"

/* Retrieve the content block */
SET @contentBlock = ContentBlockByName(@contentBlockName)

/* Check if the content block is not empty before displaying */
IF NOT EMPTY(@contentBlock) THEN

]%%

  %%=v(@contentBlock)=%%

%%[

ELSE

  /* Fallback content if the block is empty or not found */
  <p>We're sorry, the content you're looking for is currently unavailable.</p>

ENDIF

]%%
```

### Example 2: Advanced Scenario with Impression Tracking and Error Handling

This example shows how to use `contentblockbyname` with impression tracking and error handling. It attempts to retrieve a content block, creates an impression region, and provides a fallback message if the block is not found.

```html
%%[

/* Declare variables */
VAR @contentBlockName, @impressionRegion, @contentBlock, @statusCode

/* Set the names for the content block and impression region */
SET @contentBlockName = "Content Builder\\Product Recommendations"
SET @impressionRegion = "ProductRecs_Email"

/* Attempt to retrieve the content block with error handling */
SET @contentBlock = ContentBlockByName(@contentBlockName, @impressionRegion, false, "<p>Product recommendations are not available at this time.</p>", @statusCode)

/* Check the status code to confirm if the block was retrieved successfully */
IF @statusCode == 0 THEN

  /* Begin the impression region for tracking */
  BeginImpressionRegion(@impressionRegion)

]%%

  %%=v(@contentBlock)=%%

%%[

  /* End the impression region */
  EndImpressionRegion()

ELSE

  /* Display the fallback message if the block was not found */
  %%=v(@contentBlock)=%%

ENDIF

]%%
```