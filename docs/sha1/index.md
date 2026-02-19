---
title: "SHA1"
---


This function converts the specified string into a SHA1 hex value hash.

### Arguments

`SHA1(1,2)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | String to convert |
| 2 | String | False | Character set to use for character-encoding. Valid values are `UTF-8` (default) and `UTF-16` |

> NOTE: The results of the SHA1 hash are considered one-way, meaning they cannot be decrypted.

### Example

```html
%%[

var @emailAddress
var @SHA1EmailAddressUTF8
var @SHA1EmailAddressUTF16

set @emailAddress = AttributeValue("emailAddr") /* value from attribute or DE column in send context */
set @emailAddress = "curt@limedash.com" /* or a literal value */
set @SHA1EmailAddressUTF8  = SHA1(@emailAddress)
set @SHA1EmailAddressUTF16  = SHA1(@emailAddress, "UTF-16")

]%%
emailAddress: %%=v(@emailAddress)=%%
<br>SHA1EmailAddressUTF8: %%=v(@SHA1EmailAddressUTF8)=%%
<br>SHA1EmailAddressUTF16: %%=v(@SHA1EmailAddressUTF16)=%%
```

#### Output

```html
emailAddress: curt@limedash.com
SHA1EmailAddressUTF8: 349601423ece6853014397f3b5fe44ce8ddd9358
SHA1EmailAddressUTF16: 2eb6923a3078e9cfa0632461098720a99100bcdc
```