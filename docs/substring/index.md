--- 
title: "Substring"
---


The `Substring` function returns a portion of a specified string, starting from a given character position and continuing for a specified number of characters. If no length is provided, the substring will continue to the end of the source string.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | Yes | The source string from which to extract the substring. |
| 2 | Number | Yes | The starting character position (1-based index). |
| 3 | Number | No | The number of characters to include in the substring. |

### Example 1: Basic Use

This example demonstrates how to extract a specific part of a string. Let's say you have a product code and you want to extract the middle part.

```html
%%[

  VAR @productCode, @middlePart

  SET @productCode = "PROD-12345-XYZ"

  IF NOT EMPTY(@productCode) THEN
    /* Extracts 5 characters starting from the 6th position */
    SET @middlePart = Substring(@productCode, 6, 5)
  ELSE
    SET @middlePart = ""
  ENDIF

]%%

Product ID: %%=v(@middlePart)=%% <!-- Outputs: 12345 -->
```

### Example 2: Advanced Scenario

This example shows how to extract the last name from a full name string. This is useful when you have a single field for a full name and need to personalize communication using only the last name.

```html
%%[

  VAR @fullName, @spacePosition, @lastName

  SET @fullName = "John Smith"

  IF NOT EMPTY(@fullName) THEN
    /* Find the position of the space */
    SET @spacePosition = IndexOf(@fullName, " ")

    IF @spacePosition > 0 THEN
      /* Extract the last name, which starts after the space */
      SET @lastName = Substring(@fullName, ADD(@spacePosition, 1), LENGTH(@fullName))
    ELSE
      /* If there's no space, assume the whole string is the last name */
      SET @lastName = @fullName
    ENDIF
  ELSE
    SET @lastName = ""
  ENDIF

]%%

Last Name: %%=v(@lastName)=%% <!-- Outputs: Smith -->
```