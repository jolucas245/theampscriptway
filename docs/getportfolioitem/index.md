---
title: "GetPortfolioItem"
---


The `GetPortfolioItem` function retrieves the content of a file stored in the Portfolio section of Salesforce Marketing Cloud. This function is particularly useful for centralizing content such as HTML snippets, text blocks, or other reusable assets that can be dynamically inserted into emails, landing pages, or other Marketing Cloud assets.

### Arguments

| Ordinal | Type   | Required | Description                                                              |
|---------|--------|----------|--------------------------------------------------------------------------|
| 1       | String | Yes      | The external key of the Portfolio item to retrieve its content.          |

> NOTE: The `GetPortfolioItem` function retrieves the raw content of the Portfolio item. If the content is HTML, it will be returned as a string and will need to be rendered appropriately within the context it is used (e.g., within an HTML email).

### Example 1: Basic Use

This example demonstrates how to retrieve and display the content of a simple text file stored in the Portfolio with the external key "MyTextContent".

```html
%%[
    /* Define the external key of the Portfolio item */
    VAR @portfolioExternalKey, @portfolioContent
    SET @portfolioExternalKey = "MyTextContent"

    /* Check if the external key is not empty before attempting to retrieve the content */
    IF NOT EMPTY(@portfolioExternalKey) THEN
        SET @portfolioContent = GetPortfolioItem(@portfolioExternalKey)
    ELSE
        SET @portfolioContent = "Error: Portfolio external key is empty."
    ENDIF

    /* Output the retrieved content */
    IF NOT EMPTY(@portfolioContent) THEN
        Output(Concat("<!-- Content from Portfolio Item: -->\n", @portfolioContent))
    ELSE
        Output(Concat("<!-- No content found for Portfolio Item: ", @portfolioExternalKey, " -->"))
    ENDIF
]%%
```

### Example 2: Advanced Scenario - Retrieving HTML Snippets

This example shows how to retrieve an HTML snippet from the Portfolio and include it in an email. Assume a Portfolio item with external key "HeaderHTML" contains a reusable HTML header.

```html
%%[
    /* Define the external key for the HTML header Portfolio item */
    VAR @headerExternalKey, @htmlHeader
    SET @headerExternalKey = "HeaderHTML"

    /* Retrieve the HTML content, ensuring the external key is valid */
    IF NOT EMPTY(@headerExternalKey) THEN
        SET @htmlHeader = GetPortfolioItem(@headerExternalKey)
    ELSE
        SET @htmlHeader = "<!-- Error: Header Portfolio external key is empty. -->"
    ENDIF
]%%
<!DOCTYPE html>
<html>
<head>
    <title>Email with Dynamic Header</title>
</head>
<body>
    %%=v(@htmlHeader)=%%
    
    <p>This is the main body of the email.</p>
    
    <p>Best regards,</p>
    <p>Your Team</p>
</body>
</html>
```