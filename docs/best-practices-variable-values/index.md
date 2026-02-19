---
title: "Best Practice: Writing Variable Values"
---

## Writing Variable Values

When debugging AMPscript, one of the most effective techniques is to output the values of your variables at different points in the code. This helps you identify where unexpected values or empty strings are causing issues.

### Technique 1: Strip Down to AMPscript Only

If your syntax is correct but you are dealing with runtime errors, strip out all HTML from your email or CloudPage, leaving just your AMPscript. If that does not give you some direction, reduce your code to the minimum that works, then slowly add to it until it breaks. While this is repetitive, it can get you to the problem area quickly.

### Technique 2: Output Variable Values Inline

Use the `Output()` function to write variable values directly into the rendered content. This makes it easy to see what AMPscript is resolving at each step.

```html
%%[

VAR @subscriberKey, @rows, @rowCount, @firstName

SET @subscriberKey = _subscriberKey
SET @rows = LookupRows("Customers", "SubscriberKey", @subscriberKey)
SET @rowCount = RowCount(@rows)

/* Debug: output key variable values */
Output(Concat("<pre>"))
Output(Concat("subscriberKey: ", @subscriberKey, "<br>"))
Output(Concat("rowCount: ", @rowCount, "<br>"))

IF @rowCount > 0 THEN
  SET @firstName = Field(Row(@rows, 1), "FirstName")
  Output(Concat("firstName: ", @firstName, "<br>"))
ELSE
  Output(Concat("firstName: [NO ROWS FOUND]<br>"))
ENDIF

Output(Concat("</pre>"))

]%%
```

### Technique 3: Conditional Debug Mode

Use a query parameter or a Data Extension flag to enable debug output only during testing, so you can leave the debug code in place without showing it to subscribers.

```html
%%[

VAR @debugMode
SET @debugMode = RequestParameter("debug")

/* ... your AMPscript logic here ... */

IF @debugMode == "true" THEN
  Output(Concat("<div style='background:#ffe0e0;padding:10px;font-family:monospace;'>"))
  Output(Concat("DEBUG: @subscriberKey = ", @subscriberKey, "<br>"))
  Output(Concat("DEBUG: @rowCount = ", @rowCount, "<br>"))
  Output(Concat("</div>"))
ENDIF

]%%
```

> NOTE: Always remove or disable debug `Output()` calls before deploying to production. Outputting variable values in a live email send can expose sensitive subscriber data and create rendering issues.
