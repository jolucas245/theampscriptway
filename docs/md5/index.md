---
title: "MD5"
---


This function converts the specified string into a 16-byte MD5 hash hex value.

### Arguments

`MD5(1,2)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | String to convert |
| 2 | String | False | Character set to use for character-encoding. Valid values are `UTF-8` (default) and `UTF-16` |

> NOTE: The results of the MD5 hash are considered one-way, meaning they cannot be decrypted.

### Example

```html
%%[

var @emailAddress
var @MD5EmailAddressUTF8
var @MD5EmailAddressUTF16

set @emailAddress = AttributeValue("emailAddr") /* value from attribute or DE column in send context */
set @emailAddress = "leon@limedash.com" /* or a literal value */
set @MD5EmailAddressUTF8  = MD5(@emailAddress)
set @MD5EmailAddressUTF16  = MD5(@emailAddress, "UTF-16")

]%%
emailAddress: %%=v(@emailAddress)=%%
<br>MD5EmailAddressUTF8: %%=v(@MD5EmailAddressUTF8)=%%
<br>MD5EmailAddressUTF16: %%=v(@MD5EmailAddressUTF16)=%%
```

#### Output

```html
emailAddress: leon@limedash.com
MD5EmailAddressUTF8: fc46f8458a322e7fc807a340e622557c
MD5EmailAddressUTF16: b568f29e9315771e2c06bd435cc7b2e6
```