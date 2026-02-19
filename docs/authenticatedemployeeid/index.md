---
title: "AuthenticatedEmployeeID"
---


This function returns the numeric identifier of the authenticated Marketing Cloud account user who is accessing the page. This is useful when creating customized pages for child Business Units (a feature available in earlier Enterprise 2.0 accounts).

### Arguments

`AuthenticatedEmployeeID()`

This function does not accept any arguments.

> NOTE: This function will only return the correct value when used in classic landing pages or microsites (a feature available in earlier Enterprise 2.0 accounts). When used in CloudPages, it will return the value related to the user who created the CloudPage, not a value related to the user who is accessing the page from the public URL.

### Example

The following example uses the [Lookup](/lookup) function on a customized page to conditionally display content based on the Marketing Cloud account user identifier of the user accessing the page with an active Marketing Cloud session (see note).

```html
%%[

var @EmployeeID, @role

set @EmployeeID = AuthenticatedEmployeeID()

set @role = Lookup("Employees", "Role", "ID", @EmployeeID)

if @role == "Manager" then

]%%
<h2>Welcome to the Management Marketing Cloud Portal</h2>
<!-- management content here -->
%%[ else ]%%
<h2>Welcome to the Staff Marketing Cloud Portal</h2>
<!-- staff content here -->
%%[ endif ]%%
```

#### Output

If the Lookup function returns `Manager` for the `@employeeId` variable, the following content will be displayed:

```html
<h2>Welcome to the Management Marketing Cloud Portal</h2>
<!-- management content here -->
```