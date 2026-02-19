---
title: "ClaimRowValue"
---


The `ClaimRowValue` function retrieves a value from a single column in a Data Extension row, and simultaneously "claims" that row to prevent it from being used by another operation. This is most commonly used for distributing unique, single-use items like coupon codes or promotion IDs.

> NOTE: The Data Extension name in this function must be a static string. You cannot use a variable to specify the Data Extension name.

### Arguments

`ClaimRowValue(1, 2, 3, 4, [5a, 5b]...)`

| Ordinal | Type | Required | Description |
|---|---|---|---|
| 1 | String | True | The name of the Data Extension to retrieve the value from. |
| 2 | String | True | The name of the column from which to return a value. |
| 3 | String | True | The name of the boolean column that indicates if a row has been claimed. |
| 4 | String | True | The value that indicates a row has been claimed (e.g., "true", "Y"). |
| 5a | String | True | The name of a column to use for filtering which row to claim. |
| 5b | String | True | The value to match in the filter column. |

### Example 1: Claiming a Unique Coupon Code

```html
%%[

  VAR @couponCode, @subscriberKey
  SET @subscriberKey = AttributeValue("_subscriberkey")

  IF NOT EMPTY(@subscriberKey) THEN

    SET @couponCode = ClaimRowValue("CouponCodes", "CouponCode", "IsClaimed", "true", "SubscriberKey", @subscriberKey)

  ENDIF

]%%

Your unique coupon code is: %%=v(@couponCode)=%%
```

### Example 2: Handling No Available Coupons

```html
%%[

  VAR @couponCode, @subscriberKey, @message
  SET @subscriberKey = AttributeValue("_subscriberkey")

  IF NOT EMPTY(@subscriberKey) THEN

    SET @couponCode = ClaimRowValue("CouponCodes", "CouponCode", "IsClaimed", "true", "SubscriberKey", @subscriberKey)

    IF NOT EMPTY(@couponCode) THEN
      SET @message = CONCAT("Your unique coupon code is: ", @couponCode)
    ELSE
      SET @message = "We're sorry, but all of our coupons have been claimed."
      InsertData("CouponStockAlerts", "Event", "NoCouponsAvailable", "Timestamp", NOW())
    ENDIF

  ENDIF

]%%

%%=v(@message)=%%
```
