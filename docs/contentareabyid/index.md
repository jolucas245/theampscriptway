---
title: "ContentAreaByID"
---


> **Legacy Function:** This function is part of the classic content creation tools in Marketing Cloud and is no longer recommended for use. For current development, please use the modern `ContentBlockByID()` function, which works with Content Builder assets.

The `ContentAreaByID` function retrieves and renders content from a classic content area, based on its unique ID. This was commonly used to insert reusable content snippets into emails and landing pages.

### Syntax

`ContentAreaByID(1)`

| Ordinal | Type | Required | Description |
|---|---|---|---|
| 1 | Number | True | The unique ID of the classic content area to retrieve. |

### Example 1: Retrieving a Classic Content Area (Legacy Method)

```html
%%[

  /* This would retrieve the classic content area with the ID 12345 */

]%%

%%=ContentAreaByID(12345)=%%
```

### Modern Alternative: Using `ContentBlockByID()`

In modern Marketing Cloud development, you should use `ContentBlockByID()` to retrieve content from Content Builder.

**Step 1: Find the ID of your Content Builder block.**

You can find the ID of a content block by looking at its properties in Content Builder.

**Step 2: Use `ContentBlockByID()` in your email or CloudPage.**

```html
%%[

  VAR @contentBlockId
  SET @contentBlockId = 54321

]%%

%%=ContentBlockByID(@contentBlockId)=%%
```

By using `ContentBlockByID()`, you ensure that your code is compatible with the latest features and best practices in Marketing Cloud.
