---
title: "After HTTPGet Command"
---

The `After;HTTPGet` command is a special directive used in AMPscript that sends an HTTP GET request to a specified URL **after** an email send job completes. Unlike the standard `HTTPGet` function, this command produces no output in the email body. It is primarily used as a post-send webhook to notify an external system that an email campaign has finished sending.

### Arguments

| Ordinal | Type   | Required | Description                                         |
|---------|--------|----------|-----------------------------------------------------|
| 1       | String | Yes      | The URL to which the HTTP GET request is sent after the email send completes. |

> NOTE: This command cannot be used with triggered email sends. A triggered send job does not have a defined end point after which the command could fire, so the request will never execute.

> NOTE: This command fires once at the end of the entire send job, not once per subscriber. It is not subscriber-aware and should not be used to track individual delivery events. For subscriber-level tracking, use the standard `HTTPGet` function instead.

> NOTE: The `After;HTTPGet` command ignores the empty-content flag. Any semicolon-delimited flag appended to the command has no effect.

### Example 1: Basic Use

This example fires a webhook to notify an external system after the email campaign finishes sending.

```html
%%After;HTTPGet "https://www.example.com/webhook/send-complete"%%
```

### Example 2: Notifying an External System with a Campaign Identifier

This example builds a dynamic URL using an AMPscript variable set earlier in the content to pass a campaign identifier to the webhook endpoint.

```html
%%[
VAR @campaignId, @webhookUrl

SET @campaignId = "SUMMER2026"
SET @webhookUrl = Concat("https://www.example.com/webhook/complete?campaign=", @campaignId)
]%%

%%After;HTTPGet "@webhookUrl"%%
```

> NOTE: When passing a variable as the URL argument, the variable name is referenced as a string literal within the quotes. Marketing Cloud resolves the variable value before executing the command.