---
title: "Content Syndication Best Practices"
---

As the [content syndication](/content-syndication) feature executes external HTTP requests during a send, there are performance and reliability implications when the feature is used without care. You should consider the following guidelines when using content syndication.

### Occurrences

Limit the number of content syndication occurrences to three or fewer per email. More occurrences may impact email job send speed or landing page response time. If your design requires more external content blocks, consolidate them into a single endpoint that returns all required data in one response.

### Caching

Content syndication results can be cached for the duration of a send job using the `Before;HTTPGet` directive. When a URL is prefixed with `Before;`, Marketing Cloud fetches the content once at the start of the send and reuses the cached response for every subscriber in the audience. This approach significantly reduces the total number of outbound HTTP requests and is recommended for content that is the same for all subscribers, such as promotional banners, product listings, or header images.

```html
%%Before;HTTPGet "https://www.example.com/promo-banner.html"%%
```

For subscriber-specific content, caching is not appropriate. Use a standard inline `HTTPGet()` call so that a unique request is made per subscriber.

### Audience Size

For large sends, subscriber-level `HTTPGet` calls multiply quickly. An email sent to 500,000 subscribers with a single inline `HTTPGet` call results in up to 500,000 individual HTTP requests to your external server. Ensure that your endpoint infrastructure can handle the expected request volume before deploying content syndication at scale.

As a guideline:

- Use `Before;HTTPGet` for content that is identical for all subscribers.
- Use inline `HTTPGet()` only when the content must be personalised per subscriber.
- Test your endpoint under load before sending to large audiences.
- Monitor your server response times during sends and set appropriate timeouts on the endpoint side.

### Response Time

Marketing Cloud will time out if the external server does not respond quickly enough. Slow responses can cause individual subscriber emails to fail or be skipped. Keep endpoint response times well under the platform timeout threshold and use caching or a CDN where possible to reduce latency.