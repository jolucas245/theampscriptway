---
title: "ContentBlockByKey"
---


This function returns the content stored in the specified Content Block and optionally wraps the content in an [Impression Region](/beginimpressionregion).

### Arguments

`ContentBlockByKey(1,2,3,4,5)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | The Customer Key of the content block to return. |
| 2 | String | False | Name of the [Impression Region](/beginimpressionregion) to associate with this Content Area |
| 3 | Boolean | False | Return an error if the content block cannot be found |
| 4 | String | False | Default content if an error occurs retrieving the content block specified in Ordinal 1 |
| 5 | Number | False | Numeric status code resulting from the retrieve. A value of `0` indicates the retrieve was successful, while `-1` indicates that the content was not found or empty. |

> NOTE: The Customer Key for the Content Block can be found in the Properties menu, accessible from the drop-down menu, on the right-hand side of the Content Block listing page.
>
> NOTE: This function is only for use with Content Builder assets. It does *not* retrieve content stored in Classic Content.

### Example 1

A Content Block named `LoyaltyGreeting` (Customer Key: `2db254de-7b89-4daf-93af-0db2b5a00b83`) contains the following code:

```html
%%[

var @firstName
set @firstName = properCase(AttributeValue("FirstName"))

]%%
Hello, %%=v(@firstName)=%%!
```

The Content Block can be referenced as:

```html
%%[

var @contentBlockKey
set @contentBlockKey = "2db254de-7b89-4daf-93af-0db2b5a00b83" /* Content Builder\LoyaltyGreeting */

]%%
%%=ContentBlockByKey(@contentBlockKey)=%%
```

#### Output

```html
Hello, Curt!
```

### Example 2

A Content Block named `LoyaltyGreeting` (Customer Key: `2db254de-7b89-4daf-93af-0db2b5a00b83`) contains the following code:

```html
%%[

var @firstName
set @firstName = properCase(AttributeValue("FirstName"))

]%%
Hello, %%=v(@firstName)=%%!
```

In the scenario where the Content Block Key does not exist, fallback content is handled with the value of the fourth argument or by conditionally showing content based on the value of the `@retrieveStatus` variable:

```html
%%[

var @contentBlockKey, @content, @retrieveStatus
set @contentBlockKey = "2db254de-7b89-4daf-93af-0db2b5a00b99" /* does not exist */
set @content = ContentBlockByKey(@contentBlockKey, "Greeting", 0, "Hello!", @retrieveStatus)

output(concat(@content))

if @retrieveStatus < 0 then
  output(concat('<br><br><a href="https://limedash.com/join">Join Now</a> &raquo;'))
endif

]%%
```

#### Output

```html
Hello!

<a href="https://limedash.com/join">Join Now</a> &raquo;
```