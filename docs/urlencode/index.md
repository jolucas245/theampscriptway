---
title: "URLEncode"
---


This function returns a string in which all non-alphanumeric characters except `-`, `_` and `.` have been replaced with a percent sign (`%`) followed by the equivalent hex value. Spaces are encoded as plus (`+`) signs. The string is encoded in the same way that the posted data from an HTML form is encoded or an `application/x-www-form-urlencoded` media type. This function is useful when including values as URL parameters in hyperlinks to ensure the string encoding is preserved.

### Arguments

`URLEncode(1,2,3)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | String containing the URL or value |
| 2 | Integer | False | Defines whether to convert all non-alphanumeric characters as URL parameters (`0`) or only as space characters (`1`). The default value is `0`. |
| 3 | Integer | False | Defines whether to only encode characters in a string prefixed by a URL (`0`) or all characters (`1`). The default value is `0`. |

> NOTE: Only URL parameters where the URL is suffixed by a `?` character will be encoded.

Supported non-alphanumeric characters and their respective encoded values are provided below.

| Character | Encoded Character | Character | Encoded Character |
| --- | --- | --- | --- |
| newline | `%0a` | space | `%20` or `+` (see note) |
| ~ | `%7e` | # | `%23` |
| " | `%22` | & | `%26` |
| % | `%25` | ‘ | `%27` |
| , | `%2c` | + | `%2b` |
| < | `%3c` | / | `%2f` |
| > | `%3e` | : | `%3a` |
| &bsol; | `%5c` | ; | `%3b` |
| ^ | `%5e` | = | `%3d` |
| \_ | `%5f` | ? | `%3f` |
| &grave; | `%60` | @ | `%40` |
| { | `%7b` | [ | `%5b` |
| &verbar; | `%7c` | ] | `%5d` |
| } | `%7d` | $ | `%24` |

> NOTE: When parameter 2 is set to an argument value of `1`, the space character will be converted to `+`. When the parameter is set to an argument value of `1`, the space character will be converted to `%20` and all other characters will not be converted.

### Example 1

```html
%%[

var @offer
set @offer = "summer offer"

]%%

%%=URLEncode(@offer)=%%
```

#### Output

No conversion takes place, as there is no URL included.

```html
summer offer
```

### Example 2

### Example 3

### Example 4