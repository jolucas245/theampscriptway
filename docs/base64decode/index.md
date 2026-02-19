---
title: "Base64Decode"
---


The `Base64Decode` function decodes a Base64-encoded string back into its original format. This is commonly used when data has been encoded to safely transmit it across systems or store it in environments that do not handle binary data directly.

### Arguments

| Ordinal | Type   | Required | Description                                     |
|---------|--------|----------|-------------------------------------------------|
| 1       | String | Yes      | The Base64-encoded string to be decoded.        |
| 2       | String | No       | The character encoding to use (e.g., `UTF-8`). If not specified, the default encoding of the Marketing Cloud instance is used. |

> NOTE: Ensure that the character encoding used for decoding matches the encoding used during the original Base64 encoding process to prevent data corruption.

### Example 1: Basic Use

This example demonstrates decoding a simple Base64-encoded string.

```html
%%[
    /* Define the Base64 encoded string */
    SET @encodedString = "SGVsbG8gV29ybGQh"

    /* Decode the string using Base64Decode */
    SET @decodedString = Base64Decode(@encodedString)

    /* Check if the decoded string is not empty before displaying */
    IF NOT EMPTY(@decodedString) THEN
        OutputLine(Concat("Decoded String: ", @decodedString))
    ELSE
        OutputLine("Decoding failed or resulted in an empty string.")
    ENDIF
]%%
```

### Example 2: Decoding with Specific Character Encoding

This example shows how to decode a Base64 string that was originally encoded with `UTF-8`.

```html
%%[
    /* Define a Base64 encoded string that was originally UTF-8 encoded */
    SET @encodedUTF8String = "w4dsw7ZzIG11bmRvIQ=="

    /* Decode the string, specifying UTF-8 encoding */
    SET @decodedUTF8String = Base64Decode(@encodedUTF8String, "UTF-8")

    /* Check if the decoded string is not empty before displaying */
    IF NOT EMPTY(@decodedUTF8String) THEN
        OutputLine(Concat("Decoded UTF-8 String: ", @decodedUTF8String))
    ELSE
        OutputLine("Decoding failed or resulted in an empty UTF-8 string.")
    ENDIF
]%%
```