---
title: "Ampscript And Server Side Javascript"
---


Salesforce Marketing Cloud supports two server-side scripting languages: AMPscript and Server-Side JavaScript (SSJS). Both are processed on the server before content is delivered to the subscriber, but they have different capabilities and use cases.

### Key Differences

| Feature | AMPscript | SSJS |
| --- | --- | --- |
| Syntax | Custom (%%[ ]%%) | ECMAScript 3 |
| Best for | Email personalization, data lookups | Complex logic, API integrations |
| Email support | Full support | Limited (via `<script runat="server">`) |
| CloudPages support | Full support | Full support |
| Error handling | RaiseError() only | try/catch |
| Loops | FOR/NEXT only | for, while, do-while, for-in |
| HTTP methods | GET, POST only | GET, POST, PUT, PATCH, DELETE (via Script.Util) |

### Using Both Together

AMPscript and SSJS can be used in the same content block. A common pattern is to use SSJS for complex data processing on CloudPages and AMPscript for email personalization.

```html
/* SSJS block for complex processing */
<script runat="server">
  Platform.Load("core","1.1.1");
  var prox = new Script.Util.WSProxy();
  // Complex API calls or data processing here
  Variable.SetValue("@result", "some value");
</script>

/* AMPscript can access the variable set by SSJS */
%%[
  Output(Concat("Result from SSJS: ", @result))
]%%
```

> NOTE: In emails, SSJS support is limited. AMPscript is the recommended language for email personalization. SSJS is best suited for CloudPages and landing pages where full server-side processing is available.
