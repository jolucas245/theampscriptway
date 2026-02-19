---
title: "CreateSalesforceObject"
---


This function creates a new record in a Salesforce object. The Salesforce 18-digit object identifier is returned by the function.

### Arguments

`CreateSalesforceObject(1,2,3,4,[5a,5b...])`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | API name of the Salesforce object |
| 2 | Integer | True | Number of fields inserted when creating the record |
| 3 | String | True | API field name |
| 4 | String, integer or Boolean | True | Value to insert |
| 5a | String | False | Additional API field name (see note) |
| 5b | String, integer or Boolean | False | Additional value to insert (see note) |

> NOTE: Additional API field name and value pairs can be appended as arguments. The quantity of pairs should match parameter 2.
>
> NOTE: This function can only be used to create records in standard or custom Salesforce objects, not other objects such as big objects or external objects.

### Example

The following code is used on a landing page for a Lead Capture form. When the user completes the form, the `CreateSalesforceObject` function creates a new Lead record in Sales Cloud from the form field values and displays the 18-digit Salesforce identifier of the new record on the page.

```html
%%[

if RequestParameter("submitted") == true then

  var @createLead
  set @createLead = CreateSalesforceObject(
        "Lead", 4,
        "FirstName", RequestParameter("firstname"),
        "LastName", RequestParameter("lastname"),
        "Company", RequestParameter("company"),
        "Email", RequestParameter("email")
       )

endif

]%%
<!DOCTYPE html>
<html>
   <body>
      %%[ if not empty(@createLead) then ]%%
         <p>%%=v(@createLead)=%% record created in Lead Object</p>
      %%[ endif ]%%
      <h2>Register</h2>
      <form action="%%=RequestParameter('PAGEURL')=%%" method="post">
         <label>First name</label>
         <input type="text" name="firstname">
         <label>Last name</label>
         <input type="text" name="lastname">
         <label>Company</label>
         <input type="text" name="company">
         <label>Email</label>
         <input type="text" name="email">
         <input name="submitted" type="hidden" value="true" />
         <input type="submit" value="Submit">
      </form>
   </body>
</html>
```

#### Output

The following element will be displayed on the page, before the form. `00Q6F00001APnymUAD` is the Salesforce identifier of the new record.

```html
<p>00Q6F00001APnymUAD record created in Lead Object</p>
```