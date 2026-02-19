---
title: "Best Practice: Dynamic Content Area Paths"
---

## best-practices-dynamic-content-area-paths

Dynamically constructing the path to a Content Area is a best practice that allows for greater flexibility and maintainability in personalized emails. This approach enables the selection of content based on subscriber attributes or other data, without hardcoding content area IDs or names.

### Arguments

This is a conceptual best practice and not a function, so it does not have arguments.

> NOTE: This technique is used within email content to dynamically pull in different content blocks based on defined logic.

### Example 1: Basic Use

This example demonstrates how to dynamically display a content block based on a subscriber's preferred language. The `ContentAreaByName` function is used with a dynamically constructed path.

```html
%%[

/* Set the subscriber's preferred language */
var @lang
set @lang = AttributeValue("language") /* language is a profile attribute */

/* Set a default language if the subscriber's preference is not available */
if empty(@lang) then
  set @lang = "en"
endif

/* Dynamically construct the content area path */
var @contentPath
set @contentPath = Concat("my-contents/", @lang, "/header")

]%% %%=ContentAreaByName(@contentPath)=%%
```

### Example 2: Advanced Scenario

This example shows how to select a promotional offer based on a subscriber's loyalty status and region. It combines multiple attributes to create a highly specific content path.

```html
%%[

/* Retrieve subscriber attributes */
var @loyaltyStatus, @region
set @loyaltyStatus = AttributeValue("loyaltyStatus")
set @region = AttributeValue("region")

/* Set default values to ensure content is always displayed */
if not empty(@loyaltyStatus) and not empty(@region) then

  /* Construct the dynamic path to the content area */
  var @offerPath
  set @offerPath = Concat("my-offers/", @region, "/", @loyaltyStatus)

else

  /* Fallback to a generic offer if attributes are missing */
  set @offerPath = "my-offers/generic-offer"

endif

]%% %%=ContentAreaByName(@offerPath)=%%
```