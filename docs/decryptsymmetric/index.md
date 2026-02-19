---
title: "DecryptSymmetric"
---


This function decrypts a string with the specified algorithm and qualifiers.

### Arguments

`DecryptSymmetric(1,2,3,4,5,6,7,8)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | String to decrypt |
| 2 | String | True | Algorithm used to decrypt the string. Valid values are `aes`, `des`, and `tripledes`.  Optional cipher [modes](https://docs.microsoft.com/en-us/dotnet/api/system.security.cryptography.ciphermode) for `des` and `tripledes` include:   * `cbc` (Cipher Block Chaining, *default*) * `cfb` (Cipher Feedback) * `ecb` (Electronic Codebook)   Optional [padding codes](https://docs.microsoft.com/en-us/dotnet/api/system.security.cryptography.paddingmode) for `des` and `tripledes` include:   * `ansix923` (sequence of bytes filled with zeros before the length) * `iso10126` (random data before the length) * `none` * `pkcs7` (sequence of bytes, each of which is equal to the total number of padding bytes added , *default*) * `zeros`   Modes and padding are specified after the algorithm and are delimited by semicolons: `des;mode=ecb;padding=zeros`. |
| 3 | String | True | Password External Key for retrieval from [Key Management](https://help.salesforce.com/articleView?id=mc_overview_key_management.htm) |
| 4 | String | True | Password value |
| 5 | String | True | Salt External Key for retrieval from [Key Management](https://help.salesforce.com/articleView?id=mc_overview_key_management.htm) |
| 6 | String | True | Salt value as an 8-byte hex string |
| 7 | String | True | Initialization vector External Key for retrieval from [Key Management](https://help.salesforce.com/articleView?id=mc_overview_key_management.htm) |
| 8 | String | True | Initialization vector value as a 16-byte hex string |

### Example 1

```html
%%[

set @passwordVal = "fresh"
set @saltVal = "e0cf1267f564b362"
set @initVectorVal = "4963b7334a46352623252955df21d7f3"

set @encAES = "4fKWdv7fJRkFsYO6RRtrMg=="
set @encDES01 = "Qs+p/Gw8hughK4EbaPxFLg=="
set @encDES02 = "Qs+p/Gw8hug5Q04gtQQ3Jw=="
set @encDES03 = "Qs+p/Gw8hujEN7j5qYz8/A=="
set @encDES04 = "Qs+p/Gw8hug="
set @encDES05 = "Qs+p/Gw8hughK4EbaPxFLg=="
set @encDES06 = "Qs+p/Gw8hug="
set @encDES07 = "OjFSuxhf85augugb0wUaLg=="
set @encDES08 = "OjFSuxhf85amqnIztzgoIg=="
set @encDES09 = "OjFSuxhf85ZHduos1dQyeg=="
set @encDES10 = "OjFSuxhf85Y="
set @encDES11 = "OjFSuxhf85augugb0wUaLg=="
set @encDES12 = "OjFSuxhf85Y="
set @encDES13 = "Qs+p/Gw8huiQqlLLjpNC5g=="
set @encDES14 = "Qs+p/Gw8huhz0yIqcW8eDQ=="
set @encDES15 = "Qs+p/Gw8hugteYp97SZQJA=="
set @encDES16 = "Qs+p/Gw8hug="
set @encDES17 = "Qs+p/Gw8huiQqlLLjpNC5g=="
set @encDES18 = "Qs+p/Gw8hug="
set @encTripleDES01 = "5Zwb4S0ylZsfF+KHXpd17A=="
set @encTripleDES02 = "5Zwb4S0ylZuUQ3v4JsD4uA=="
set @encTripleDES03 = "5Zwb4S0ylZssnYGXucyn2A=="
set @encTripleDES04 = "5Zwb4S0ylZs="
set @encTripleDES05 = "5Zwb4S0ylZsfF+KHXpd17A=="
set @encTripleDES06 = "5Zwb4S0ylZs="
set @encTripleDES07 = "gnpVkeFLdtpJO1d6cmlWxA=="
set @encTripleDES08 = "gnpVkeFLdtpBsFpJx+kqCw=="
set @encTripleDES09 = "gnpVkeFLdtr/hikI5d8kUg=="
set @encTripleDES10 = "gnpVkeFLdto="
set @encTripleDES11 = "gnpVkeFLdtpJO1d6cmlWxA=="
set @encTripleDES12 = "gnpVkeFLdto="
set @encTripleDES13 = "5Zwb4S0ylZvWK0u1DJNlYQ=="
set @encTripleDES14 = "5Zwb4S0ylZtOKfaL4b4xvQ=="
set @encTripleDES15 = "5Zwb4S0ylZv5vh3YpVg5ZQ=="
set @encTripleDES16 = "5Zwb4S0ylZs="
set @encTripleDES17 = "5Zwb4S0ylZvWK0u1DJNlYQ=="
set @encTripleDES18 = "5Zwb4S0ylZs= "

set @decAES = DecryptSymmetric(@encAES, "aes", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decDES01 = DecryptSymmetric(@encDES01, "des;mode=cbc", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decDES02 = DecryptSymmetric(@encDES02, "des;mode=cbc;padding=ansix923", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decDES03 = DecryptSymmetric(@encDES03, "des;mode=cbc;padding=iso10126", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decDES04 = DecryptSymmetric(@encDES04, "des;mode=cbc;padding=none", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decDES05 = DecryptSymmetric(@encDES05, "des;mode=cbc;padding=pkcs7", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decDES06 = DecryptSymmetric(@encDES06, "des;mode=cbc;padding=zeros", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decDES07 = DecryptSymmetric(@encDES07, "des;mode=cfb", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decDES08 = DecryptSymmetric(@encDES08, "des;mode=cfb;padding=ansix923", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decDES09 = DecryptSymmetric(@encDES09, "des;mode=cfb;padding=iso10126", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decDES10 = DecryptSymmetric(@encDES10, "des;mode=cfb;padding=none", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decDES11 = DecryptSymmetric(@encDES11, "des;mode=cfb;padding=pkcs7", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decDES12 = DecryptSymmetric(@encDES12, "des;mode=cfb;padding=zeros", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decDES13 = DecryptSymmetric(@encDES13, "des;mode=ecb", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decDES14 = DecryptSymmetric(@encDES14, "des;mode=ecb;padding=ansix923", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decDES15 = DecryptSymmetric(@encDES15, "des;mode=ecb;padding=iso10126", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decDES16 = DecryptSymmetric(@encDES16, "des;mode=ecb;padding=none", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decDES17 = DecryptSymmetric(@encDES17, "des;mode=ecb;padding=pkcs7", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decDES18 = DecryptSymmetric(@encDES18, "des;mode=ecb;padding=zeros", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decTripleDES01 = DecryptSymmetric(@encTripleDES01, "tripledes;mode=cbc", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decTripleDES02 = DecryptSymmetric(@encTripleDES02, "tripledes;mode=cbc;padding=ansix923", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decTripleDES03 = DecryptSymmetric(@encTripleDES03, "tripledes;mode=cbc;padding=iso10126", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decTripleDES04 = DecryptSymmetric(@encTripleDES04, "tripledes;mode=cbc;padding=none", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decTripleDES05 = DecryptSymmetric(@encTripleDES05, "tripledes;mode=cbc;padding=pkcs7", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decTripleDES06 = DecryptSymmetric(@encTripleDES06, "tripledes;mode=cbc;padding=zeros", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decTripleDES07 = DecryptSymmetric(@encTripleDES07, "tripledes;mode=cfb", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decTripleDES08 = DecryptSymmetric(@encTripleDES08, "tripledes;mode=cfb;padding=ansix923", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decTripleDES09 = DecryptSymmetric(@encTripleDES09, "tripledes;mode=cfb;padding=iso10126", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decTripleDES10 = DecryptSymmetric(@encTripleDES10, "tripledes;mode=cfb;padding=none", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decTripleDES11 = DecryptSymmetric(@encTripleDES11, "tripledes;mode=cfb;padding=pkcs7", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decTripleDES12 = DecryptSymmetric(@encTripleDES12, "tripledes;mode=cfb;padding=zeros", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decTripleDES13 = DecryptSymmetric(@encTripleDES13, "tripledes;mode=ecb", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decTripleDES14 = DecryptSymmetric(@encTripleDES14, "tripledes;mode=ecb;padding=ansix923", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decTripleDES15 = DecryptSymmetric(@encTripleDES15, "tripledes;mode=ecb;padding=iso10126", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decTripleDES16 = DecryptSymmetric(@encTripleDES16, "tripledes;mode=ecb;padding=none", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decTripleDES17 = DecryptSymmetric(@encTripleDES17, "tripledes;mode=ecb;padding=pkcs7", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)
set @decTripleDES18 = DecryptSymmetric(@encTripleDES18, "tripledes;mode=ecb;padding=zeros", @null, @passwordVal, @null, @saltVal, @null, @initVectorVal)

]%%
password: %%=v(@passwordVal)=%%
<br>salt: %%=v(@saltVal)=%%
<br>initVector: %%=v(@initVectorVal)=%%
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
<br><br>decAES: %%=v(@decAES)=%%
<br>decDES01: %%=v(@decDES01)=%%
<br>decDES02: %%=v(@decDES02)=%%
<br>decDES03: %%=v(@decDES03)=%%
<br>decDES04: %%=v(@decDES04)=%%
<br>decDES05: %%=v(@decDES05)=%%
<br>decDES06: %%=v(@decDES06)=%%
<br>decDES07: %%=v(@decDES07)=%%
<br>decDES08: %%=v(@decDES08)=%%
<br>decDES09: %%=v(@decDES09)=%%
<br>decDES10: %%=v(@decDES10)=%%
<br>decDES11: %%=v(@decDES11)=%%
<br>decDES12: %%=v(@decDES12)=%%
<br>decDES13: %%=v(@decDES13)=%%
<br>decDES14: %%=v(@decDES14)=%%
<br>decDES15: %%=v(@decDES15)=%%
<br>decDES16: %%=v(@decDES16)=%%
<br>decDES17: %%=v(@decDES17)=%%
<br>decDES18: %%=v(@decDES18)=%%
<br>decTripleDES01: %%=v(@decTripleDES01)=%%
<br>decTripleDES02: %%=v(@decTripleDES02)=%%
<br>decTripleDES03: %%=v(@decTripleDES03)=%%
<br>decTripleDES04: %%=v(@decTripleDES04)=%%
<br>decTripleDES05: %%=v(@decTripleDES05)=%%
<br>decTripleDES06: %%=v(@decTripleDES06)=%%
<br>decTripleDES07: %%=v(@decTripleDES07)=%%
<br>decTripleDES08: %%=v(@decTripleDES08)=%%
<br>decTripleDES09: %%=v(@decTripleDES09)=%%
<br>decTripleDES10: %%=v(@decTripleDES10)=%%
<br>decTripleDES11: %%=v(@decTripleDES11)=%%
<br>decTripleDES12: %%=v(@decTripleDES12)=%%
<br>decTripleDES13: %%=v(@decTripleDES13)=%%
<br>decTripleDES14: %%=v(@decTripleDES14)=%%
<br>decTripleDES15: %%=v(@decTripleDES15)=%%
<br>decTripleDES16: %%=v(@decTripleDES16)=%%
<br>decTripleDES17: %%=v(@decTripleDES17)=%%
<br>decTripleDES18: %%=v(@decTripleDES18)=%%
```

#### Output

```html
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

decAES: limedash
decDES01: limedash
decDES02: limedash
decDES03: limedash
decDES04: limedash
decDES05: limedash
decDES06: limedash
decDES07: limedash
decDES08: limedash
decDES09: limedash
decDES10: limedash
decDES11: limedash
decDES12: limedash
decDES13: limedash
decDES14: limedash
decDES15: limedash
decDES16: limedash
decDES17: limedash
decDES18: limedash
decTripleDES01: limedash
decTripleDES02: limedash
decTripleDES03: limedash
decTripleDES04: limedash
decTripleDES05: limedash
decTripleDES06: limedash
decTripleDES07: limedash
decTripleDES08: limedash
decTripleDES09: limedash
decTripleDES10: limedash
decTripleDES11: limedash
decTripleDES12: limedash
decTripleDES13: limedash
decTripleDES14: limedash
decTripleDES15: limedash
decTripleDES16: limedash
decTripleDES17: limedash
decTripleDES18: limedash
```

### Example 2

In the following example, corresponding keys are created in [Key Management](https://help.salesforce.com/articleView?id=mc_overview_key_management.htm) for password, salt and initialization vector values. Passwords should be created using the Symmetric Key Type, with the password as the ‘pre-shared key’ value. Salt and initialization vector keys should be created using their respective Key Type.

```html
%%[

set @passwordExtKey = "PWD_KEY" /* Symmetric external key in Key Management */
set @saltExtKey = "SALT_KEY" /* Salt external key in Key Management */
set @initVectorExtKey = "IV_KEY" /* IV external key in Key Management */

set @encAES = "4fKWdv7fJRkFsYO6RRtrMg=="
set @encDES01 = "Qs+p/Gw8hughK4EbaPxFLg=="
set @encDES02 = "Qs+p/Gw8hug5Q04gtQQ3Jw=="
set @encDES03 = "Qs+p/Gw8hujEN7j5qYz8/A=="
set @encDES04 = "Qs+p/Gw8hug="
set @encDES05 = "Qs+p/Gw8hughK4EbaPxFLg=="
set @encDES06 = "Qs+p/Gw8hug="
set @encDES07 = "OjFSuxhf85augugb0wUaLg=="
set @encDES08 = "OjFSuxhf85amqnIztzgoIg=="
set @encDES09 = "OjFSuxhf85ZHduos1dQyeg=="
set @encDES10 = "OjFSuxhf85Y="
set @encDES11 = "OjFSuxhf85augugb0wUaLg=="
set @encDES12 = "OjFSuxhf85Y="
set @encDES13 = "Qs+p/Gw8huiQqlLLjpNC5g=="
set @encDES14 = "Qs+p/Gw8huhz0yIqcW8eDQ=="
set @encDES15 = "Qs+p/Gw8hugteYp97SZQJA=="
set @encDES16 = "Qs+p/Gw8hug="
set @encDES17 = "Qs+p/Gw8huiQqlLLjpNC5g=="
set @encDES18 = "Qs+p/Gw8hug="
set @encTripleDES01 = "5Zwb4S0ylZsfF+KHXpd17A=="
set @encTripleDES02 = "5Zwb4S0ylZuUQ3v4JsD4uA=="
set @encTripleDES03 = "5Zwb4S0ylZssnYGXucyn2A=="
set @encTripleDES04 = "5Zwb4S0ylZs="
set @encTripleDES05 = "5Zwb4S0ylZsfF+KHXpd17A=="
set @encTripleDES06 = "5Zwb4S0ylZs="
set @encTripleDES07 = "gnpVkeFLdtpJO1d6cmlWxA=="
set @encTripleDES08 = "gnpVkeFLdtpBsFpJx+kqCw=="
set @encTripleDES09 = "gnpVkeFLdtr/hikI5d8kUg=="
set @encTripleDES10 = "gnpVkeFLdto="
set @encTripleDES11 = "gnpVkeFLdtpJO1d6cmlWxA=="
set @encTripleDES12 = "gnpVkeFLdto="
set @encTripleDES13 = "5Zwb4S0ylZvWK0u1DJNlYQ=="
set @encTripleDES14 = "5Zwb4S0ylZtOKfaL4b4xvQ=="
set @encTripleDES15 = "5Zwb4S0ylZv5vh3YpVg5ZQ=="
set @encTripleDES16 = "5Zwb4S0ylZs="
set @encTripleDES17 = "5Zwb4S0ylZvWK0u1DJNlYQ=="
set @encTripleDES18 = "5Zwb4S0ylZs= "

set @decAES = DecryptSymmetric(@encAES, "aes", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decDES01 = DecryptSymmetric(@encDES01, "des;mode=cbc", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decDES02 = DecryptSymmetric(@encDES02, "des;mode=cbc;padding=ansix923", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decDES03 = DecryptSymmetric(@encDES03, "des;mode=cbc;padding=iso10126", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decDES04 = DecryptSymmetric(@encDES04, "des;mode=cbc;padding=none", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decDES05 = DecryptSymmetric(@encDES05, "des;mode=cbc;padding=pkcs7", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decDES06 = DecryptSymmetric(@encDES06, "des;mode=cbc;padding=zeros", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decDES07 = DecryptSymmetric(@encDES07, "des;mode=cfb", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decDES08 = DecryptSymmetric(@encDES08, "des;mode=cfb;padding=ansix923", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decDES09 = DecryptSymmetric(@encDES09, "des;mode=cfb;padding=iso10126", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decDES10 = DecryptSymmetric(@encDES10, "des;mode=cfb;padding=none", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decDES11 = DecryptSymmetric(@encDES11, "des;mode=cfb;padding=pkcs7", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decDES12 = DecryptSymmetric(@encDES12, "des;mode=cfb;padding=zeros", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decDES13 = DecryptSymmetric(@encDES13, "des;mode=ecb", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decDES14 = DecryptSymmetric(@encDES14, "des;mode=ecb;padding=ansix923", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decDES15 = DecryptSymmetric(@encDES15, "des;mode=ecb;padding=iso10126", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decDES16 = DecryptSymmetric(@encDES16, "des;mode=ecb;padding=none", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decDES17 = DecryptSymmetric(@encDES17, "des;mode=ecb;padding=pkcs7", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decDES18 = DecryptSymmetric(@encDES18, "des;mode=ecb;padding=zeros", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decTripleDES01 = DecryptSymmetric(@encTripleDES01, "tripledes;mode=cbc", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decTripleDES02 = DecryptSymmetric(@encTripleDES02, "tripledes;mode=cbc;padding=ansix923", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decTripleDES03 = DecryptSymmetric(@encTripleDES03, "tripledes;mode=cbc;padding=iso10126", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decTripleDES04 = DecryptSymmetric(@encTripleDES04, "tripledes;mode=cbc;padding=none", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decTripleDES05 = DecryptSymmetric(@encTripleDES05, "tripledes;mode=cbc;padding=pkcs7", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decTripleDES06 = DecryptSymmetric(@encTripleDES06, "tripledes;mode=cbc;padding=zeros", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decTripleDES07 = DecryptSymmetric(@encTripleDES07, "tripledes;mode=cfb", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decTripleDES08 = DecryptSymmetric(@encTripleDES08, "tripledes;mode=cfb;padding=ansix923", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decTripleDES09 = DecryptSymmetric(@encTripleDES09, "tripledes;mode=cfb;padding=iso10126", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decTripleDES10 = DecryptSymmetric(@encTripleDES10, "tripledes;mode=cfb;padding=none", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decTripleDES11 = DecryptSymmetric(@encTripleDES11, "tripledes;mode=cfb;padding=pkcs7", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decTripleDES12 = DecryptSymmetric(@encTripleDES12, "tripledes;mode=cfb;padding=zeros", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decTripleDES13 = DecryptSymmetric(@encTripleDES13, "tripledes;mode=ecb", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decTripleDES14 = DecryptSymmetric(@encTripleDES14, "tripledes;mode=ecb;padding=ansix923", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decTripleDES15 = DecryptSymmetric(@encTripleDES15, "tripledes;mode=ecb;padding=iso10126", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decTripleDES16 = DecryptSymmetric(@encTripleDES16, "tripledes;mode=ecb;padding=none", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decTripleDES17 = DecryptSymmetric(@encTripleDES17, "tripledes;mode=ecb;padding=pkcs7", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)
set @decTripleDES18 = DecryptSymmetric(@encTripleDES18, "tripledes;mode=ecb;padding=zeros", @passwordExtKey, @null, @saltExtKey, @null, @initVectorExtKey, @null)

]%%
encAES: %%=v(@encAES)=%%
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
<br><br>decAES: %%=v(@decAES)=%%
<br>decDES01: %%=v(@decDES01)=%%
<br>decDES02: %%=v(@decDES02)=%%
<br>decDES03: %%=v(@decDES03)=%%
<br>decDES04: %%=v(@decDES04)=%%
<br>decDES05: %%=v(@decDES05)=%%
<br>decDES06: %%=v(@decDES06)=%%
<br>decDES07: %%=v(@decDES07)=%%
<br>decDES08: %%=v(@decDES08)=%%
<br>decDES09: %%=v(@decDES09)=%%
<br>decDES10: %%=v(@decDES10)=%%
<br>decDES11: %%=v(@decDES11)=%%
<br>decDES12: %%=v(@decDES12)=%%
<br>decDES13: %%=v(@decDES13)=%%
<br>decDES14: %%=v(@decDES14)=%%
<br>decDES15: %%=v(@decDES15)=%%
<br>decDES16: %%=v(@decDES16)=%%
<br>decDES17: %%=v(@decDES17)=%%
<br>decDES18: %%=v(@decDES18)=%%
<br>decTripleDES01: %%=v(@decTripleDES01)=%%
<br>decTripleDES02: %%=v(@decTripleDES02)=%%
<br>decTripleDES03: %%=v(@decTripleDES03)=%%
<br>decTripleDES04: %%=v(@decTripleDES04)=%%
<br>decTripleDES05: %%=v(@decTripleDES05)=%%
<br>decTripleDES06: %%=v(@decTripleDES06)=%%
<br>decTripleDES07: %%=v(@decTripleDES07)=%%
<br>decTripleDES08: %%=v(@decTripleDES08)=%%
<br>decTripleDES09: %%=v(@decTripleDES09)=%%
<br>decTripleDES10: %%=v(@decTripleDES10)=%%
<br>decTripleDES11: %%=v(@decTripleDES11)=%%
<br>decTripleDES12: %%=v(@decTripleDES12)=%%
<br>decTripleDES13: %%=v(@decTripleDES13)=%%
<br>decTripleDES14: %%=v(@decTripleDES14)=%%
<br>decTripleDES15: %%=v(@decTripleDES15)=%%
<br>decTripleDES16: %%=v(@decTripleDES16)=%%
<br>decTripleDES17: %%=v(@decTripleDES17)=%%
<br>decTripleDES18: %%=v(@decTripleDES18)=%%
```

#### Output

```html
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

decAES: limedash
decDES01: limedash
decDES02: limedash
decDES03: limedash
decDES04: limedash
decDES05: limedash
decDES06: limedash
decDES07: limedash
decDES08: limedash
decDES09: limedash
decDES10: limedash
decDES11: limedash
decDES12: limedash
decDES13: limedash
decDES14: limedash
decDES15: limedash
decDES16: limedash
decDES17: limedash
decDES18: limedash
decTripleDES01: limedash
decTripleDES02: limedash
decTripleDES03: limedash
decTripleDES04: limedash
decTripleDES05: limedash
decTripleDES06: limedash
decTripleDES07: limedash
decTripleDES08: limedash
decTripleDES09: limedash
decTripleDES10: limedash
decTripleDES11: limedash
decTripleDES12: limedash
decTripleDES13: limedash
decTripleDES14: limedash
decTripleDES15: limedash
decTripleDES16: limedash
decTripleDES17: limedash
decTripleDES18: limedash
```