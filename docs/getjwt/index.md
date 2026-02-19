---
title: "GetJWT"
---

by [Adam Spriggs](https://ampscript.guide/author/adam/ "Posts by Adam Spriggs") | Jun 12, 2022 | [Book](https://ampscript.guide/category/book/) |


This function creates a JSON Web Token (JWT) of a JSON formatted payload.

JWT, or JSON Web Token, is an open standard used to share security information between a client and a server. A JWT contains encoded JSON objects, including a set of claims (for example, JSON formatted key-value pairs). JWTs are signed using a cryptographic algorithm to ensure that the claims cannot be altered after the token is issued. Essentially, a JWT provides a method for validating that the data contained within it can be trusted.

A JWT consists of three parts:

1. A header (Base64 encoded)
2. A payload of claims (also Base64 encoded)
3. An encrypted HMAC signature

These three parts appear as a concatenated string, delimited by periods. The signature is built from all parts, so if the JWT is modified, then signature will change and it won’t match the original signature.

### Arguments

`GetJWT(1,2,3)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | Secret as string value |
| 2 | String | True | Hash algorithm used to encrypt the signature. Valid values are `HS256`, `HS384`, or `HS512`. |
| 3 | String | True | The payload string to encode (typically in JSON format) |

> NOTE: This function does not encrypt the payload.
>
> NOTE: [GetJWTByKeyName](/getjwtbykeyname) is the recommended function for creating JWTs, as `GetJWT` exposes the hard-coded secret in the server-side code (so it’s not a secret anymore), whereas `GetJWTByKeyName` retrieves the secret from Key Management, and access to this platform feature can be limited to individual users or roles.

### Example

```html
%%[
var @json, @secret, @jwt

set @json = '{
  "ContactKey": "00Q6F00001APnymUAD",
  "FirstName": "Samantha",
  "LastName": "Smith",
  "Email": "samantha@limedash.com"
}'
set @secret = 'x!A%C*F-JaNdRgUkXp2s5v8y/B?E(G+K'
set @jwt = GetJWT(@secret, 'HS256', @json)

]%%

JWT: %%=v(@jwt)=%%
```

#### Output

```html
JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ew0KICAiQ29udGFjdEtleSI6ICIwMFE2RjAwMDAxQVBueW1VQUQiLA0KICAiRmlyc3ROYW1lIjogIlNhbWFudGhhIiwNCiAgIkxhc3ROYW1lIjogIlNtaXRoIiwNCiAgIkVtYWlsIjogInNhbWFudGhhQGxpbWVkYXNoLmNvbSINCn0.QJw_GNupl6kaVf_MjlIWaykIOA9Z4pu_wPx4dvZGXzk
```