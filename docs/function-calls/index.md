---
title: "Function Calls"
---


AMPscript function calls are used to execute AMPscript at a specific location within an email message, landing page, or SMS message where the result of the script is desired. All AMPscript code and functions must be enclosed within opening and closing delimiters; otherwise, the code will be ignored by the system. Function calls will execute even when placed outside of a scripting statement, such as `SET` or `IF` blocks. When using brackets before and after AMPscript delimiters, it is important to include spaces between them.

### Arguments

| Ordinal | Type | Required | Description |
|---|---|---|---|
| N/A | N/A | N/A | The concept of "function-calls" in AMPscript does not take explicit arguments, as it describes the general mechanism of invoking AMPscript functions. |

> NOTE: Function calls outside of an AMPscript block must be introduced by the opening delimiter `%%=` and terminated by the closing delimiter `=%%`.
> NOTE: Function calls within an AMPscript block should not include the opening (`%%=`) and closing (`=%%`) delimiters.

### Example 1: Function Call Outside an AMPscript Block

This example demonstrates how to call a function directly to output a lowercase version of a variable named `Name`.

```html
%%=LOWERCASE(Name)=%%
```

### Example 2: Upserting Data with a Function Call Outside an AMPscript Block

This example shows a more complex function call to `UPSERTDE` (Upsert Data Extension) to update or insert data into a data extension. It includes multiple parameters, including a concatenated URL.

```html
%%=UPSERTDE("ent.CustomObject4", 2, "Region", "None", "Product", _SubscriberKey, "Available", 0, "Price", 100.77, "Inventory", 0, "ExpireDate", NOW(), "Url", CONCAT(SubscriberID, "Upsert"))=%%
```

### Example 3: Function Call Inside an AMPscript Block

This example demonstrates how to call a function within an AMPscript block, such as within a `SET` or `IF` statement. Note the absence of `%%=` and `=%%` delimiters around the `LOWERCASE` function call.

```html
%%[
    VAR @name, @lowerCaseName
    SET @name = "John Doe"
    /* Call the LOWERCASE function within the AMPscript block */
    SET @lowerCaseName = LOWERCASE(@name)

    IF NOT EMPTY(@lowerCaseName) THEN
        /* Output the result */
        Output(Concat("Lowercase Name: ", @lowerCaseName))
    ELSE
        Output("Name is empty or could not be converted to lowercase.")
    ENDIF
]%%
```