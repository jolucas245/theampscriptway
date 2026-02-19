---
title: "StringToHex"
---


Converts each character in a given string to its hexadecimal equivalent. This function is useful for encoding string data, which can be necessary for various web-related tasks or data manipulation where hexadecimal representation is required.

### Arguments

| Ordinal | Type   | Required | Description                                                                                                                               |
| :------ | :----- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| 1       | String | True     | The string value that needs to be converted into its hexadecimal representation.                                                          |
| 2       | String | False    | The character set to be used for the encoding process. Accepted values are `UTF-8` (which is the default if not specified) and `UTF-16`. This parameter dictates the .NET character-encoding type utilized during conversion. |

### Example 1: Basic Use

This example demonstrates the basic conversion of a literal string to its hexadecimal representation using both default `UTF-8` and explicit `UTF-16` encoding.

```html
%%[
    /* Declare variables to hold the original string and its hexadecimal conversions */
    VAR @originalString
    VAR @hexStringUTF8
    VAR @hexStringUTF16

    /* Set the original string value */
    SET @originalString = "Hello World!"

    /* Convert the string to hexadecimal using the default UTF-8 encoding */
    SET @hexStringUTF8 = StringToHex(@originalString)

    /* Convert the string to hexadecimal explicitly using UTF-16 encoding */
    SET @hexStringUTF16 = StringToHex(@originalString, "UTF-16")
]%%

<p>Original String: %%=v(@originalString)=%%</p>
<p>Hex (UTF-8): %%=v(@hexStringUTF8)=%%</p>
<p>Hex (UTF-16): %%=v(@hexStringUTF16)=%%</p>
```

#### Output

```
Original String: Hello World!
Hex (UTF-8): 48656c6c6f20576f726c6421
Hex (UTF-16): 480065006c006c006f00200057006f0072006c0064002100
```

### Example 2: Advanced Scenario - Dynamic Content Conversion

This example shows how to convert a dynamic string, potentially retrieved from a Data Extension, to its hexadecimal equivalent. It includes defensive coding to handle cases where the source string might be empty.

```html
%%[
    /* Declare variables */
    VAR @customerName
    VAR @encodedCustomerName

    /* Simulate retrieving a customer name from a Data Extension or other source */
    /* For demonstration, we'll set a literal value. In a real scenario, this might be Lookup() or RequestParameter() */
    SET @customerName = "John Doe"
    /* SET @customerName = "" /* Uncomment to test with an empty string */

    /* Check if the customer name is not empty before attempting conversion */
    IF NOT EMPTY(@customerName) THEN
        /* Convert the customer name to hexadecimal using default UTF-8 encoding */
        SET @encodedCustomerName = StringToHex(@customerName)
    ELSE
        /* Handle the case where the customer name is empty */
        SET @encodedCustomerName = "Customer name not provided or empty."
    ENDIF
]%%

<p>Customer Name: %%=v(@customerName)=%%</p>
<p>Encoded Customer Name: %%=v(@encodedCustomerName)=%%</p>
```

#### Output (if @customerName is "John Doe")

```
Customer Name: John Doe
Encoded Customer Name: 4a6f686e20446f65
```

#### Output (if @customerName is empty)

```
Customer Name: 
Encoded Customer Name: Customer name not provided or empty.
```