---
title: "AMPscript and Guide Template Language"
---

Marketing Cloud provides three programmatic languages for content personalisation: AMPscript, Server-Side JavaScript (SSJS), and Guide Template Language (GTL). AMPscript and GTL are frequently used together, each playing a distinct role. AMPscript handles data retrieval, logic, and variable assignment. GTL handles the presentation of that data, in particular when the data is structured as JSON.

## What is Guide Template Language?

Guide Template Language (also referred to as Guide or GTL) is a declarative templating language used to create personalised messages within Marketing Cloud. It is based on the [Mustache.js](https://mustache.github.io/) and [Handlebars.js](https://handlebarsjs.com/) templating libraries, and valid templates from either of those libraries will generally work in GTL. Unlike AMPscript and SSJS, GTL is a templating language, not a scripting language. It has no imperative control flow of its own — it is designed to consume data and render it, not to compute it.

GTL can source data from:

- AMPscript or SSJS variables (via a `datasource` declaration)
- Sendable data extension fields
- Subscriber attributes
- JSON payloads passed via the Transactional Messaging API or Journey Builder API

## Execution Order

AMPscript executes first. GTL processes second. This order is fixed and cannot be changed.

This means:

- AMPscript can set variables that GTL will later consume.
- GTL can reference values extracted from AMPscript using `TreatAsContent()`.
- GTL **cannot** set AMPscript variables directly, nor can it call AMPscript functions after AMPscript has already finished executing.

## GTL Syntax Basics

A GTL expression begins with `{{` and ends with `}}`. When the template is rendered, these expressions are replaced with the corresponding values from the data source.

```
{{FirstName}}
```

Block helpers follow the Handlebars convention:

```
{{#each items}}
  {{ProductName}} — ${{Price}}
{{/each}}

{{#if IsVIP}}
  <p>Thank you for being a valued member.</p>
{{/if}}
```

To call an AMPscript function inline within a GTL context, use the `=` prefix:

```
{{=Now()}}
{{=FormatDate(Now(), "DD/MM/YYYY")}}
```

## Passing AMPscript Variables to GTL

GTL cannot directly read AMPscript variables using `{{@varName}}`. The correct approach is to declare a **datasource** of type `variable`, targeting the AMPscript variable that holds the JSON string.

```html
%%[
VAR @orderJson
SET @orderJson = AttributeValue("OrderPayload")
]%%

{{.datasource OrderData type=variable}}
  {{.data}}
    {"target":"@orderJson"}
  {{/data}}
{{/datasource}}

<p>Order number: {{OrderId}}</p>
<p>Total: {{OrderTotal}}</p>
```

GTL unwraps the JSON string stored in `@orderJson` and makes its fields available as template variables within the datasource block.

### Iterating Over a JSON Array

Given a JSON payload like:

```json
{
  "items": [
    {"ProductName": "Running Shoes", "Price": 89.99},
    {"ProductName": "Water Bottle", "Price": 14.99}
  ]
}
```

The GTL block to iterate over the array:

```html
%%[
VAR @cartJson
SET @cartJson = AttributeValue("CartPayload")
]%%

{{.datasource CartData type=variable}}
  {{.data}}
    {"target":"@cartJson"}
  {{/data}}

  <ul>
    {{#each items}}
      <li>{{ProductName}} — ${{Price}}</li>
    {{/each}}
  </ul>

{{/datasource}}
```

### Nested JSON

For nested objects, declare a second datasource of type `nested` inside the outer datasource, targeting the nested node:

```html
{{.datasource CartData type=variable}}
  {{.data}}
    {"target":"@cartJson"}
  {{/data}}

  {{.datasource RatingsData type=nested target=ProductRatings}}
    Average rating: {{AverageScore}}
  {{/datasource}}

{{/datasource}}
```

## Extracting GTL Values Back into AMPscript

To read a value resolved by GTL back into an AMPscript variable, use `TreatAsContent()`. This function processes the GTL expression at render time and returns its resolved value as a string:

```html
%%[
VAR @orderJson, @productName
SET @orderJson = AttributeValue("OrderPayload")
]%%

{{.datasource OrderData type=variable}}
  {{.data}}
    {"target":"@orderJson"}
  {{/data}}

%%[
SET @productName = TreatAsContent("{{ProductName}}")
]%%

{{/datasource}}

<p>You ordered: %%=v(@productName)=%%</p>
```

> **Note:** `TreatAsContent()` must be called from within the datasource block to have access to the GTL context.

## Accessing AMPscript Variables via Personalisation Strings

Outside of GTL datasource blocks, AMPscript variables can be referenced in personalisation strings using the `ctrl:var` tag. Include the `@` sign as part of the name to reference an AMPscript variable (as opposed to an SSJS variable):

```html
%%[
VAR @firstName
SET @firstName = AttributeValue("FirstName")
]%%

<ctrl:var name="@firstName" default="Subscriber"/>
```

Subscriber attributes and sendable data extension fields can be referenced directly using `ctrl:field`:

```html
<ctrl:field name="FirstName" default="Subscriber"/>
```

## When to Use GTL with AMPscript

The primary use case for combining GTL with AMPscript is **parsing JSON payloads passed at send time**, such as transactional emails triggered by an external system via the Transactional Messaging API or Journey Builder API. In these scenarios, the external system sends a JSON payload containing order details, reservation data, or other event-specific information. GTL provides a concise way to iterate over that data and render it in the email without needing to write verbose SSJS parsing logic.

For standard personalisation from a sendable data extension, AMPscript alone is the simpler and more widely supported choice. GTL adds value specifically when:

- The payload is a JSON string stored in a single data extension field.
- The data contains an array of items that must be looped over (e.g. order line items, product recommendations).
- The nesting depth of the JSON makes AMPscript string parsing impractical.

## Limitations and Practical Notes

GTL was introduced in 2016 but has seen limited investment since approximately 2017. As a result, the developer community has identified a number of practical constraints:

- GTL does not reliably support straight JSON arrays (`[...]`) without wrapping them in an object first.
- GTL behaviour in Cloud Pages and landing pages is inconsistent and not fully supported.
- Some Content Builder block types will strip GTL syntax when a block is edited after initial creation.
- The official documentation is incomplete and, in some cases, describes features that were never fully implemented.

For complex JSON parsing or scenarios requiring conditional logic beyond basic `{{#if}}` blocks, SSJS is generally more reliable and better documented. GTL and SSJS offer comparable processing speed for JSON parsing tasks.

> **Important:** Because GTL documentation is sparse and partially inaccurate, the [Salesforce Stack Exchange](https://salesforce.stackexchange.com/questions/tagged/gtl) community is a more reliable reference for edge cases than the official developer documentation.

## Delimiter Conflict with AMP for Email

If you are using GTL within an AMP for Email (`amp4email`) message, the `{{` and `}}` delimiters conflict with Mustache syntax used by `amp-mustache`. To resolve this, add the following GTL delimiter override comment at the very top of the HTML document:

```html
<!-- {{={< >}=}} -->
```

This instructs GTL to use `{<` and `>}` as its delimiters for the remainder of the document, avoiding the conflict with AMP's `{{ }}` syntax.

## Delimiter Reset in CloudPages and Landing Pages

When using GTL in a CloudPage or landing page alongside AMPscript, the `{{` and `}}` delimiters can conflict with the AMPscript OMM rendering engine. To prevent this, add the following string immediately before or after a closing AMPscript block:

```html
%%[ /* AMPscript block */ ]%%
%%{={{ }}=}%%

{{.datasource OrderData type=variable}}
  ...
{{/datasource}}
```

The `%%{={{ }}=}%%` token resets the GTL delimiter scope, allowing `{{ }}` tags to be interpreted as GTL rather than AMPscript syntax. This is only required in CloudPages and landing pages — email sends do not require it.