---
title: "Best Practice: Dynamic Content Area Paths"
---

Dynamically constructing the path to a Content Area allows for greater flexibility and maintainability in personalised emails. Rather than hardcoding a content area name or ID, you build the path at render time from subscriber attributes or other data, allowing a single code block to serve many different content variations.

This technique relies on the `ContentAreaByName()` function, which accepts a dynamically constructed string as its argument.

> NOTE: Content Areas referenced via this pattern must exist in the account before send time. If the constructed path does not match an existing Content Area, the function returns an empty string. Always include a fallback to handle missing or unexpected attribute values.

### Example 1: Language-Based Content Selection

This example selects a header block from a folder structure based on the subscriber's preferred language. If no language attribute is set, it defaults to English.

```html
%%[
VAR @lang, @contentPath

SET @lang = AttributeValue("language")

IF EMPTY(@lang) THEN
  SET @lang = "en"
ENDIF

SET @contentPath = Concat("my-contents/", @lang, "/header")
]%%
%%=ContentAreaByName(@contentPath)=%%
```

### Example 2: Region and Loyalty Tier Offer Selection

This example constructs a path from two attributes — region and loyalty status — to select a targeted promotional offer block. A generic fallback is used when either attribute is missing.

```html
%%[
VAR @loyaltyStatus, @region, @offerPath

SET @loyaltyStatus = AttributeValue("loyaltyStatus")
SET @region = AttributeValue("region")

IF NOT EMPTY(@loyaltyStatus) AND NOT EMPTY(@region) THEN
  SET @offerPath = Concat("my-offers/", @region, "/", @loyaltyStatus)
ELSE
  SET @offerPath = "my-offers/generic-offer"
ENDIF
]%%
%%=ContentAreaByName(@offerPath)=%%
```