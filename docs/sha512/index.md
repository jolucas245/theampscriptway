---
title: "SHA512"
---


This function converts the specified string into a SHA512 hex value hash.

### Arguments

`SHA512(1,2)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | String to convert |
| 2 | String | False | Character set to use for character-encoding. Valid values are `UTF-8` (default) and `UTF-16` |

> NOTE: The results of the SHA512 hash are considered one-way, meaning they cannot be decrypted.

### Example

```html
%%[

var @emailAddress
var @SHA512EmailAddressUTF8
var @SHA512EmailAddressUTF16

set @emailAddress = AttributeValue("emailAddr") /* value from attribute or DE column in send context */
set @emailAddress = "barb@limedash.com" /* or a literal value */
set @SHA512EmailAddressUTF8  = SHA512(@emailAddress)
set @SHA512EmailAddressUTF16  = SHA512(@emailAddress, "UTF-16")

]%%
emailAddress: %%=v(@emailAddress)=%%
<br>SHA512EmailAddressUTF8: %%=v(@SHA512EmailAddressUTF8)=%%
<br>SHA512EmailAddressUTF16: %%=v(@SHA512EmailAddressUTF16)=%%
```

#### Output

```html
emailAddress: barb@limedash.com
SHA512EmailAddressUTF8: 98c111950453023a32b030cef11c1137c10cccfd2d33246c5c897a9c64e3dc34936e57cf74365ad9534fdf983fc81e841d782e87e8fec46f5d640677d0374750
SHA512EmailAddressUTF16: 573d3e3b13c82436a3570cf39a37bbba08a527273cb330f36da6947536985d99ddcbbf15d2c164f7be64fe028baa2301a285ff7c782ad277a7e8c4ce89afebe6
```