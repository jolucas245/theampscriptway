---
title: "IsPhoneNumber"
---


This function confirms whether or not a value is a valid US phone number. The function returns `true` if the syntax is valid or `false` if it’s not. Any non-numeric characters are ignored on evaluation.

Sample phone number strings and their resulting evaluation by the function are provided below.

| Phone Number | Result |
| --- | --- |
| 234-235-5678 | `true` |
| 234 235 5678 | `true` |
| (541) 754-3010 | `true` |
| +1-541-754-3010 | `false` |
| 1234567890 | `false` |

### Argument

`IsPhoneNumber(1)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | Phone number to validate |

> NOTE: This function will only validate US phone numbers. Other country formats will return a `false` result.

### Example

When a landing page form is submitted, an `phone` form field is validated and an alert message is displayed if the syntax is invalid.

```html
%%=Iif(IsPhoneNumber(RequestParameter('phone'))==false,'<div class="alert">You have entered an invalid US phone number</div>','')=%%
```

#### Output

A value of `0402 123 456` will return the following output.

```html
<div class="alert">You have entered an invalid US phone number</div>
```