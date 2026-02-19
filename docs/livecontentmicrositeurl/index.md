---
title: "LiveContentMicrositeURL"
---


This function enables integration with Live Content in Marketing Cloud. Live Content includes the following features:

* **Live Image**: compares the effectiveness of two images within email content
* **Live Offers**: dynamically renders coupon barcodes or text as an image on a landing page

While Live Offers can dynamically include a coupon image in an email, this function returns a link to view the coupon on a microsite page. This is useful when including Live Offers in SMS messages or text-only emails.

### Arguments

`LiveContentMicrositeURL(1,2)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | Content type; currently only `coupon` is supported as an argument value |
| 2 | String | True | External Key of the Live Content |

> NOTE: Only Live Offers (coupons) is currently supported by this function.

### Example

The following code is used in an SMS to generate a link for a Live Offers coupon that uses an External Key of `50percent`.

```html
Claim your 50% off coupon at: %%=LiveContentMicrositeURL('coupon', '50percent')=%%
```

#### Output

The function returns the URL of the microsite page to display the coupon.

```html
Claim your 50% off coupon at: https://pub.exacttarget.com/ux3uhhrjabc
```