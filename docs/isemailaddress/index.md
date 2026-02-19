---
title: "IsEmailAddress"
---


This function confirms whether or not a value matches a valid email syntax. The function returns `true` if the syntax is valid or `false` if it’s not.

### Argument

`IsEmailAddress(1)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | Email address to validate |

> NOTE: The function only provides syntax validation. It does not indicate whether the email address is deliverable. For example, the function will not check whether an MX record exists for the domain or whether the email address is a role-based email.

### Example

When a landing page form is submitted, an `email` form field is validated and an alert message is displayed if the email value is invalid.

```html
%%=Iif(IsEmailAddress(RequestParameter('email'))==false,'<div class="alert">You have entered an invalid email address</div>','')=%%
```

#### Output

A value of `james@limedash` will return the following output.

```html
<div class="alert">You have entered an invalid email address</div>
```