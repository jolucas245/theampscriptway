---
title: "ContentArea"
---


This function returns the content stored in the specified Content Area and optionally wraps the content in an [Impression Region](/beginimpressionregion).

### Arguments

`ContentArea(1,2,3,4,5)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | Number | True | The ID of the Content Area to return. This can be specified as a String or Number. |
| 2 | String | False | Name of the [Impression Region](/beginimpressionregion) to associate with the Content Area |
| 3 | Boolean | False | Return an error if the Content Area cannot be found |
| 4 | String | False | Default content to return if an error occurs from retrieving the Content Area specified in Ordinal 1 |
| 5 | Number | False | Numeric status code resulting from the retrieve. A value of `0` indicates the retrieve was successful, while `-1` indicates that the content was not found or empty. |

> NOTE: The ID for the Content Area can be found in the Properties dialog accessible from the Content Area folder listing page.
>
> NOTE: This function is only for use with Classic Content areas. It does *not* retrieve content stored in Content Builder. To retrieve content from Content Builder with an ID, use the [ContentBlockByID](/contentblockbyid) function.

### Example 1

A Content Area named `LoyaltyGreeting` (ID: `11437`) contains the following code:

```html
%%[

var @firstName
set @firstName = properCase(AttributeValue("FirstName"))

]%%
Hello, %%=v(@firstName)=%%!
```

The Content Area can be referenced as:

```html
%%[

var @contentAreaID
set @contentAreaID = 11437 /* my contents\LoyaltyGreeting */

]%%
%%=ContentArea(@contentAreaID)=%%
```

#### Output

```html
Hello, Curt!
```

### Example 2

A Content Area named `LoyaltyGreeting` (ID: `11437`) contains the following code:

```html
%%[

var @firstName
set @firstName = properCase(AttributeValue("FirstName"))

]%%
Hello, %%=v(@firstName)=%%!
```

In the scenario where the Content Area ID does not exist, fallback content is handled using the value of the fourth argument, or by conditionally showing content based on the value of the `@retrieveStatus` variable.

```html
%%[

var @contentAreaID, @content, @retrieveStatus
set @contentAreaID = 11434 /* does not exist */
set @content = ContentArea(@contentAreaID, "Greeting", 0, "Hello!", @retrieveStatus)

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