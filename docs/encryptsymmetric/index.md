---
title: "EncryptSymmetric"
---


This function encrypts a string with the specified algorithm and qualifiers. Outputs a Base64 encoded value.

### Arguments

`EncryptSymmetric(1,2,3,4,5,6,7,8)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | String to encrypt |
| 2 | String | True | Algorithm used to encrypt the string. Valid values are `aes`, `des`, and `tripledes`.  Optional cipher [modes](https://docs.microsoft.com/en-us/dotnet/api/system.security.cryptography.ciphermode) for `des` and `tripledes` include:   * `cbc` (Cipher Block Chaining, *default*) * `cfb` (Cipher Feedback) * `ecb` (Electronic Codebook)   Optional [padding codes](https://docs.microsoft.com/en-us/dotnet/api/system.security.cryptography.paddingmode) for `des` and `tripledes` include:   * `ansix923` (sequence of bytes filled with zeros before the length) * `iso10126` (random data before the length) * `none` * `pkcs7` (sequence of bytes, each of which is equal to the total number of padding bytes added , *default*) * `zeros`   Modes and padding are specified after the algorithm and are delimited by semicolons: `des;mode=ecb;padding=zeros`. |
| 3 | String | True | Password External Key for retrieval from [Key Management](https://help.salesforce.com/articleView?id=mc_overview_key_management.htm) |
| 4 | String | True | Password value |
| 5 | String | True | Salt External Key for retrieval from [Key Management](https://help.salesforce.com/articleView?id=mc_overview_key_management.htm) |
| 6 | String | True | Salt value as an 8-byte hex string |
| 7 | String | True | Initialization vector External Key for retrieval from [Key Management](https://help.salesforce.com/articleView?id=mc_overview_key_management.htm) |
| 8 | String | True | Initialization vector value as a 16-byte hex string |

> NOTE: If the External Key is specified, the value will be retrieved from Key Management. If you specify values, the External Keys are ignored. Unspecified values should be represented by an undeclared AMPscript variable like `@null`.
>
> NOTE: The `des` and `tripledes` algorithm modes and padding are optional but can be specified following the algorithm value, delimited by semicolons: `des;mode=ecb;padding=zeros`
>
> NOTE: The `cts` and `ofb` modes for the `des` and `tripledes` algorithms are not supported in the current version of Marketing Cloud.

### Example 1

```html
%%[

set @str = "limedash"
set @passwordVal = "fresh"
set @saltVal = "e0cf1267f564b362"
set @initVectorVal = "4963b7334a46352623252955df21d7f3"

set @encAES = EncryptSymmetric(@str, "aes", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encDES01 = EncryptSymmetric(@str, "des;mode=cbc", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encDES02 = EncryptSymmetric(@str, "des;mode=cbc;padding=ansix923", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encDES03 = EncryptSymmetric(@str, "des;mode=cbc;padding=iso10126", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encDES04 = EncryptSymmetric(@str, "des;mode=cbc;padding=none", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encDES05 = EncryptSymmetric(@str, "des;mode=cbc;padding=pkcs7", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encDES06 = EncryptSymmetric(@str, "des;mode=cbc;padding=zeros", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encDES07 = EncryptSymmetric(@str, "des;mode=cfb", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encDES08 = EncryptSymmetric(@str, "des;mode=cfb;padding=ansix923", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encDES09 = EncryptSymmetric(@str, "des;mode=cfb;padding=iso10126", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encDES10 = EncryptSymmetric(@str, "des;mode=cfb;padding=none", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encDES11 = EncryptSymmetric(@str, "des;mode=cfb;padding=pkcs7", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encDES12 = EncryptSymmetric(@str, "des;mode=cfb;padding=zeros", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encDES13 = EncryptSymmetric(@str, "des;mode=ecb", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encDES14 = EncryptSymmetric(@str, "des;mode=ecb;padding=ansix923", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encDES15 = EncryptSymmetric(@str, "des;mode=ecb;padding=iso10126", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encDES16 = EncryptSymmetric(@str, "des;mode=ecb;padding=none", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encDES17 = EncryptSymmetric(@str, "des;mode=ecb;padding=pkcs7", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encDES18 = EncryptSymmetric(@str, "des;mode=ecb;padding=zeros", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encTripleDES01 = EncryptSymmetric(@str, "tripledes;mode=cbc", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encTripleDES02 = EncryptSymmetric(@str, "tripledes;mode=cbc;padding=ansix923", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encTripleDES03 = EncryptSymmetric(@str, "tripledes;mode=cbc;padding=iso10126", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encTripleDES04 = EncryptSymmetric(@str, "tripledes;mode=cbc;padding=none", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encTripleDES05 = EncryptSymmetric(@str, "tripledes;mode=cbc;padding=pkcs7", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encTripleDES06 = EncryptSymmetric(@str, "tripledes;mode=cbc;padding=zeros", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encTripleDES07 = EncryptSymmetric(@str, "tripledes;mode=cfb", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encTripleDES08 = EncryptSymmetric(@str, "tripledes;mode=cfb;padding=ansix923", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encTripleDES09 = EncryptSymmetric(@str, "tripledes;mode=cfb;padding=iso10126", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encTripleDES10 = EncryptSymmetric(@str, "tripledes;mode=cfb;padding=none", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encTripleDES11 = EncryptSymmetric(@str, "tripledes;mode=cfb;padding=pkcs7", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encTripleDES12 = EncryptSymmetric(@str, "tripledes;mode=cfb;padding=zeros", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encTripleDES13 = EncryptSymmetric(@str, "tripledes;mode=ecb", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encTripleDES14 = EncryptSymmetric(@str, "tripledes;mode=ecb;padding=ansix923", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encTripleDES15 = EncryptSymmetric(@str, "tripledes;mode=ecb;padding=iso10126", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encTripleDES16 = EncryptSymmetric(@str, "tripledes;mode=ecb;padding=none", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encTripleDES17 = EncryptSymmetric(@str, "tripledes;mode=ecb;padding=pkcs7", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @encTripleDES18 = EncryptSymmetric(@str, "tripledes;mode=ecb;padding=zeros", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)

]%%
str: %%=v(@str)=%%
<br>password: %%=v(@password)=%%
<br>salt: %%=v(@saltVal)=%%
<br>initVectorVal: %%=v(@initVectorVal)=%%
<br><br>encAES: %%=v(@encAES)=%%
<br>encDES01: %%=v(@encDES01)=%%
<br>encDES02: %%=v(@encDES02)=%%
<br>encDES03: %%=v(@encDES03)=%%
<br>encDES04: %%=v(@encDES04)=%%
<br>encDES05: %%=v(@encDES05)=%%
<br>encDES06: %%=v(@encDES06)=%%
<br>encDES07: %%=v(@encDES07)=%%
<br>encDES08: %%=v(@encDES08)=%%
<br>encDES09: %%=v(@encDES09)=%%
<br>encDES10: %%=v(@encDES10)=%%
<br>encDES11: %%=v(@encDES11)=%%
<br>encDES12: %%=v(@encDES12)=%%
<br>encDES13: %%=v(@encDES13)=%%
<br>encDES14: %%=v(@encDES14)=%%
<br>encDES15: %%=v(@encDES15)=%%
<br>encDES16: %%=v(@encDES16)=%%
<br>encDES17: %%=v(@encDES17)=%%
<br>encDES18: %%=v(@encDES18)=%%
<br>encTripleDES01: %%=v(@encTripleDES01)=%%
<br>encTripleDES02: %%=v(@encTripleDES02)=%%
<br>encTripleDES03: %%=v(@encTripleDES03)=%%
<br>encTripleDES04: %%=v(@encTripleDES04)=%%
<br>encTripleDES05: %%=v(@encTripleDES05)=%%
<br>encTripleDES06: %%=v(@encTripleDES06)=%%
<br>encTripleDES07: %%=v(@encTripleDES07)=%%
<br>encTripleDES08: %%=v(@encTripleDES08)=%%
<br>encTripleDES09: %%=v(@encTripleDES09)=%%
<br>encTripleDES10: %%=v(@encTripleDES10)=%%
<br>encTripleDES11: %%=v(@encTripleDES11)=%%
<br>encTripleDES12: %%=v(@encTripleDES12)=%%
<br>encTripleDES13: %%=v(@encTripleDES13)=%%
<br>encTripleDES14: %%=v(@encTripleDES14)=%%
<br>encTripleDES15: %%=v(@encTripleDES15)=%%
<br>encTripleDES16: %%=v(@encTripleDES16)=%%
<br>encTripleDES17: %%=v(@encTripleDES17)=%%
<br>encTripleDES18: %%=v(@encTripleDES18)=%%
```

#### Output

```html
str: limedash
password: fresh
salt: e0cf1267f564b362
initVector: 4963b7334a46352623252955df21d7f3

encAES: 4fKWdv7fJRkFsYO6RRtrMg==
encDES01: Qs+p/Gw8hughK4EbaPxFLg==
encDES02: Qs+p/Gw8hug5Q04gtQQ3Jw==
encDES03: Qs+p/Gw8hujEN7j5qYz8/A==
encDES04: Qs+p/Gw8hug=
encDES05: Qs+p/Gw8hughK4EbaPxFLg==
encDES06: Qs+p/Gw8hug=
encDES07: OjFSuxhf85augugb0wUaLg==
encDES08: OjFSuxhf85amqnIztzgoIg==
encDES09: OjFSuxhf85ZHduos1dQyeg==
encDES10: OjFSuxhf85Y=
encDES11: OjFSuxhf85augugb0wUaLg==
encDES12: OjFSuxhf85Y=
encDES13: Qs+p/Gw8huiQqlLLjpNC5g==
encDES14: Qs+p/Gw8huhz0yIqcW8eDQ==
encDES15: Qs+p/Gw8hugteYp97SZQJA==
encDES16: Qs+p/Gw8hug=
encDES17: Qs+p/Gw8huiQqlLLjpNC5g==
encDES18: Qs+p/Gw8hug=
encTripleDES01: 5Zwb4S0ylZsfF+KHXpd17A==
encTripleDES02: 5Zwb4S0ylZuUQ3v4JsD4uA==
encTripleDES03: 5Zwb4S0ylZssnYGXucyn2A==
encTripleDES04: 5Zwb4S0ylZs=
encTripleDES05: 5Zwb4S0ylZsfF+KHXpd17A==
encTripleDES06: 5Zwb4S0ylZs=
encTripleDES07: gnpVkeFLdtpJO1d6cmlWxA==
encTripleDES08: gnpVkeFLdtpBsFpJx+kqCw==
encTripleDES09: gnpVkeFLdtr/hikI5d8kUg==
encTripleDES10: gnpVkeFLdto=
encTripleDES11: gnpVkeFLdtpJO1d6cmlWxA==
encTripleDES12: gnpVkeFLdto=
encTripleDES13: 5Zwb4S0ylZvWK0u1DJNlYQ==
encTripleDES14: 5Zwb4S0ylZtOKfaL4b4xvQ==
encTripleDES15: 5Zwb4S0ylZv5vh3YpVg5ZQ==
encTripleDES16: 5Zwb4S0ylZs=
encTripleDES17: 5Zwb4S0ylZvWK0u1DJNlYQ==
encTripleDES18: 5Zwb4S0ylZs=
```

### Example 2

In the following example, corresponding keys are created in [Key Management](https://help.salesforce.com/articleView?id=mc_overview_key_management.htm) for password, salt and initialization vector values. Passwords should be created using the Symmetric Key Type, with the password as the ‘pre-shared key’ value. Salt and initialization vector keys should be created using their respective Key Type.

```html
%%[

set @str = "limedash"
set @passwordExtKey = "PWD_KEY" /* Symmetric external key in Key Management */
set @saltExtKey = "SALT_KEY" /* Salt external key in Key Management */
set @initVectorExtKey = "IV_KEY" /* IV external key in Key Management */

set @encAES = EncryptSymmetric(@str, "aes", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encDES01 = EncryptSymmetric(@str, "des;mode=cbc", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encDES02 = EncryptSymmetric(@str, "des;mode=cbc;padding=ansix923", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encDES03 = EncryptSymmetric(@str, "des;mode=cbc;padding=iso10126", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encDES04 = EncryptSymmetric(@str, "des;mode=cbc;padding=none", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encDES05 = EncryptSymmetric(@str, "des;mode=cbc;padding=pkcs7", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encDES06 = EncryptSymmetric(@str, "des;mode=cbc;padding=zeros", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encDES07 = EncryptSymmetric(@str, "des;mode=cfb", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encDES08 = EncryptSymmetric(@str, "des;mode=cfb;padding=ansix923", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encDES09 = EncryptSymmetric(@str, "des;mode=cfb;padding=iso10126", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encDES10 = EncryptSymmetric(@str, "des;mode=cfb;padding=none", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encDES11 = EncryptSymmetric(@str, "des;mode=cfb;padding=pkcs7", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encDES12 = EncryptSymmetric(@str, "des;mode=cfb;padding=zeros", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encDES13 = EncryptSymmetric(@str, "des;mode=ecb", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encDES14 = EncryptSymmetric(@str, "des;mode=ecb;padding=ansix923", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encDES15 = EncryptSymmetric(@str, "des;mode=ecb;padding=iso10126", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encDES16 = EncryptSymmetric(@str, "des;mode=ecb;padding=none", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encDES17 = EncryptSymmetric(@str, "des;mode=ecb;padding=pkcs7", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encDES18 = EncryptSymmetric(@str, "des;mode=ecb;padding=zeros", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encTripleDES01 = EncryptSymmetric(@str, "tripledes;mode=cbc", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encTripleDES02 = EncryptSymmetric(@str, "tripledes;mode=cbc;padding=ansix923", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encTripleDES03 = EncryptSymmetric(@str, "tripledes;mode=cbc;padding=iso10126", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encTripleDES04 = EncryptSymmetric(@str, "tripledes;mode=cbc;padding=none", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encTripleDES05 = EncryptSymmetric(@str, "tripledes;mode=cbc;padding=pkcs7", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encTripleDES06 = EncryptSymmetric(@str, "tripledes;mode=cbc;padding=zeros", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encTripleDES07 = EncryptSymmetric(@str, "tripledes;mode=cfb", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encTripleDES08 = EncryptSymmetric(@str, "tripledes;mode=cfb;padding=ansix923", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encTripleDES09 = EncryptSymmetric(@str, "tripledes;mode=cfb;padding=iso10126", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encTripleDES10 = EncryptSymmetric(@str, "tripledes;mode=cfb;padding=none", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encTripleDES11 = EncryptSymmetric(@str, "tripledes;mode=cfb;padding=pkcs7", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encTripleDES12 = EncryptSymmetric(@str, "tripledes;mode=cfb;padding=zeros", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encTripleDES13 = EncryptSymmetric(@str, "tripledes;mode=ecb", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encTripleDES14 = EncryptSymmetric(@str, "tripledes;mode=ecb;padding=ansix923", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encTripleDES15 = EncryptSymmetric(@str, "tripledes;mode=ecb;padding=iso10126", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encTripleDES16 = EncryptSymmetric(@str, "tripledes;mode=ecb;padding=none", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encTripleDES17 = EncryptSymmetric(@str, "tripledes;mode=ecb;padding=pkcs7", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @encTripleDES18 = EncryptSymmetric(@str, "tripledes;mode=ecb;padding=zeros", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)

]%%
str: %%=v(@str)=%%
<br><br>encAES: %%=v(@encAES)=%%
<br>encDES01: %%=v(@encDES01)=%%
<br>encDES02: %%=v(@encDES02)=%%
<br>encDES03: %%=v(@encDES03)=%%
<br>encDES04: %%=v(@encDES04)=%%
<br>encDES05: %%=v(@encDES05)=%%
<br>encDES06: %%=v(@encDES06)=%%
<br>encDES07: %%=v(@encDES07)=%%
<br>encDES08: %%=v(@encDES08)=%%
<br>encDES09: %%=v(@encDES09)=%%
<br>encDES10: %%=v(@encDES10)=%%
<br>encDES11: %%=v(@encDES11)=%%
<br>encDES12: %%=v(@encDES12)=%%
<br>encDES13: %%=v(@encDES13)=%%
<br>encDES14: %%=v(@encDES14)=%%
<br>encDES15: %%=v(@encDES15)=%%
<br>encDES16: %%=v(@encDES16)=%%
<br>encDES17: %%=v(@encDES17)=%%
<br>encDES18: %%=v(@encDES18)=%%
<br>encTripleDES01: %%=v(@encTripleDES01)=%%
<br>encTripleDES02: %%=v(@encTripleDES02)=%%
<br>encTripleDES03: %%=v(@encTripleDES03)=%%
<br>encTripleDES04: %%=v(@encTripleDES04)=%%
<br>encTripleDES05: %%=v(@encTripleDES05)=%%
<br>encTripleDES06: %%=v(@encTripleDES06)=%%
<br>encTripleDES07: %%=v(@encTripleDES07)=%%
<br>encTripleDES08: %%=v(@encTripleDES08)=%%
<br>encTripleDES09: %%=v(@encTripleDES09)=%%
<br>encTripleDES10: %%=v(@encTripleDES10)=%%
<br>encTripleDES11: %%=v(@encTripleDES11)=%%
<br>encTripleDES12: %%=v(@encTripleDES12)=%%
<br>encTripleDES13: %%=v(@encTripleDES13)=%%
<br>encTripleDES14: %%=v(@encTripleDES14)=%%
<br>encTripleDES15: %%=v(@encTripleDES15)=%%
<br>encTripleDES16: %%=v(@encTripleDES16)=%%
<br>encTripleDES17: %%=v(@encTripleDES17)=%%
<br>encTripleDES18: %%=v(@encTripleDES18)=%%
```

#### Output

```html
str: limedash

encAES: 4fKWdv7fJRkFsYO6RRtrMg==
encDES01: Qs+p/Gw8hughK4EbaPxFLg==
encDES02: Qs+p/Gw8hug5Q04gtQQ3Jw==
encDES03: Qs+p/Gw8hujEN7j5qYz8/A==
encDES04: Qs+p/Gw8hug=
encDES05: Qs+p/Gw8hughK4EbaPxFLg==
encDES06: Qs+p/Gw8hug=
encDES07: OjFSuxhf85augugb0wUaLg==
encDES08: OjFSuxhf85amqnIztzgoIg==
encDES09: OjFSuxhf85ZHduos1dQyeg==
encDES10: OjFSuxhf85Y=
encDES11: OjFSuxhf85augugb0wUaLg==
encDES12: OjFSuxhf85Y=
encDES13: Qs+p/Gw8huiQqlLLjpNC5g==
encDES14: Qs+p/Gw8huhz0yIqcW8eDQ==
encDES15: Qs+p/Gw8hugteYp97SZQJA==
encDES16: Qs+p/Gw8hug=
encDES17: Qs+p/Gw8huiQqlLLjpNC5g==
encDES18: Qs+p/Gw8hug=
encTripleDES01: 5Zwb4S0ylZsfF+KHXpd17A==
encTripleDES02: 5Zwb4S0ylZuUQ3v4JsD4uA==
encTripleDES03: 5Zwb4S0ylZssnYGXucyn2A==
encTripleDES04: 5Zwb4S0ylZs=
encTripleDES05: 5Zwb4S0ylZsfF+KHXpd17A==
encTripleDES06: 5Zwb4S0ylZs=
encTripleDES07: gnpVkeFLdtpJO1d6cmlWxA==
encTripleDES08: gnpVkeFLdtpBsFpJx+kqCw==
encTripleDES09: gnpVkeFLdtr/hikI5d8kUg==
encTripleDES10: gnpVkeFLdto=
encTripleDES11: gnpVkeFLdtpJO1d6cmlWxA==
encTripleDES12: gnpVkeFLdto=
encTripleDES13: 5Zwb4S0ylZvWK0u1DJNlYQ==
encTripleDES14: 5Zwb4S0ylZtOKfaL4b4xvQ==
encTripleDES15: 5Zwb4S0ylZv5vh3YpVg5ZQ==
encTripleDES16: 5Zwb4S0ylZs=
encTripleDES17: 5Zwb4S0ylZvWK0u1DJNlYQ==
encTripleDES18: 5Zwb4S0ylZs=
```