---
title: "Content Model Functions"
---


Content Model functions in AMPscript provide access to content from the Content Builder data model. These functions are used to retrieve and display content blocks stored in Content Builder by their ID, Customer Key, or name.

### Available Functions

| Function | Description |
| --- | --- |
| [ContentBlockByID](/contentblockbyid) | Returns the content of a Content Builder block by its numeric ID. |
| [ContentBlockByKey](/contentblockbykey) | Returns the content of a Content Builder block by its Customer Key. |
| [ContentBlockByName](/contentblockbyname) | Returns the content of a Content Builder block by its name and folder path. |
| [ContentImageByID](/contentimagebyid) | Returns an HTML image tag for a Content Builder image asset by its ID. |
| [ContentImageByKey](/contentimagebykey) | Returns an HTML image tag for a Content Builder image asset by its Customer Key. |

> NOTE: These functions replace the older Classic Content functions (`ContentArea`, `ContentAreaByName`) for accounts using Content Builder. It is recommended to use these functions for all new development.
