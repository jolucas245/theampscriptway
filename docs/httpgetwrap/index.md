---
title: "Httpgetwrap Command"
---


Prefixing an `href` attribute value in syndicated content with `HTTPGetWrap|` will track links in an email.

### Example

An `href` attribute is prefixed with a `HTTPGetWrap|` string in the external syndicated content.

```html
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
      <h1>Herman Melville - Moby-Dick</h1>
      <div>
        <p>Hadst thou taken this old <a href="HTTPGetWrap|http://limedash.com/blacksmith">blacksmith</a> to thyself ere his full ruin came upon him.</p>
      </div>
  </body>
</html>
```

> NOTE: The `httpgetwrap|` prefix must be enabled by Marketing Cloud Support. The special business rule is called `WRAP_HTTPGET_URLS`.