---
title: "Best Practices For Caching"
---

## Best Practices: Caching in AMPscript

Caching is a fundamental concept in Salesforce Marketing Cloud that significantly impacts the performance and behavior of your emails and CloudPages.

### 1. Data Extension Caching

Marketing Cloud employs a caching mechanism for Data Extensions to improve send performance.

**How it works:**

- For large Data Extensions (typically >1000 rows), the system may cache the data to speed up processing.
- For smaller Data Extensions, the system is more likely to fetch the live data at send time.

**Best Practices:**

- **Be aware of caching during testing:** If you are testing with a small Data Extension and not seeing your data updates reflected, it might be due to caching.
- **Use separate Data Extensions for testing:** Always use a separate Data Extension for your testing and development.
- **Force a refresh:** Try adding a few dummy rows to your Data Extension to increase its size and force a cache refresh.

### 2. Content Block Caching

Content blocks are also cached to improve performance.

**How it works:**

- When a triggered send is published or a CloudPage is saved, the content of any referenced content blocks is cached.
- Subsequent sends or page loads will use the cached version of the content block.

**Best Practices:**

- **Republish to refresh:** To see your changes to a content block reflected, you must pause and republish the triggered send, or re-save the CloudPage.
- **Use `ContentBlockByID()` with caution:** Be aware that this function will retrieve the cached version of the content block.

### 3. Caching External Content with `Before;HTTPGet`

The `Before;HTTPGet` command is the most efficient way to cache external content for a send.

**Best Practices:**

- **Use for non-personalized content:** This method is ideal for content that is the same for everyone.
- **Avoid for personalized content:** If you need to fetch personalized content for each subscriber, you must use the `HTTPGet()` function.

By understanding these caching behaviors, you can develop more efficiently in Marketing Cloud and avoid common frustrations.
