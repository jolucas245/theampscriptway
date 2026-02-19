---
title: "Best Practice: Try/Catch Error Handling"
---

## Try/Catch Error Handling

AMPscript does not natively support `try/catch` blocks like JavaScript or other languages. However, you can simulate error handling behavior using the `RaiseError()` function combined with strategic code patterns to gracefully handle errors and prevent broken renders in emails and CloudPages.

### Strategy 1: Using RaiseError to Skip a Subscriber

The `RaiseError()` function can be used to skip an individual subscriber during a send without halting the entire job. The third argument controls this behavior.

```html
%%[

VAR @email
SET @email = AttributeValue("EmailAddress")

/* If the email is invalid, skip this subscriber silently */
IF NOT IsEmailAddress(@email) THEN
  RaiseError("Invalid email address — skipping subscriber.", true)
ENDIF

]%%

<p>Hello, %%=v(AttributeValue("FirstName"))=%%!</p>
```

### Strategy 2: Defensive Data Retrieval with Empty Checks

Instead of relying on error catching, write defensive code that checks for empty or null values before using them.

```html
%%[

VAR @rows, @rowCount, @firstName, @output

SET @rows = LookupRows("Customers", "SubscriberKey", _subscriberKey)
SET @rowCount = RowCount(@rows)

IF @rowCount > 0 THEN
  SET @firstName = Field(Row(@rows, 1), "FirstName")

  IF NOT EMPTY(@firstName) THEN
    SET @output = Concat("Welcome back, ", @firstName, "!")
  ELSE
    SET @output = "Welcome back!"
  ENDIF
ELSE
  SET @output = "Welcome!"
ENDIF

]%%

<p>%%=v(@output)=%%</p>
```

### Strategy 3: Wrapping HTTP Calls with Status Checks

When making external API calls, always check the status code before processing the response.

```html
%%[

VAR @url, @response, @statusCode

SET @url = "https://api.example.com/offers"
SET @statusCode = HTTPGet(@url, @response)

IF @statusCode == 200 THEN
  /* Process the response */
  Output(Concat("<div>", @response, "</div>"))
ELSE
  /* Fallback content */
  Output("<div>Check out our latest offers on our website!</div>")
ENDIF

]%%
```

> NOTE: Since AMPscript lacks native exception handling, it is critical to validate all inputs, check `RowCount()` before iterating rowsets, and use `EMPTY()` checks before outputting variables. This defensive pattern is the closest equivalent to `try/catch` behavior in AMPscript.
