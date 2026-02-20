---
title: "Best Practices For Caching"
---

## Best Practices: Caching in AMPscript

Caching is a fundamental concept in Salesforce Marketing Cloud that significantly impacts the performance and behaviour of your emails and CloudPages.

### 1. Data Extension Caching

Marketing Cloud caches Data Extension data during a send to improve performance. This means that changes made to a Data Extension after a send job has started may not be reflected in emails sent during that job.

**Best Practices:**

- **Use separate Data Extensions for testing:** Always use a dedicated Data Extension for development and testing to avoid contaminating production data or being misled by stale cached results.
- **Be aware of caching during test sends:** If data changes are not appearing during a preview or test send, the send engine may be using a cached snapshot of the Data Extension taken at job start.

### 2. Content Block Caching

When a triggered send definition is published, Marketing Cloud caches the content of referenced content blocks. Subsequent sends use the cached version until the definition is republished.

**Best Practices:**

- **Republish to pick up changes:** To apply edits to a content block used in a triggered send, pause and republish the triggered send definition.
- **Use `ContentBlockByID()` or `ContentBlockByKey()` with awareness:** These functions return the cached version of a block at the time the send definition was published. Changes made after publishing will not appear until the definition is republished.

### 3. Caching External Content with `Before;HTTPGet`

The `Before;HTTPGet` directive is the most efficient way to cache external HTTP content for the duration of a send job. The platform fetches the URL once at the start of the send and reuses the response for every subscriber.

**Best Practices:**

- **Use for non-personalised content:** `Before;HTTPGet` is appropriate for content that is identical for all subscribers — promotional banners, product listings, static navigation blocks.
- **Use inline `HTTPGet()` for personalised content:** If the content must vary per subscriber, use a standard inline `HTTPGet()` call so that a unique request is made for each recipient.
- **Keep `Before;HTTPGet` URLs stable:** Changes to the content at the URL after the send has started will not be reflected, as the response is cached at job start.

```html
%%Before;HTTPGet "https://www.example.com/promo-banner.html"%%
```

By understanding these caching behaviours, you can develop more predictably in Marketing Cloud and avoid common testing frustrations.