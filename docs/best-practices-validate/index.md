---
title: "Best Practice: Validate Before Send"
---

## Validate Before Send

Always validate your AMPscript code before sending to your full audience. Marketing Cloud provides several tools and techniques for previewing and testing AMPscript output to catch errors early.

### Preview and Test

Use the **Preview and Test** feature in Content Builder to render your email for specific subscribers. This executes your AMPscript against real subscriber data and shows you the final output.

### Validation Techniques

#### 1. Test with Edge Cases

Always test your code with subscribers who have missing or unusual data. This helps you find places where `EMPTY()` checks are missing.

```html
%%[

VAR @firstName
SET @firstName = AttributeValue("FirstName")

/* Defensive: always handle empty values */
IF EMPTY(@firstName) THEN
  SET @firstName = "Friend"
ENDIF

]%%

<p>Hello, %%=v(@firstName)=%%!</p>
```

#### 2. Use a Test Data Extension

Create a dedicated Test Data Extension with rows that cover various scenarios: empty fields, special characters, very long strings, and different data types.

#### 3. Use Output for Debugging

On CloudPages, use `Output()` to print intermediate variable values during development. Remove these before going live.

```html
%%[

VAR @rows, @rowCount
SET @rows = LookupRows("Offers", "Region", "US")
SET @rowCount = RowCount(@rows)

/* Debug output — remove before production */
Output(Concat("<pre>DEBUG: rowCount = ", @rowCount, "</pre>"))

]%%
```

#### 4. Test Send to a Small List

Before sending to your full audience, always perform a test send to a small list of internal recipients to verify the rendered output.

> NOTE: AMPscript errors in emails can cause the entire email to render blank for a subscriber, or even halt a send job. Thorough validation is essential to prevent production issues.
