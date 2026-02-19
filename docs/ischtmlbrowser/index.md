---
title: "IsCHTMLBrowser"
---


This function checks whether a given user agent value is a C-HTML browser.

C-HTML, or Compact HTML, is a subset of the HTML markup language that was developed for small information devices, such as first-generation smart phones and PDAs. The language does not support tables, image maps, multiple fonts or styling of fonts, background colors or images, frames, or style sheets, and is limited to a monochromatic display. This standard was superseded in early 2000 by other markup languages, due to advancements in mobile technology.

This function is only available in landing pages, microsites and CloudPages. It cannot be used in other Marketing Cloud applications.

### Argument

`IsCHTMLBrowser(1)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | HTTP user-agent header |

The function will return a Boolean value, either `true` or `false`.

### Example

The following example uses the `HTTPRequestHeader` function to retrieve the `user-agent` HTTP header as an argument to the IsCHTMLBrowser function.

```html
%%[

var @chtmlBrowser

if IsCHTMLBrowser(HTTPRequestHeader("user-agent")) then
   set @chtmlBrowser = true
endif

]%%
You %%=Iif(@chtmlBrowser==true,"are","are not")=%% using a C-HTML browser
```

#### Output

The following output will be returned when viewing the web page on an Android or iOS device.

```html
You are not using a C-HTML browser
```