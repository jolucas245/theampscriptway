---
title: "Best Practice: Coding Defensively"
---

## best-practices-coding-defensively

**Description:** "Coding defensively" in AMPscript refers to the practice of writing robust and resilient code that anticipates and handles potential issues such as missing data, null values, or unexpected input. This approach minimizes errors, improves script stability, and enhances the user experience by preventing crashes or displaying unintended content. It involves using various AMPscript functions and logical constructs to validate data, provide fallbacks, and gracefully manage exceptions.

### Arguments

This is not a standalone AMPscript function with direct arguments. Instead, "best-practices-coding-defensively" is a conceptual guideline that involves the strategic use of existing AMPscript functions and programming constructs to ensure code reliability and error handling.

> NOTE: Defensive coding practices are crucial for all AMPscript implementations, especially in personalized emails and CloudPages, where data variability is common. Always assume data may be missing or malformed.

### Example 1: Basic Use with `Empty()` and `AttributeValue()`

This example demonstrates how to defensively retrieve a subscriber's first name, providing a fallback if the attribute is empty or not found.

```html
%%[VAR @firstName]

/* Attempt to retrieve the 'FirstName' attribute. */
SET @firstName = AttributeValue("FirstName")

/* Check if the retrieved value is empty. */
IF NOT Empty(@firstName) THEN
    /* If not empty, use the retrieved first name. */
    SET @firstName = ProperCase(@firstName)
ELSE
    /* If empty, provide a default value. */
    SET @firstName = "Friend"
ENDIF

/* Output the personalized greeting. */
]%%
Hello, %%=v(@firstName)=%%!
```

### Example 2: Advanced Scenario with `Lookup()` and `RaiseError()`

This example illustrates defensive coding when performing a `Lookup()` to a Data Extension, including error handling with `RaiseError()` if critical data is not found.

```html
%%[
VAR @subscriberKey, @orderID, @productName, @productPrice

/* Set a default subscriber key for testing or if not available. */
SET @subscriberKey = AttributeValue("SubscriberKey")
IF Empty(@subscriberKey) THEN
    SET @subscriberKey = "default_subscriber"
ENDIF

/* Perform a lookup to an 'Orders' Data Extension. */
SET @orderID = Lookup("Orders", "OrderID", "SubscriberKey", @subscriberKey)

/* Check if an order was found. */
IF NOT Empty(@orderID) THEN
    /* If an order is found, retrieve product details. */
    SET @productName = Lookup("OrderDetails", "ProductName", "OrderID", @orderID)
    SET @productPrice = Lookup("OrderDetails", "ProductPrice", "OrderID", @orderID)

    /* Check if product details are available. */
    IF NOT Empty(@productName) AND NOT Empty(@productPrice) THEN
        /* Output order details. */
]%%
Your latest order (ID: %%=v(@orderID)=%%) includes:
Product: %%=v(@productName)=%%
Price: $%%=v(@productPrice)=%%
%%[
    ELSE
        /* If product details are missing, provide a fallback or raise an error. */
        /* In this case, we'll raise an error as product details are critical. */
        RaiseError("Product details missing for Order ID: " + @orderID, true)
    ENDIF
ELSE
    /* If no order is found, provide a friendly message. */
]%%
It looks like you don't have any recent orders with us. Feel free to browse our latest products!
%%[
ENDIF
]%%
```