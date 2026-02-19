---
title: "Naming Convention"
---


Consistent naming conventions in AMPscript improve code readability and maintainability, especially in complex implementations with many variables and Data Extension references.

### Variable Naming

AMPscript variables are prefixed with `@`. The most common convention is **camelCase**:

```html
%%[
VAR @firstName, @lastName, @orderTotal, @loyaltyTier
VAR @rowCount, @currentRow, @productImageURL
]%%
```

### Data Extension Naming

Use clear, descriptive names for Data Extensions. Common conventions include:

- **PascalCase**: `CustomerOrders`, `ProductCatalog`, `LoyaltyMembers`
- **With prefix**: `DE_CustomerOrders`, `Send_WeeklyNewsletter`

### Content Block Naming

Use a consistent naming pattern for Content Block Customer Keys:

- `header-email-default`
- `footer-legal-en`
- `module-product-recommendations`

### Best Practices

1. **Be descriptive**: `@orderSubtotal` is better than `@os` or `@val1`.
2. **Be consistent**: Pick one convention and stick with it across your organization.
3. **Avoid reserved words**: Do not use AMPscript function names or keywords as variable names.
4. **Use prefixes for scope**: When using multiple Content Blocks, prefix variables with the module name to avoid collisions (e.g., `@header_firstName` vs `@footer_legalText`).
