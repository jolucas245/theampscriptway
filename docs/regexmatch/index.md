---
title: "RegExMatch"
---


This function searches for and returns a string for the first occurrence of the matching regular expression pattern.

### Arguments

`RegExMatch(1,2,3,[n])`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | String to search for a match |
| 2 | String | True | Regular expression to use in the search |
| 3 | String | True | Name or ordinal of the matching group to return |
| n | String | False | Additional repeating string parameter options (see note) |

> NOTE: Additional repeating string parameter options can be appended as arguments.
>
> NOTE: Valid repeating string parameter options include any value from the [.NET RegexOptions enumeration](https://msdn.microsoft.com/en-us/library/system.text.regularexpressions.regexoptions(v=vs.110).aspx).

### Example

```html
%%[

var @s
var @o
var @p
var @m

output(concat("<br>Strip leading zeroes from a string"))
set @s = "0000012345"
set @p = "^0*(\d+)$"
set @o = RegExMatch(@s, @p, 1)
output(concat("<br>string:  ", @s))
output(concat('<br>pattern: "', @p, '"'))
output(concat("<br>output: ", @o))

output(concat("<br><br>Check for all digits, no match"))
set @s = "12345x"
set @p = "^\d*$"
set @o = RegExMatch(@s, @p, 0)
output(concat("<br>string: ", @s))
output(concat('<br>pattern: "', @p, '"'))
output(concat("<br>output: ", @o))

output(concat("<br><br>Check for all digits, match"))
set @s = "12345"
set @p = "^\d*$"
set @o = RegExMatch(@s, @p, 0)
output(concat("<br>string: ", @s))
output(concat('<br>pattern: "', @p, '"'))
output(concat("<br>output: ", @o))

output(concat("<br><br>Replace parenthetical text with space"))
set @s = "whee (whatever it is) whoop"
set @p = "\s\(.+\)\s"
set @m = RegExMatch(@s, @p, 0, "IgnoreCase")
set @o = replace(@s, @m, " ")
output(concat("<br>string:  ", @s))
output(concat('<br>pattern: "', @p, '"'))
output(concat("<br>match: ", @m))
output(concat("<br>replaced: ", @o))

output(concat("<br><br>Retrieve accessToken value from REST response"))
set @s = '{"accessToken": "e68d15020fc64547b3de7a54bf82e40a", "expiresIn": 3600}'
set @p = '^{"accessToken": "(.*)",.*$'
set @o = RegExMatch(@s, @p, 1)
output(concat("<br>string: ", @s))
output(concat("<br>pattern: '", @p, "'"))
output(concat("<br>output: ", @o))

]%%
```

#### Output

```html
Strip leading zeroes from a string
string: 0000012345
pattern: "^0*(\d+)$"
output: 12345

Check for all digits, no match
string: 12345x
pattern: "^\d*$"
output:

Check for all digits, match
string: 12345
pattern: "^\d*$"
output: 12345

Replace parenthetical text with space
string: whee (whatever it is) whoop
pattern: "\s\(.+\)\s"
match: (whatever it is)
replaced: whee whoop

Retrieve accessToken value from REST response
string: {"accessToken": "e68d15020fc64547b3de7a54bf82e40a", "expiresIn": 3600}
pattern: '^{"accessToken": "(.*)",.*$'
output: e68d15020fc64547b3de7a54bf82e40a
```