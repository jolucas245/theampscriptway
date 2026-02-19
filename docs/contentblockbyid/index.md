---
title: "ContentBlockByID"
---


This function returns the content stored in the specified Content Block and optionally wraps the content in an [Impression Region](/beginimpressionregion).

### Arguments

`ContentBlockByID(1,2,3,4,5)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | Number | True | The ID of the content block to return. This can be specified as a String or Number. |
| 2 | String | False | Name of the [Impression Region](/beginimpressionregion) to associate with this Content Area |
| 3 | Boolean | False | Return an error if the content block cannot be found |
| 4 | String | False | Default content if an error occurs retrieving the content block specified in Ordinal 1 |
| 5 | Number | False | Numeric status code resulting from the retrieve. A value of `0` indicates the retrieve was successful, while `-1` indicates that the content was not found or empty |

> NOTE: The ID for the content block can be found in the Properties menu, accessible from the drop-down menu on the right-hand side of the Content Builder listing page.
>
> NOTE: This function is only for use with Content Builder assets. It does *not* retrieve content stored in Classic Content. To retrieve content from Classic Content by ID, use the [ContentAreaByID](/contentareabyid) function.

### Example 1

A Content Block named `LoyaltyGreeting` (ID: `5794`) contains the following code:

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

var @contentBlockID
set @contentBlockID = 5794 /* Content Builder\LoyaltyGreeting */

]%%
%%=ContentBlockByID(@contentBlockID)=%%
```

#### Output

```html
Hello, Curt!
```

### Example 2

A Content Block named `LoyaltyGreeting` (ID: `5794`) contains the following code:

```html
%%[

var @firstName
set @firstName = properCase(AttributeValue("FirstName"))

]%%
Hello, %%=v(@firstName)=%%!
```

In the scenario where a Content Block ID does not exist, fallback content is handled with the value of the fourth argument or by conditionally showing content based on the value of the `@retrieveStatus` variable:

```html
%%[

var @contentBlockID, @content, @retrieveStatus
set @contentBlockID = 9794 /* does not exist */
set @content = ContentBlockByID(@contentBlockID, "Greeting", 0, "Hello!", @retrieveStatus)

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