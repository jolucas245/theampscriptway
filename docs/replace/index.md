---
title: "Replace"
---


The `Replace` function in AMPscript is used to find all occurrences of a specified substring within a source string and replace them with a new substring. This function performs a global replacement, meaning every instance of the `searchSubstring` will be substituted.

### Arguments

| Ordinal | Type   | Required | Description                                       |
|---------|--------|----------|---------------------------------------------------|
| 1       | String | Yes      | The original string in which to perform the replacement. |
| 2       | String | Yes      | The substring to search for within the `sourceString`. |
| 3       | String | Yes      | The substring to replace all occurrences of `searchSubstring` with. |

> NOTE: The `Replace` function is case-sensitive. If you need a case-insensitive replacement, consider converting both the `sourceString` and `searchSubstring` to a consistent case (e.g., lowercase) before applying the `Replace` function, or use a combination with `RegExReplace` for more advanced pattern matching.

### Example 1: Basic Use

This example demonstrates replacing a specific word in a sentence.

```html
%%[
    VAR @originalString, @search, @replace, @result

    /* Initialize variables */
    SET @originalString = "Hello World, this is a wonderful World!"
    SET @search = "World"
    SET @replace = "Universe"

    /* Check if the original string is not empty before performing replacement */
    IF NOT EMPTY(@originalString) THEN
        SET @result = Replace(@originalString, @search, @replace)
    ELSE
        SET @result = "Original string was empty."
    ENDIF
]
%%=

<p>Original: %%=v(@originalString)=%%</p>
<p>Replaced: %%=v(@result)=%%</p>
```

**Output:**

```
Original: Hello World, this is a wonderful World!
Replaced: Hello Universe, this is a wonderful Universe!
```

### Example 2: Replacing Special Characters in a URL

This example shows how to clean up a string by replacing spaces with hyphens, which is often useful for creating URL-friendly slugs.

```html
%%[
    VAR @productName, @urlFriendlyName

    /* Define the product name with spaces */
    SET @productName = "My Awesome Product Name"

    /* Check if the product name is not empty before processing */
    IF NOT EMPTY(@productName) THEN
        /* Replace spaces with hyphens to make it URL-friendly */
        SET @urlFriendlyName = Replace(@productName, " ", "-")
    ELSE
        SET @urlFriendlyName = ""
    ENDIF
]
%%=

<p>Product Name: %%=v(@productName)=%%</p>
<p>URL Friendly Name: %%=v(@urlFriendlyName)=%%</p>
```

**Output:**

```
Product Name: My Awesome Product Name
URL Friendly Name: My-Awesome-Product-Name
```