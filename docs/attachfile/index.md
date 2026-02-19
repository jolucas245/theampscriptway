---
title: "AttachFile"
---


This function attaches the specified file to the outbound message or displays a link to the file when included in a landing page. This function returns no output.

### Arguments

`AttachFile(1,2,3,4,5,6,7,8)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | Type of location containing the file to attach. Valid values include:   * `ContentBuilder` * `FTP` * `HTTP` * `Portfolio` (Classic Content) |
| 2 | String | True | Path or key of the asset to attach. Specify the following for the preceding location:   * `ContentBuilder` – Customer/External Key of asset * `FTP` – Name of file in the Enhanced SFTP `Import` Folder * `HTTP` – HTTP/HTTPS URL of the asset * `Portfolio` – Customer/External Key of asset in Classic Content |
| 3 | String | False | Alias assigned to file when attached. If no value is specified, the name of the file is used.  If you do not specify an alias for `HTTP` type asset, the `Content-Disposition` from the HTTP header will be used. If no `Content-Disposition` is provided, a system-generated value will be returned. |
| 4 | Boolean | False | Show link to file in the *View as a Web Page* context. Default value is `false`.  This argument can only be used with the `HTTP` location type. |
| 5 | String | False | URL of the attachment to use in the *View as a Web Page* context. Default value is `false`.  This argument can only be used with the `HTTP` location type. |
| 6 | String | False | Link name for file in the *View as a Web Page* context.  This argument can only be used with the `HTTP` location type. |
| 7 | Number | False | Number of days the link to download the file appears in the *View as a Web Page* context.  This argument can only be used with the `HTTP` location type. |
| 8 | Boolean | False | When this *force\_attachment* indicator is `true`, the [content-disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition) of the file is set to *attachment*. When `false`, the content-disposition is set to *inline*. Default is `false` for *inline*, with some exceptions noted in the table below. |

> NOTE: Arguments 4 – 7 are unavailable in the current release of Marketing Cloud. This should be resolved in a future release.

Files of the following MIME types can be attached to email messages in Marketing Cloud:

| Extension | MIME Type | Default Content-Disposition |
| --- | --- | --- |
| `.csv` | `text/csv` | `attachment` |
| `.doc` | `application/msword` | `inline` |
| `.docm` | `application/vnd.ms-word.document.macroEnabled.12` | `inline` |
| `.docx` | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | `inline` |
| `.gif` | `image/gif` | `inline` |
| `.htm` | `text/html` | `inline` |
| `.html` | `text/html` | `inline` |
| `.ics` | `application/ics` or `text/calendar` | `inline` |
| `.jpeg` | `image/jpeg` | `inline` |
| `.jpg` | `image/jpeg` or `image/jpg` | `inline` |
| `.mp4` | `video/mp4` | `inline` |
| `.pdf` | `application/pdf` | `inline` |
| `.pkpass` | `application/vnd.apple.pkpass` | `inline` |
| `.png` | `image/png` or `image/x-png` | `inline` |
| `.ppt` | `application/vnd.ms-powerpoint` | `inline` |
| `.pptx` | `application/vnd.openxmlformats-officedocument.presentationml.presentation` | `inline` |
| `.rar` | `application/x-rar-compressed` | `inline` |
| `.rtf` | `application/rtf` or `text/rtf` | `inline` |
| `.tif` | `image/tiff` | `inline` |
| `.tiff` | `image/tiff` | `inline` |
| `.txt` | `text/plain` | `inline` |
| `.vcf` | `text/vcard` or `text/x-vcard` | `attachment` |
| `.wav` | `audio/wav` or `audio/x-wav` | `inline` |
| `.xls` | `application/vnd.ms-excel` | `inline` |
| `.xlsx` | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` | `inline` |
| `.xml` | `application/xml` | `inline` |
| `.xml` | `text/xml` | `attachment` |
| `.zip` | `application/x-zip-compressed` or `application/zip` | `inline` |

> NOTE: Marketing Cloud Support must provision this function for use in your account. There is typically an additional charge per attachment sent. Contact your Salesforce Account Executive to complete the process.
>
> NOTE: If the specified file cannot be found at send time, the send will throw a runtime error and abort.
>
> NOTE: If you are attaching an external file and the remote server does not respond within 30 seconds, the send will be scheduled to retry 15 minutes later.
>
> NOTE: Local assets in shared Content Builder or Portfolio locations are not supported.
>
> NOTE: MIME types `text/csv`, `application/xml`, `text/xml`, `text/vcard` and `text/x-vcard` have a default content-disposition of `attachment`, that cannot be overridden.

### Example 1

This example attaches a Content Builder asset by Customer/External Key:

```html
%%[

var @customerKey, @fileAlias
set @customerKey = "LoyaltyMembersCB"
set @fileAlias = "LoyaltyMembers_ContentBuilder.zip"

AttachFile("ContentBuilder", @customerKey, @fileAlias)

]%%
```

### Example 2

This example attaches a file from the Marketing Cloud `Import` folder:

```html
%%[

var @fileName, @fileAlias
set @fileName = "LoyaltyMembers.zip"
set @fileAlias = "LoyaltyMembers_FTP.zip"

AttachFile("FTP", @fileName, @fileAlias)

]%%
```

### Example 3

This example attaches a file from an external website via HTTP/HTTPS:

```html
%%[

var @fileName, @fileAlias
set @fileName = "https://limedash.com/drop/LoyaltyMembers.zip"
set @fileAlias = "LoyaltyMembers.zip"

AttachFile("HTTP", @fileName, @fileAlias)

]%%
```

### Example 4

This example attaches a file from the Portfolio asset by Customer/External Key:

```html
%%[

var @externalKey, @fileAlias
set @externalKey = "LoyaltyMembers"
set @fileAlias = "LoyaltyMembers_Portfolio.zip"

AttachFile("Portfolio", @externalKey, @fileAlias)

]%%
```