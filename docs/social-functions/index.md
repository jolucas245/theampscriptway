---
title: "Social Functions"
---


AMPscript's social functions are designed to integrate with the social sharing features within Marketing Cloud. These functions allow you to generate links for sharing content on various social media platforms and to retrieve content that has been published to these platforms.

> **Note:** The availability and behavior of these functions may depend on the specific features enabled in your Marketing Cloud account, such as Social Studio.

### Key Functions

| Function | Description |
|---|---|
| `GetSocialPublishURL()` | Returns the URL of a social media message that has been published from Marketing Cloud. |
| `GetSocialShareURL()` | Creates a URL that allows a user to share a specific piece of content on a social network. |

### Example 1: Creating a Facebook Share Link

```html
%%[

  VAR @shareUrl, @facebookShareLink

  SET @shareUrl = "https://my.cloudpage.com/special-offer"
  SET @facebookShareLink = GetSocialShareURL("Facebook", @shareUrl)

]%%

<a href="%%=RedirectTo(@facebookShareLink)=%%" target="_blank">Share on Facebook</a>
```

### Example 2: Creating Links for Multiple Social Networks

```html
%%[

  VAR @shareUrl, @networks, @i, @network, @shareLink

  SET @shareUrl = "https://my.cloudpage.com/special-offer"
  SET @networks = "Facebook,Twitter,LinkedIn"

  SET @networkRows = BuildRowsetFromString(@networks, ",")

  FOR @i = 1 TO RowCount(@networkRows) DO
    SET @network = Field(Row(@networkRows, @i), 1)
    SET @shareLink = GetSocialShareURL(@network, @shareUrl)

]%%

  <a href="%%=RedirectTo(@shareLink)=%%" target="_blank">Share on %%=v(@network)=%%</a><br>

%%[
  NEXT @i
]%%
```

### Example 3: Retrieving the URL of Published Social Content

```html
%%[

  VAR @publishedUrl

  SET @publishedUrl = GetSocialPublishURL("Twitter", "my-tweet-key-123")

]%%

View our latest tweet: <a href="%%=RedirectTo(@publishedUrl)=%%" target="_blank">Click here</a>
```

By using these social functions, you can encourage subscribers to share your content on their social networks, increasing the reach and engagement of your marketing campaigns.
