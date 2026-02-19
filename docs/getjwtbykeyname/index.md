---
title: "GetJWTByKeyName"
---

by [Adam Spriggs](https://ampscript.guide/author/adam/ "Posts by Adam Spriggs") | Jun 12, 2022 | [Book](https://ampscript.guide/category/book/) |


This function creates a JSON Web Token (JWT) of a JSON formatted payload. The function is similar to [GetJWT](/getjwt), but the secret is retrieved from Key Management, instead of being defined as a function argument.

Refer to [GetJWT](/getjwt) for information on JSON Web Tokens.

### Arguments

`GetJWTByKeyName(1,2,3)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | External Key of a Symmetric key created in [Key Management](https://help.salesforce.com/articleView?id=mc_overview_key_management.htm). External keys are only available within the same Business Unit (MID) and are not shared across other Business Units. |
| 2 | String | True | Hash algorithm used to encrypt the signature. Valid values are `HS256`, `HS384`, or `HS512`. |
| 3 | String | True | The payload string to encode (typically in JSON format) |

> TIP: Ensure that access to Key Management is limited to individuals who are responsible for managing security keys as part of their role.

### Example

```html
%%[
var @json, @jwt

set @json = '{
  "ContactKey": "00Q6F00001APnymUAD",
  "FirstName": "Samantha",
  "LastName": "Smith",
  "Email": "samantha@limedash.com"
}'
set @jwt = GetJWTByKeyName('JWT_KEY', 'HS256', @json)

]%%

JWT: %%=v(@jwt)=%%
```

#### Output

```html
JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ew0KICAiQ29udGFjdEtleSI6ICIwMFE2RjAwMDAxQVBueW1VQUQiLA0KICAiRmlyc3ROYW1lIjogIlNhbWFudGhhIiwNCiAgIkxhc3ROYW1lIjogIlNtaXRoIiwNCiAgIkVtYWlsIjogInNhbWFudGhhQGxpbWVkYXNoLmNvbSINCn0.QJw_GNupl6kaVf_MjlIWaykIOA9Z4pu_wPx4dvZGXzk
```