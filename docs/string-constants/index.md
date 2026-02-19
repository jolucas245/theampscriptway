---
title: "String Constants"
---


A string constant (also known as a string literal) is a fixed sequence of characters used in AMPscript. These are fundamental for assigning text values to variables, passing arguments to functions, and defining content directly within your code.

In AMPscript, string constants must be enclosed in either single (`'`) or double (`"`) quotes.

### Syntax

```html
"This is a string constant using double quotes."

'This is a string constant using single quotes.'
```

### Example 1: Assigning a String Constant to a Variable

```html
%%[

  VAR @myString

  SET @myString = "Hello, AMPscript!"

]%%

Value of @myString: %%=v(@myString)=%%
```

#### Output

```html
Value of @myString: Hello, AMPscript!
```

### Example 2: Using Single and Double Quotes

**String containing single quotes:**

```html
%%[
  VAR @message
  SET @message = "It's a beautiful day."
]%%

%%=v(@message)=%%
```

**String containing double quotes:**

```html
%%[
  VAR @quote
  SET @quote = 'He said, "Hello!"'
]%%

%%=v(@quote)=%%
```

### Example 3: Escaping Quotes

If you need to include the same type of quote within your string as you used to delimit it, you must "escape" it by doubling it up.

**Escaping a double quote within a double-quoted string:**

```html
%%[
  VAR @jsonString

  SET @jsonString = "{ ""name"": ""John Doe"" }"

]%%

%%=v(@jsonString)=%%
```

#### Output

```html
{ "name": "John Doe" }
```

**Escaping a single quote within a single-quoted string:**

```html
%%[
  VAR @possessive

  SET @possessive = 'It''s John''s book.'

]%%

%%=v(@possessive)=%%
```

#### Output

```html
It's John's book.
```

> NOTE: Unlike many other programming languages, AMPscript does not use a backslash to escape characters. You must double the quote character to escape it.
