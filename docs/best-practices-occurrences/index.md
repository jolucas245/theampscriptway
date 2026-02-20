---
title: "Best Practice: Occurrences"
---

When using content syndication or `HTTPGet` calls in an email, each occurrence triggers an outbound HTTP request during the send job. Excessive occurrences within a single email can degrade send performance and increase latency for every subscriber in the audience.

### Recommendations

Limit the number of content syndication occurrences to **three or fewer** per email. More occurrences may negatively impact email job send speed or landing page response time. If more than three external content calls are required, consider consolidating the data into a single endpoint that returns all required content in one response, which can then be parsed with AMPscript or SSJS.

Each `%%HTTPGet%%` tag or inline `HTTPGet()` function call in the body of an email counts as one occurrence. The `Before;HTTPGet` and `After;HTTPGet` directives do not count toward the per-subscriber occurrence limit, as they fire at the job level rather than per message.

### Example: Consolidating Multiple Calls Into One

Instead of making three separate calls to fetch different content blocks, combine the data into a single API endpoint and parse the response.

```html
%%[
VAR @url, @response, @status

/* Single call to a consolidated endpoint instead of three separate calls */
SET @url = Concat(
  "https://www.example.com/api/email-content?subscriber=",
  AttributeValue("SubscriberKey")
)

SET @response = HTTPGet(@url, FALSE, 0, @status)

/* Check that the request succeeded before outputting content */
IF @status == 0 AND NOT EMPTY(@response) THEN
  SET @content = TreatAsContent(@response)
ENDIF
]%%
```