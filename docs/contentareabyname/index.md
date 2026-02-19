---
title: "ContentAreaByName"
---


This function returns the content stored in the specified Content Area and optionally wraps the content in an [Impression Region](/beginimpressionregion).

### Arguments

`ContentAreaByName(1,2,3,4,5)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | The full path of the Content Area to return |
| 2 | String | False | Name of the [Impression Region](/beginimpressionregion) to associate with this Content Area |
| 3 | Boolean | False | Return an error if the Content Area cannot be found |
| 4 | String | False | Default content if an error occurs retrieving the Content Area specified in Ordinal 1 |
| 5 | Number | False | Numeric status code resulting from the retrieve. A value of `0` indicates the retrieve was successful, while `-1` indicates that the content was not found or empty. |

> NOTE: This function is only for use with Classic Content areas. It does *not* retrieve content stored in Content Builder. To retrieve content from Content Builder by name, use the [ContentBlockByName](/contentblockbyname) function.

### Example 1

A Content Area named `LoyaltyGreeting` in the `my contents` folder contains the following code:

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

var @contentAreaPath
set @contentAreaPath = "my contents\LoyaltyGreeting"

]%%
%%=ContentAreaByName(@contentAreaPath)=%%
```

#### Output

```html
Hello, Curt!
```

### Example 2

A Content Area named `LoyaltyGreeting` in the `my contents` folder contains the following code:

```html
%%[

var @firstName
set @firstName = properCase(AttributeValue("FirstName"))

]%%
Hello, %%=v(@firstName)=%%!
```

In the scenario where the Content Area does not exist, fallback content is handled with the value of the fourth argument, or by conditionally showing content based on the value of the `@retrieveStatus` variable:

```html
%%[

var @contentAreaPath, @content, @retrieveStatus
set @contentAreaPath = "my contents\LoyaltyGreeting_Oops"  /* does not exist */
set @content = ContentAreaByName(@contentAreaPath, "Greeting", 0, "Hello!", @retrieveStatus)

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