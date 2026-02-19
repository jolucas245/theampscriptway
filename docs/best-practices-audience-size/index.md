---
title: "Best Practices For Large Audiences"
---

## Best Practices: AMPscript Performance with Large Audiences

When sending emails to large audiences in Salesforce Marketing Cloud, the performance and efficiency of your AMPscript code become critically important. Inefficient code can lead to slow send speeds, timeouts, and a poor subscriber experience.

### 1. Minimize Per-Subscriber Processing

The most significant factor affecting send performance is the amount of processing required for each individual subscriber.

- **Use `Before;HTTPGet` for non-personalized content:** Fetches content only once per send job, rather than once per subscriber.
- **Pre-process data in a staging Data Extension:** Use a Query Activity to join and transform data before the send.

### 2. Optimize Data Extension Lookups

- **Use `LookupRows()` instead of multiple `Lookup()` calls:** Reduces the number of database queries.
- **Ensure your lookup columns are indexed:** Lookups on indexed columns are significantly faster.
- **Cache lookup results:** Store results in variables to avoid redundant lookups.

### Example: Optimizing Product Recommendations

**Efficient Approach using LookupRows():**

```html
%%[
  VAR @productIDs, @products, @rowCount, @i

  SET @productIDs = AttributeValue("RecommendedProductIDs")

  IF NOT EMPTY(@productIDs) THEN
    SET @products = LookupRows("Products", "ProductID", @productIDs)
    SET @rowCount = RowCount(@products)

    IF @rowCount > 0 THEN
      FOR @i = 1 TO @rowCount DO
        VAR @product, @productName, @productPrice
        SET @product = Row(@products, @i)
        SET @productName = Field(@product, "ProductName")
        SET @productPrice = Field(@product, "ProductPrice")
]%%
        <p>%%=v(@productName)=%% - $%%=v(@productPrice)=%%</p>
%%[
      NEXT @i
    ENDIF
  ENDIF
]%%
```

By following these best practices, you can ensure that your AMPscript code performs efficiently even when sending to millions of subscribers.
