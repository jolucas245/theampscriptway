---
title: "Dynamic Link Tracking"
---


AMPscript enables dynamic content to be included as an alias attribute in HTML anchor links within HTML email content. These values are then available in email engagement reports for tracking purposes.

### Arguments

`dynamic-link-tracking` is not a function that accepts direct arguments. Instead, it refers to the practice of embedding AMPscript within the `alias` attribute of an HTML `<a>` tag to dynamically set the link's tracking name. The AMPscript used within the `alias` attribute will typically involve other AMPscript functions to retrieve or construct the dynamic value.

| Ordinal | Type | Required | Description |
|---|---|---|---|
| N/A | N/A | N/A | `dynamic-link-tracking` is a concept, not a function with formal arguments. |

> NOTE: Web-Analytics Connector/Parameter Manager does not support alias values set by AMPscript. Any `linkname` values that contain AMPscript will appear as URL-encoded code, not the resulting value. It is recommended just to use static text for any aliases.

> NOTE: Inline AMPscript lookup functions are not supported in alias values.

> NOTE: By default, alias attributes and values do not appear in the final HTML output. If you’d like to see these values, you can have Salesforce Support enable the `SmartUrlEncoding` feature.

> NOTE: Marketing Cloud limits the number of unique resolved alias values to 100. If the number of unique alias names is greater than 100, the additional links will only be tracked by the link name, not by the alias name.

### Example 1: Basic Use

This example demonstrates how to use a `Lookup` function to retrieve a country value from a Data Extension and use it as a dynamic alias for link tracking. This allows for click engagement to be tracked based on a subscriber's country.

```html
%%[
    /* Define a variable to store the country value */
    VAR @country

    /* Look up the 'Country' from the 'Members' Data Extension based on the SubscriberKey */
    SET @country = Lookup('Members', 'Country', 'Subscriber Key', _subscriberKey)

    /* Check if the country value is not empty before using it in the alias */
    IF NOT EMPTY(@country) THEN
        /* Construct the dynamic link with the country as the alias */
        /* The v() function is used to output the AMPscript variable within the HTML attribute */
]%%
<a href="https://limedash.com" alias="%%=v(@country)=%%">Offer</a>
%%[
    ENDIF
]%%
```

### Example 2: Advanced Scenario with Multiple Dynamic Values

This example shows how to construct a more complex dynamic alias using multiple values, such as a product category and a campaign ID, to provide more granular tracking. This requires concatenating strings within the AMPscript block.

```html
%%[
    /* Define variables for product category and campaign ID */
    VAR @productCategory, @campaignID, @dynamicAlias

    /* Retrieve product category from a Data Extension */
    SET @productCategory = Lookup('ProductData', 'Category', 'ProductID', '12345')

    /* Retrieve campaign ID from a Data Extension or set a default */
    SET @campaignID = Lookup('Campaigns', 'CampaignID', 'CampaignName', 'SummerSale')
    IF EMPTY(@campaignID) THEN
        SET @campaignID = 'DefaultCampaign'
    ENDIF

    /* Check if both values are not empty before creating the alias */
    IF NOT EMPTY(@productCategory) AND NOT EMPTY(@campaignID) THEN
        /* Concatenate the values to form a comprehensive dynamic alias */
        SET @dynamicAlias = Concat(@productCategory, '-', @campaignID)
]%%
<a href="https://limedash.com/products" alias="%%=v(@dynamicAlias)=%%">View Products</a>
%%[
    ENDIF
]%%
```