---
title: "Ampscript And Guide Template Language Syntax"
---


AMPscript and Guide Template Language (GTL) are both scripting approaches available in Salesforce Marketing Cloud, but they use different syntax and serve slightly different purposes.

### AMPscript Syntax

AMPscript uses percentage-bracket delimiters:

```html
%%[ /* Block syntax */ ]%%
%%=expression=%% /* Inline syntax */
```

### Guide Template Language (GTL) Syntax

GTL uses double curly braces, similar to Handlebars or Mustache:

```
{{FirstName}}
{{#if Condition}}...{{/if}}
```

### When to Use Which

- **AMPscript** is the more mature, fully-featured language with extensive function support. Use it for complex logic, data lookups, API calls, and most production use cases.
- **GTL** is simpler and more readable for basic personalization and conditional content. It is often preferred for simpler email templates.

> NOTE: AMPscript and GTL can be used in the same email, but mixing them extensively can make the code harder to maintain. Choose one as your primary language for each template.

For more details, see [AMPscript and GTL](/ampscript-and-gtl).
