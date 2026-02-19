---
title: "Einstein Email Recommendation Functions"
---


Einstein Email Recommendations use machine learning to personalize email content for each subscriber based on their browsing and purchase behavior. AMPscript provides functions to integrate Einstein recommendations directly into your email templates.

### How It Works

Einstein Recommendations analyze subscriber behavior (web browsing, email clicks, purchase history) and generate personalized product or content recommendations. These are delivered via a special content block or through AMPscript-accessible Data Extensions.

### Implementation

Einstein Recommendations are typically implemented using a combination of:

1. **Content Builder Blocks**: Einstein provides a drag-and-drop recommendation block that can be added to emails.
2. **AMPscript with Data Extensions**: For advanced customization, you can use `LookupRows()` against the Einstein Recommendations Data Extension to retrieve and display recommendations with full control over the HTML output.

### Example: Custom Einstein Recommendations Display

```html
%%[

VAR @recs, @recCount, @i

/* Retrieve Einstein recommendations for this subscriber */
SET @recs = LookupRows("EinsteinEmailRecommendations", "SubscriberKey", _subscriberKey)
SET @recCount = RowCount(@recs)

IF @recCount > 0 THEN
  FOR @i = 1 TO MIN(4, @recCount) DO
    VAR @row, @productName, @productURL, @imageURL, @price
    SET @row = Row(@recs, @i)
    SET @productName = Field(@row, "ProductName")
    SET @productURL = Field(@row, "ProductURL")
    SET @imageURL = Field(@row, "ImageURL")
    SET @price = Field(@row, "Price")

    IF NOT EMPTY(@productName) AND NOT EMPTY(@productURL) THEN
]%%
    <table role="presentation" width="150" style="display:inline-block;vertical-align:top;padding:5px;">
      <tr><td><a href="%%=RedirectTo(@productURL)=%%"><img src="%%=v(@imageURL)=%%" width="140" alt="%%=v(@productName)=%%" /></a></td></tr>
      <tr><td style="font-size:13px;">%%=v(@productName)=%%</td></tr>
      <tr><td style="font-weight:bold;">$%%=v(@price)=%%</td></tr>
    </table>
%%[
    ENDIF
  NEXT @i
ENDIF

]%%
```

> NOTE: The exact Data Extension name and column names for Einstein Recommendations may vary based on your Marketing Cloud configuration. Consult your Einstein setup to verify the correct names.
