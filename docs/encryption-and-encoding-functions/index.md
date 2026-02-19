---
title: "Encryption And Encoding Functions"
---


AMPscript provides a suite of functions for encrypting, decrypting, encoding, and decoding data. These are essential for securely handling sensitive information, passing data in URLs, and integrating with external systems that require specific data formats.

### Encryption vs. Encoding

- **Encryption** is a two-way process that transforms data into a secure format to protect its confidentiality. The data can only be read by someone who has the correct key to decrypt it.
- **Encoding** is a two-way process that transforms data into a different format (e.g., Base64 or URL-safe characters) to ensure it can be transmitted or stored reliably.
- **Hashing** is a one-way process that converts data into a fixed-size string of characters.

### Key Functions

| Function | Category | Description |
| --- | --- | --- |
| `EncryptSymmetric()` | Encryption | Encrypts a string using a specified symmetric encryption algorithm (e.g., AES). |
| `DecryptSymmetric()` | Encryption | Decrypts a string that was encrypted with `EncryptSymmetric()`. |
| `Base64Encode()` | Encoding | Encodes a string into Base64 format. |
| `Base64Decode()` | Encoding | Decodes a Base64-encoded string back to its original format. |
| `URLEncode()` | Encoding | Encodes a string to be safely included in a URL. |
| `SHA1()` / `SHA256()` / `SHA512()` | Hashing | Computes a cryptographic hash of a string. |
| `MD5()` | Hashing | Computes an MD5 hash of a string. |

### Example: Securing a URL Parameter

```html
%%[

  VAR @subscriberId, @encryptedId, @encodedId, @cloudPageUrl

  SET @subscriberId = AttributeValue("_subscriberkey")

  IF NOT EMPTY(@subscriberId) THEN

    SET @encryptedId = EncryptSymmetric(@subscriberId, "AES", "myExternalKeyName", @null, @null, @null, @null, @null)
    SET @encodedId = URLEncode(@encryptedId)
    SET @cloudPageUrl = CONCAT("https://my.cloudpage.com/profile-center?id=", @encodedId)

  ENDIF

]%%

<a href="%%=RedirectTo(@cloudPageUrl)=%%">Update Your Profile</a>
```

By combining these functions, you can securely and reliably pass sensitive information between Marketing Cloud assets and external systems.
