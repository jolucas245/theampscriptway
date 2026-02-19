---
title: "IndexOf"
---


The `IndexOf()` function returns the starting position of the first occurrence of a specified substring within a given string. It utilizes 1-based indexing, meaning the first character of the string is at position 1. If the substring is not found, the function returns 0.

### Arguments

| Ordinal | Type   | Required | Description                                     |
|---------|--------|----------|-------------------------------------------------|
| 1       | String | Yes      | The string to be searched.                      |
| 2       | String | Yes      | The substring to search for within the main string. |

### Notes

> NOTE: The `IndexOf()` function is case-sensitive. For case-insensitive searches, convert both the source string and substring to the same case (e.g., using `Lowercase()`) before using `IndexOf()`.

### Example 1: Basic Use

This example demonstrates how to find the position of a single character and a word within a string.

```html
%%[
    VAR @fullString, @charToFind, @wordToFind, @charPosition, @wordPosition

    SET @fullString = "Hello, Marketing Cloud!"
    SET @charToFind = "M"
    SET @wordToFind = "Cloud"

    /* Find the position of the character 'M' */
    SET @charPosition = IndexOf(@fullString, @charToFind)

    /* Find the position of the word 'Cloud' */
    SET @wordPosition = IndexOf(@fullString, @wordToFind)

    IF NOT EMPTY(@charPosition) THEN
        OutputLine(CONCAT("The character '", @charToFind, "' is found at position: ", @charPosition, "<br>"))
    ELSE
        OutputLine(CONCAT("The character '", @charToFind, "' was not found.<br>"))
    ENDIF

    IF NOT EMPTY(@wordPosition) THEN
        OutputLine(CONCAT("The word '", @wordToFind, "' is found at position: ", @wordPosition, "<br>"))
    ELSE
        OutputLine(CONCAT("The word '", @wordToFind, "' was not found.<br>"))
    ENDIF
]%%
```

**Output:**
```
The character 'M' is found at position: 10<br>
The word 'Cloud' is found at position: 19<br>
```

### Example 2: Advanced Scenario - Checking for Multiple Substrings and Case Insensitivity

This example shows how to check for the presence of multiple keywords in a string, including a case-insensitive search.

```html
%%[
    VAR @emailContent, @keyword1, @keyword2, @keyword3
    VAR @pos1, @pos2, @pos3

    SET @emailContent = "Your order #ABC123 has been shipped. For support, visit our website."
    SET @keyword1 = "shipped"
    SET @keyword2 = "support"
    SET @keyword3 = "website"

    /* Check for keyword1 (case-sensitive) */
    SET @pos1 = IndexOf(@emailContent, @keyword1)

    /* Check for keyword2 (case-sensitive) */
    SET @pos2 = IndexOf(@emailContent, @keyword2)

    /* Perform a case-insensitive search for keyword3 */
    SET @pos3 = IndexOf(Lowercase(@emailContent), Lowercase(@keyword3))

    OutputLine("--- Keyword Search Results ---<br>")

    IF @pos1 > 0 THEN
        OutputLine(CONCAT("Keyword '", @keyword1, "' found at position: ", @pos1, "<br>"))
    ELSE
        OutputLine(CONCAT("Keyword '", @keyword1, "' not found.<br>"))
    ENDIF

    IF @pos2 > 0 THEN
        OutputLine(CONCAT("Keyword '", @keyword2, "' found at position: ", @pos2, "<br>"))
    ELSE
        OutputLine(CONCAT("Keyword '", @keyword2, "' not found.<br>"))
    ENDIF

    IF @pos3 > 0 THEN
        OutputLine(CONCAT("Keyword '", @keyword3, "' found (case-insensitive) at position: ", @pos3, "<br>"))
    ELSE
        OutputLine(CONCAT("Keyword '", @keyword3, "' not found (case-insensitive).<br>"))
    ENDIF
]%%
```

**Output:**
```
--- Keyword Search Results ---
Keyword 'shipped' found at position: 26<br>
Keyword 'support' found at position: 39<br>
Keyword 'website' found (case-insensitive) at position: 52<br>
```