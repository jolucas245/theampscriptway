---
title: "Content Syndication: Empty Return Handling"
---


If the syndicated content URL returns empty content, the platform assumes there is no syndicated content relevant to the context of the email, and continues the email send. This behavior can be changed by appending a number delimited by a semicolon to the `HTTPGet` string.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | Numeric | No | `0` - Continues processing (default value)<br/>`1` - Stops processing the email send and returns an error<br/>`2` - Skips sending the email to the respective Subscriber for the `HTTPGet` command, or stops processing the email send and returns an error for the `Before;HTTPGet` command |

> NOTE: This flag is ignored if used with the `After;HTTPGet` command.

### Example 1: Basic Use

This example demonstrates how to stop an email send if the content URL returns an empty response.

```html
/*
  If the content at the specified URL is empty, the email send will be cancelled.
*/
%%=HTTPGet;1("https://limedash.com/content?email=[email address]")=%%
```

### Example 2: Advanced Scenario

This example demonstrates how to skip sending an email to a subscriber if the content URL returns an empty response.

```html
/*
  If the content at the specified URL is empty, the email send will be skipped for the current subscriber.
*/
%%=HTTPGet;2("https://limedash.com/content?email=[email address]")=%%
```