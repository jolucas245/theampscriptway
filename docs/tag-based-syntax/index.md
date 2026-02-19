---
title: "Tag Based Syntax"
---


As an alternative to the AMPscript block syntax, the HTML script tag is also supported. This syntax can be beneficial when developing in both Server-Side JavaScript (SSJS) and AMPscript, as it provides a standardized syntax for interpreting both server-side scripting languages.

Additional `runat` and `language` attributes must be included in the opening script tag for the containing code to be interpreted as AMPscript, as indicated in the example below.

```html
<script runat="server" language="ampscript">

/* AMPscript code */

</script>
```