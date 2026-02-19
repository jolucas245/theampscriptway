---
title: "Syntax"
---


The content syndication syntax uses an `HTTPGet` command suffixed with a URL. This string should be contained within `%%` delimiters. The syndicated content will be returned where the string appears in the email or landing page.

> NOTE: Content Syndication is only supported on HTTP port 80 and HTTPS port 443. The use of non-standard ports will result in an error.

### Example

The following string is used on a landing page:

```html
%%httpget "https://httpbin.org/html"%%
```

#### Output

This string will output the content from the URL on the landing page:

```html
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
      <h1>Herman Melville - Moby-Dick</h1>
      <div>
        <p>
          Availing himself of the mild, summer-cool weather that now reigned in these latitudes, and in preparation for the peculiarly active pursuits ... Hadst thou taken this old blacksmith to thyself ere his full ruin came upon him, then had the young widow had a delicious grief, and her orphans a truly venerable, legendary sire to dream of in their after years; and all of them a care-killing competency.
        </p>
      </div>
  </body>
</html>
```