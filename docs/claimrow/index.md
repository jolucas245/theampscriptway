---
title: "ClaimRow"
---


The `ClaimRow` function returns and reserves a single row from a Data Extension to prevent it from being used by another operation. This is commonly used for managing unique coupon codes or promotional offers where each subscriber must receive a unique value.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | Yes | The name of the Data Extension to retrieve the row from. This value must be a hard-coded string and cannot be a variable. |
| 2 | String | Yes | The name of the boolean column used to mark the row as claimed. This column must have a default value of `false`. |
| 3 | String | Yes | The name of the column that will store the identifier of the entity that claimed the row (e.g., `SubscriberKey`). |
| 4 | String | Yes | The value to be inserted into the column specified in the third argument. This is typically the `SubscriberKey` or another unique identifier. |
| 5+ | String | No | You can optionally include additional pairs of column names and values to update other columns in the claimed row. |

> NOTE: This function only works in emails and landing pages. It will cause an exception if no unclaimed rows are available in the Data Extension.

### Example 1: Basic Use

This example demonstrates how to claim a unique coupon code for a subscriber from a Data Extension named `CouponCodes`.

```html
%%[

/* Ensure a SubscriberKey is available */
if not empty(@SubscriberKey) then

  /* Claim a row from the CouponCodes Data Extension */
  set @couponRow = ClaimRow("CouponCodes", "IsClaimed", "SubscriberKey", @SubscriberKey)

  /* Check if a row was successfully claimed */
  if not empty(@couponRow) then
    set @couponCode = Field(@couponRow, "CouponCode")
  else
    /* Fallback if no coupons are available */
    set @couponCode = "N/A"
  endif

endif

]%%

Coupon Code: %%=v(@couponCode)=%%
```

### Example 2: Advanced Scenario

This example shows how to claim a coupon and also update an additional field, `ClaimedDate`, with the current timestamp.

```html
%%[

/* Ensure a SubscriberKey is available */
if not empty(@SubscriberKey) then

  /* Claim a row and update the ClaimedDate */
  set @couponRow = ClaimRow("CouponCodes", "IsClaimed", "SubscriberKey", @SubscriberKey, "ClaimedDate", Now())

  /* Check if a row was successfully claimed */
  if not empty(@couponRow) then
    set @couponCode = Field(@couponRow, "CouponCode")
    set @claimedDate = Field(@couponRow, "ClaimedDate")
  else
    /* Fallback if no coupons are available */
    set @couponCode = "N/A"
    set @claimedDate = ""
  endif

endif

]%%

Coupon Code: %%=v(@couponCode)=%%<br>
Claimed Date: %%=v(@claimedDate)=%%
```