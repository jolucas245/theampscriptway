---
title: "SetValue"
---


This function sets the value of an AMPscript variable inside a block.

### Arguments

`SetValue(1,2)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | AMPscript variable name |
| 2 | String | True | AMPscript variable value |

> NOTE: Prefixing the variable name with an `@` character is optional.

### Example

```html
<script runat="server">

Platform.Load("core","1.1.5");

var firstName = Attribute.GetValue("FirstName"); /* value from attribute or DE column in send context */
firstName = "Lily"; /* or a literal value */

Variable.SetValue("@firstName", firstName);

</script>
firstName: %%=v(@firstName)=%%
```

#### Output

```html
firstName: Lily
```