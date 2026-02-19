---
title: "Best Practice: Shared Content Areas"
---

## Shared Content Areas

Shared Content Areas in Marketing Cloud allow you to store reusable content blocks that can be referenced across multiple Business Units in an Enterprise 2.0 account. When combined with AMPscript, they enable a powerful pattern for centralizing and dynamically including content.

### Why Use Shared Content Areas?

In multi-Business Unit environments, maintaining consistent headers, footers, legal disclaimers, and branding across all BUs is essential. Shared Content Areas (or Shared Content Builder folders) solve this by storing content centrally in the Parent BU.

### Example 1: Referencing a Shared Content Block by Key

Use `ContentBlockByKey()` to reference a content block stored in a Shared Content folder.

```html
%%[
/* Reference a shared header stored in the Parent BU's Content Builder */
/* The content block's Customer Key must be unique across the enterprise */
]%%

%%=ContentBlockByKey("shared-email-header")=%%

<!-- Email body content here -->

%%=ContentBlockByKey("shared-email-footer")=%%
```

### Example 2: Dynamic Shared Content with a Fallback

This example attempts to load a shared content block and provides fallback content if it fails (e.g., if the block is missing or inaccessible).

```html
%%[

VAR @headerContent

/* Attempt to load the shared header with TreatAsContent */
SET @headerContent = TreatAsContent(ContentBlockByKey("shared-promo-banner"))

IF EMPTY(@headerContent) THEN
  SET @headerContent = "<div style='background:#003366;color:#fff;padding:15px;text-align:center;'>Welcome!</div>"
ENDIF

]%%

%%=v(@headerContent)=%%
```

> NOTE: In Enterprise 2.0 accounts, content must be placed in a **Shared Content** folder within Content Builder to be accessible by child Business Units. Ensure the content block's Customer Key is unique across the entire enterprise.

> NOTE: When using `ContentBlockByKey()` or `ContentBlockByName()` with shared content, the AMPscript call is executed in the context of the sending Business Unit. If the shared content itself contains AMPscript (e.g., `LookupRows`), that code will execute against the sending BU's data extensions, not the Parent BU's.
