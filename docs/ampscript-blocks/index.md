---
title: "Ampscript Blocks"
---


AMPscript blocks are used to contain AMPscript code that is processed by the Marketing Cloud server. These blocks are delimited by `%%[` and `]%%` and can contain any number of AMPscript functions, declarations, and other statements. Unlike inline AMPscript, code within an AMPscript block is not displayed in the final output unless explicitly printed using a function like `Output()` or `OutputLine()`.

### Syntax

```html
%%[
  /* Your AMPscript code goes here */
]%%
```

### Example 1: Basic Variable Declaration and Output

This example demonstrates how to declare variables, perform a simple calculation, and then output the result within an AMPscript block.

```html
%%[

  VAR @firstName, @lastName, @fullName

  SET @firstName = "John"
  SET @lastName = "Doe"

  IF NOT EMPTY(@firstName) AND NOT EMPTY(@lastName) THEN
    SET @fullName = CONCAT(@firstName, " ", @lastName)
  ELSE
    SET @fullName = "Valued Customer"
  ENDIF

]%%

Hello, %%=v(@fullName)=%%!
```

#### Output

```html
Hello, John Doe!
```

### Example 2: Using AMPscript Blocks for Conditional Logic

This example shows how to use an AMPscript block to implement conditional logic to display different content based on a subscriber's attribute.

```html
%%[

  VAR @membershipLevel
  SET @membershipLevel = AttributeValue("MembershipLevel")

]%%

%%[ IF @membershipLevel == "Gold" THEN ]%%

  <p>As a Gold member, you get exclusive access to our premium content!</p>

%%[ ELSEIF @membershipLevel == "Silver" THEN ]%%

  <p>As a Silver member, you have access to our standard content.</p>

%%[ ELSE ]%%

  <p>Welcome to our site! Please consider subscribing to unlock more content.</p>

%%[ ENDIF ]%%
```

> NOTE: It is a best practice to keep your AMPscript logic separate from your HTML presentation. You can use AMPscript blocks to prepare all your data and logic at the top of your email or page, and then use inline AMPscript (`%%=v(variable)=%%`) to display the results in your HTML.
