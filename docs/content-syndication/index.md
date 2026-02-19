--- 
title: "Content Syndication"
---


Content syndication enables content from external, publicly accessible HTTP sources to be included in emails and landing pages. This feature is not a single function, but a mechanism that is invoked through a special syntax in a content area.

### Arguments

Content syndication does not have arguments in the same way as a typical AMPscript function. Instead, it uses a special syntax to retrieve content from a URL.

| Ordinal | Type | Required | Description |
|---|---|---|---|
| 1 | URL | Yes | The URL from which to retrieve the content. This can be a static URL or a URL built dynamically with AMPscript. |

> NOTE: Content syndication only works in emails and landing pages. It is recommended to limit the number of content syndication occurrences to three or less per email to avoid performance issues.

### Example 1: Basic Use

This example demonstrates how to retrieve content from a static URL and display it in an email.

```html
%%[ 

/* Treat the content from the URL as a content area */ 
TreatAsContent(HTTPGet("http://www.example.com/content.html")) 

]%%
```

### Example 2: Advanced Scenario

This example demonstrates how to build a dynamic URL for content syndication using a subscriber attribute and then retrieve and display the content.

```html
%%[ 

/* Declare and set variables */ 
var @subscriberKey, @url
SET @subscriberKey = AttributeValue("SubscriberKey")

/* Build the dynamic URL */ 
SET @url = Concat("http://www.example.com/content?id=", @subscriberKey)

/* Check if the URL is not empty before retrieving content */ 
if not empty(@url) then

  /* Treat the content from the URL as a content area */ 
  TreatAsContent(HTTPGet(@url))

endif 

]%%
```