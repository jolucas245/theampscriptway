---
title: "v"
---


This function outputs the value of a variable. It is commonly used when a variable is defined within a code block and the result is displayed in an email, message or web page.

### Argument

`V(1)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | Variable value to output |

### Example

The following example returns the result of a variable from a code block and displays it inline within an HTML tag.

```html
%%[

var @firstName, @displayName

set @firstName = AttributeValue("First Name")

if empty(@firstName) then
  set @displayName = "friend"
else
  set @displayName = @firstName
endif

]%%
<p>Hello %%=v(@displayName)=%%,</p>
```

#### Output

The function will output the value of the variable. For a Sendable Data Extension containing the `First Name` field value `Barb`, the following output will be displayed:

```html
<p>Hello Barb,</p>
```