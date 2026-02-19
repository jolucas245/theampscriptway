---
title: "Inline Ampscript"
---


Inline AMPscript is used to output a value directly within the body of an email, landing page, or SMS message. Unlike AMPscript blocks (delimited by `%%[` and `]%%`), inline AMPscript is designed specifically for displaying values within HTML or text content without needing a full code block.

Inline AMPscript is enclosed by `%%=` and `=%%` delimiters.

### Syntax

```html
%%=expression=%%
```

The most common inline AMPscript expression uses the `v()` function to output the value of a variable:

```html
%%=v(@variableName)=%%
```

### Example 1: Basic Use

This example outputs the value of a variable set in an AMPscript block.

```html
%%[

VAR @firstName
SET @firstName = AttributeValue("FirstName")

IF EMPTY(@firstName) THEN
  SET @firstName = "Valued Customer"
ENDIF

]%%

<p>Hello, %%=v(@firstName)=%%!</p>
```

### Example 2: Inline Function Calls

Inline AMPscript can also execute functions directly, without needing to store the result in a variable first.

```html
/* Output a formatted date directly inline */
<p>Today's date: %%=Format(Now(), "MMMM dd, yyyy")=%%</p>

/* Output a Proper Case name directly */
<p>Welcome, %%=ProperCase(AttributeValue("FirstName"))=%%!</p>

/* Output a lookup value directly */
<p>Your city: %%=Lookup("Subscribers", "City", "SubscriberKey", _subscriberKey)=%%</p>
```

### Example 3: Using Inline AMPscript in HTML Attributes

Inline AMPscript is commonly used inside HTML attributes, such as `href` and `src`, for dynamic links and images.

```html
%%[

VAR @profileURL, @imageURL
SET @profileURL = CloudPagesURL(456)
SET @imageURL = Concat("https://cdn.example.com/images/", _subscriberKey, ".jpg")

]%%

<a href="%%=RedirectTo(@profileURL)=%%">View Your Profile</a>

<img src="%%=v(@imageURL)=%%" alt="Profile Image" />
```

> NOTE: When using inline AMPscript inside an `href` attribute, always wrap the URL with `RedirectTo()` to ensure proper link tracking in Marketing Cloud.
