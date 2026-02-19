---
title: "Upsertcontact"
---


The `UpsertContact` function inserts a new Contact or updates an existing Contact record in Marketing Cloud. Currently, this function is specific to the MobileConnect channel. It returns `0` if the upsert was successful and `1` if an error occurred during the process.

> **NOTE:** At this time, the only supported channel is `mobile` and the only supported matching attribute is `phone`.

### Arguments

| Ordinal | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| 1 | String | Yes | The Contact channel. Only the value `"mobile"` is supported. |
| 2 | String | Yes | The attribute used to match the Contact. Only the value `"phone"` is supported. |
| 3 | String / Integer | Yes | The mobile phone number including the country code (e.g., `13153695271`). |
| 4 | String | Yes | The name of the demographic or system attribute to upsert. |
| 5 | String / Integer | Yes | The value to upsert for the attribute defined in ordinal 4. |
| 6a | String | No | An additional attribute name to upsert. |
| 6b | String / Integer | No | The value for the additional attribute. |

> **NOTE:** Arguments `6a` and `6b` can be repeated indefinitely to update multiple attributes in a single function call. You can update both System Attributes (like `_City`, `_State`, `_FirstName`) and custom User-Created Attributes from your MobileConnect Demographics.

### Example 1: Basic Mobile Contact Upsert

This example demonstrates how to perform a basic upsert for a mobile contact, updating their core system attributes. 

```html
%%[
/* Declare variables */
VAR @upsertResult, @mobileNumber, @firstName, @city

/* Set contact details */
SET @mobileNumber = "15551234567"
SET @firstName = "Alice"
SET @city = "Indianapolis"

/* Defensive check: Ensure we have a phone number before upserting */
IF NOT EMPTY(@mobileNumber) THEN

    /* Upsert the mobile contact */
    SET @upsertResult = UpsertContact(
        "mobile", /* 1. Channel */
        "phone", /* 2. Match Attribute */
        @mobileNumber, /* 3. Phone Number */
        "_FirstName", @firstName, /* 4 & 5. Attribute & Value */
        "_City", @city /* 6a & 6b. Additional Attribute & Value */
    )

ENDIF
]%%

Result Code: %%=v(@upsertResult)=%%
```

### Example 2: Handling the Return Value and Custom Attributes

In a production scenario, you should handle the boolean-like return value (`0` for success, `1` for error) to ensure data integrity. This example updates both system attributes and a custom user-created attribute (`Loyalty_Tier`), then outputs a conditional message based on the operation's success.

```html
%%[
VAR @resultCode, @phone, @fName, @lName, @loyaltyTier, @message

/* Retrieve data from the send context or a Data Extension */
SET @phone = AttributeValue("MobilePhone")
SET @fName = AttributeValue("FirstName")
SET @lName = AttributeValue("LastName")
SET @loyaltyTier = "Gold"

/* Defensive programming: proceed only if the critical key exists */
IF NOT EMPTY(@phone) THEN
    
    /* Attempt to upsert the contact with multiple attributes */
    SET @resultCode = UpsertContact(
        "mobile", 
        "phone", 
        @phone, 
        "_FirstName", @fName,
        "_LastName", @lName,
        "Loyalty_Tier", @loyaltyTier,
        "_UTCOffset", -5
    )
    
    /* Evaluate the integer result from the function */
    IF @resultCode == 0 THEN
        SET @message = "Contact successfully created or updated in MobileConnect."
    ELSE
        SET @message = "Error: Failed to upsert the contact."
        
        /* Optional: Log this failure to a Data Extension using InsertDE() */
        /* InsertDE("Error_Logs", "Phone", @phone, "Error", "UpsertContact Failed") */
    ENDIF

ELSE
    SET @message = "No valid phone number provided."
ENDIF
]%%

<p>%%=v(@message)=%%</p>
```
