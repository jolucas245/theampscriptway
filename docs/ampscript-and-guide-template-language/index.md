---
title: "Ampscript & Guide Template Language"
---

## Overview

Marketing Cloud provides templating features through [Guide Template Language](https://developer.salesforce.com/docs/atlas.en-us.mc-programmatic-content.meta/mc-programmatic-content/guideTemplateLanguage.htm) (also referred to as ‘Guide’ or ‘GTL’) which is based on the Mustache and Handlebars.js template engines.

[Mustache](https://mustache.github.io), aptly named after its curly brace syntax that resembles a sideways mustache, is a popular template engine that is widely available across different languages and runtimes. Built on a simple syntax, Mustache provides a ‘logic-less’ approach to templating, as it lacks explicit control flow statements like ‘if’ and ‘else’ conditionals or ‘loops’; however, both looping and conditional evaluation can be achieved using built-in block helpers.

[Handlebars](http://handlebarsjs.com) is a superset of Mustache and uses helpers, literals and partials to add extensibility and minimal logic to Mustache.

Using these two template engines, Guide provides a declarative syntax that leverages the advantages of template-based content architecture, while also retaining interoperability with AMPscript and Server Side JavaScript (SSJS) scripting languages. Guide can be used in any platform application that publishes personalized content, including:

* Email messages
* SMS messages
* Mobile Push notifications
* CloudPage landing pages

> NOTE: Guide is not a *scripting* language. Rather, it’s a *templating* language. While simple conditional statements and process loops can be achieved in Guide through built-in block helpers, it’s not designed as a replacement for AMPscript.