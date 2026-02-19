---
title: "Ampscript And Gtl"
---


### Description
`ampscript-and-gtl` is not a specific AMPscript function, but rather a conceptual term referring to the **interaction and co-existence of AMPscript and Guide Template Language (GTL)** within Salesforce Marketing Cloud. Both are powerful scripting and templating languages used for personalization and dynamic content generation, often employed together to leverage their respective strengths. AMPscript is a server-side scripting language primarily used for data manipulation, conditional logic, and integration with Marketing Cloud data. GTL, based on Handlebars.js and Mustache.js, is a declarative templating language ideal for rendering complex data structures, especially JSON, and iterating over collections.

### Arguments
| Ordinal | Type | Required | Description |
|---|---|---|---|
| N/A | N/A | N/A | This is not a function and therefore does not accept arguments. |

### Notes
> NOTE: AMPscript is generally executed first on the server, allowing it to prepare data or set variables that GTL can then consume. GTL excels at presenting this data in a structured and readable format, particularly when dealing with nested data or arrays. While both can perform similar tasks to some extent, combining them often leads to more efficient, readable, and maintainable code, especially in complex personalization scenarios.

> NOTE: It is crucial to understand the execution order: AMPscript processes first, then GTL. This means AMPscript can set variables that GTL can access, but GTL cannot directly modify AMPscript variables or execute AMPscript functions after its own processing has begun.

### Example 1: Basic Use - Passing AMPscript Variable to GTL
This example demonstrates how an AMPscript variable can be defined and then accessed within a GTL block to display personalized content.

```html
%%[VAR @firstName, @productName]
SET @firstName = "John"
SET @productName = "Premium Widget"
]%%

<p>Hello {{.data.firstName}}!</p>
<p>Your recommended product is {{.data.productName}}.</p>

<script runat="server" language="ampscript">
    /* This script block demonstrates how AMPscript can prepare data for GTL. */
    /* The VAR declaration is good practice for defensive coding. */
    /* The SET statements assign values to the AMPscript variables. */
</script>

<script runat="server" language="javascript">
    /* This JavaScript block is used to bridge AMPscript variables to GTL's data context. */
    Platform.Load("core", "1.1.1");
    var firstName = Variable.GetValue("@firstName");
    var productName = Variable.GetValue("@productName");
    
    /* The following line makes the AMPscript variables available to GTL. */
    /* It's important to properly format the JSON for GTL consumption. */
    Write("{{#with .data}}");
    Write("{{/with}}");
</script>

<custom name="opencounter" type="tracking">
```

### Example 2: Advanced Scenario - Parsing JSON with GTL and Using AMPscript for Fallback
This example shows how GTL can parse a JSON string, and AMPscript can provide a fallback or handle data preparation if the JSON is not available or malformed.

```html
%%[VAR @jsonString, @defaultProduct]
SET @jsonString = '{"items": [{"name": "Product A", "price": 10.99}, {"name": "Product B", "price": 20.50}]}'
SET @defaultProduct = "Standard Item"

/* Check if the JSON string is not empty before attempting to process it. */
IF NOT EMPTY(@jsonString) THEN
    /* This AMPscript block prepares the JSON string. */
    /* In a real scenario, this might come from a Data Extension or API call. */
ENDIF
]%%

<script runat="server" language="javascript">
    Platform.Load("core", "1.1.1");
    var jsonString = Variable.GetValue("@jsonString");
    var defaultProduct = Variable.GetValue("@defaultProduct");

    if (jsonString) {
        /* Parse the JSON string and make it available to GTL. */
        var data = Platform.ParseJSON(jsonString);
        Variable.SetValue("gtlData", data);
    } else {
        /* Provide a fallback if JSON is empty, using the AMPscript default. */
        Variable.SetValue("gtlData", { items: [{ name: defaultProduct, price: 0.00 }] });
    }
</script>

{{#if gtlData.items}}
    <h3>Recommended Products:</h3>
    <ul>
        {{#each gtlData.items}}
            <li>{{name}} - ${{price}}</li>
        {{/each}}
    </ul>
{{else}}
    <p>No specific recommendations. Consider our {{.data.defaultProduct}}.</p>
{{/if}}

<script runat="server" language="ampscript">
    /* This AMPscript block could be used for further processing or logging after GTL. */
    /* For example, logging which product was displayed. */
    /* Defensive coding with comments for clarity. */
</script>
```