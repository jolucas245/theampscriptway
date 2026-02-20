---
title: "AMPscript and Server-Side JavaScript"
---

Salesforce Marketing Cloud supports three programmatic languages: AMPscript, Server-Side JavaScript (SSJS), and Guide Template Language (GTL). AMPscript and SSJS are both scripting languages that execute on the server before content is delivered, but they have different strengths, syntax, and support across channel types.

### Key Differences

| Feature | AMPscript | SSJS |
|---|---|---|
| Syntax | Custom (`%%[ ]%%`) | ECMAScript 3 |
| Best for | Email personalisation, data lookups | Complex logic, JSON parsing, API integrations |
| Email support | Full support | Limited — no `try/catch` wrapping of AMPscript errors |
| CloudPages support | Full support | Full support |
| Error handling | `RaiseError()` | `try/catch` blocks |
| Loops | `FOR/NEXT` only | `for`, `while`, `do-while`, `for-in` |
| JSON parsing | Not natively supported | `Platform.Function.ParseJSON()` |
| HTTP requests | `HTTPGet()`, `HTTPPost()`, `HTTPPostWithRetry()` | `HTTP.Get()`, `HTTP.Post()` via `Script.Util.HttpRequest` |

### Using Both Together

AMPscript and SSJS can coexist in the same content block. Content is processed in document order — whichever block appears first in the HTML renders first. This means a SSJS block that appears before an AMPscript block can set variables that AMPscript will read.

**Passing a value from SSJS to AMPscript** uses `Variable.SetValue()`:

```html
<script runat="server">
  Platform.Load("core", "1.1.1");

  /* Parse a JSON response and extract a value */
  var response = HTTP.Get("https://api.example.com/data");
  var data = Platform.Function.ParseJSON(response);
  var productName = data.productName;

  /* Pass the extracted value into an AMPscript variable */
  Variable.SetValue("@productName", productName);
</script>

%%[
  /* AMPscript reads the variable set by SSJS above */
  IF NOT EMPTY(@productName) THEN
    Output(Concat("<p>Featured product: ", @productName, "</p>"))
  ENDIF
]%%
```

**Passing a value from AMPscript to SSJS** uses `Variable.GetValue()`:

```html
%%[
VAR @subscriberKey
SET @subscriberKey = AttributeValue("_subscriberkey")
]%%

<script runat="server">
  Platform.Load("core", "1.1.1");

  /* Read the AMPscript variable into SSJS */
  var subKey = Variable.GetValue("@subscriberKey");

  /* Use the value in SSJS logic */
  var rows = Platform.Function.LookupRows("Orders", "SubscriberKey", subKey);
</script>
```

> NOTE: In email messages, SSJS support is more limited than in CloudPages. For email content, AMPscript is the recommended language. SSJS is best suited for CloudPages, landing pages, and Script Activities in Automation Studio where full server-side processing is available.

> NOTE: `Variable.SetValue()` and `Variable.GetValue()` are SSJS functions. `Variable.SetValue("@varName", value)` writes to an AMPscript variable. `Variable.GetValue("@varName")` reads from one. The `@` prefix must be included in the variable name string when referencing AMPscript variables.