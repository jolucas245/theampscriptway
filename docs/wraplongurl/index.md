---
title: "WrapLongURL"
---


This function shortens URLs longer than 975 characters to mitigate broken email hyperlinks in Microsoft Outlook, where lengths of URL hyperlinks are limited to the following number of characters:

* Outlook 2007: 975 characters
* Outlook 2010: 1033 characters
* Outlook 2013: 2048 characters

The function shortens a URL by substituting the original URL with a shorter platform URL. The platform URL redirects requests to the original URL when requested by the user agent.

### Argument

`WrapLongURL(1)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | URL to be shortened |

> NOTE: This function does not shorten URLs less than 975 characters in length.
>
> NOTE: URLs will only be shortened when the email is sent.

### Example

```html
%%[

var @icon
set @icon = "https://limedash.com/images/rRprc5xG8vP0crpSqWLScVu6yKLTm...lKJK9m1napRdf6b+DAy/ixM.jpg" /* abbreviated for display purposes */

]%%
<img src="%%=WrapLongURL(@icon)=%%" width="50" height="50" alt="icon" />
```

#### Output

The value of the `src` attribute will be shortened to a URL which redirects to the original URL.

```html
http://cl.exct.net/ResolveURL.aspx?qs=faebf571997acc80ec99646da21ae0ab
```