---
title: "Redirect"
---


The `redirect` function in AMPscript is used to immediately redirect a user's browser from the current landing page to a specified URL. This function is typically employed on CloudPages or other landing pages within Salesforce Marketing Cloud to guide users to external websites, other CloudPages, or specific content based on business logic.

### Arguments

| Ordinal | Type   | Required | Description                                       |
|---------|--------|----------|---------------------------------------------------|
| 1       | String | Yes      | The URL to which the user's browser will be redirected. |

> NOTE: The `redirect` function is designed for use on landing pages (e.g., CloudPages). Any AMPscript or HTML code placed before the `redirect` function on the page will be processed and potentially rendered before the redirection occurs. Code placed after the `redirect` function will not be executed.

### Example 1: Basic Use

This example demonstrates a simple redirection to a static URL. This is useful for forwarding users to a company's main website after they visit a specific landing page.

```html
%%[
    /* Define the destination URL */
    SET @redirectUrl = "https://www.example.com/thank-you";

    /* Check if the URL is not empty before redirecting */
    IF NOT EMPTY(@redirectUrl) THEN
        Redirect(@redirectUrl);
    ENDIF
]%%
```

### Example 2: Conditional Redirection

This example shows how to conditionally redirect a user based on a query parameter. If a 'source' parameter is present and matches 'campaignA', the user is redirected to a specific campaign page; otherwise, they are sent to a default page. This allows for dynamic user journeys.

```html
%%[
    /* Retrieve a query parameter named 'source' */
    SET @source = RequestParameter("source");
    SET @defaultUrl = "https://www.example.com/default-page";
    SET @campaignAUrl = "https://www.example.com/campaignA-landing";
    SET @finalRedirectUrl = @defaultUrl;

    /* Check if the 'source' parameter is not empty and matches a specific value */
    IF NOT EMPTY(@source) AND @source == "campaignA" THEN
        SET @finalRedirectUrl = @campaignAUrl;
    ENDIF

    /* Ensure the final URL is not empty before redirecting */
    IF NOT EMPTY(@finalRedirectUrl) THEN
        Redirect(@finalRedirectUrl);
    ENDIF
]%%
```