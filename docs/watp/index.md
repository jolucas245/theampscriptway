---
title: "WATP"
---


This function represents an ordinal placeholder for parameter values configured in the [WAT](/wat) string(s). It can only be set as part of the WAT string configuration by Marketing Cloud Support. Output is included in the result of the `WAT` function call. See the [WAT example](/wat) for more context.

### Argument

`WATP(1)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | Number | True | Ordinal value that represents the position of the parameter value in the WAT string |

### Example

In the WAT string, the WATP parameters are ordinal placeholders for the parameter values. The first value gets `WATP(1)`, the second is `WATP(2)` and so on:

```html
verifyParams,?verify=%%=urlencode(lowercase(trim(WATP(1))))=%%
```

```html
nameParams,?fName=%%=urlencode(WATP(1))=%%&lName=%%=urlencode(WATP(2))=%%
```