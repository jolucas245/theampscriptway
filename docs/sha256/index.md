---
title: "SHA256"
---


This function converts the specified string into a SHA256 hex value hash.

### Arguments

`SHA256(1,2)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | String to convert |
| 2 | String | False | Character set to use for character-encoding. Valid values are `UTF-8` (default) and `UTF-16` |

> NOTE: The results of the SHA256 hash are considered one-way, meaning they cannot be decrypted.

### Example

```html
%%[

var @emailAddress
var @SHA256EmailAddressUTF8
var @SHA256EmailAddressUTF16

set @emailAddress = AttributeValue("emailAddr") /* value from attribute or DE column in send context */
set @emailAddress = "lily@limedash.com" /* or a literal value */
set @SHA256EmailAddressUTF8  = SHA256(@emailAddress)
set @SHA256EmailAddressUTF16  = SHA256(@emailAddress, "UTF-16")

]%%
emailAddress: %%=v(@emailAddress)=%%
<br>SHA256EmailAddressUTF8: %%=v(@SHA256EmailAddressUTF8)=%%
<br>SHA256EmailAddressUTF16: %%=v(@SHA256EmailAddressUTF16)=%%
```

#### Output

```html
emailAddress: lily@limedash.com
SHA256EmailAddressUTF8: 0dfe4d756c779f86e80e43cb3efc4d75758b900d8a4837cf979a0e0cd295ead1
SHA256EmailAddressUTF16: 5a643ce463059ca33d1b0c31dc8669f24734444ace3cd5c4c74170dedec00b78
```