---
title: "Script Block Organization"
---


Taking time to organize your AMPscript code blocks has many advantages. Most importantly, it makes your code much easier to debug. It’s also a show of goodwill (and expertise) to those coming after you who will need to make sense of your code. Some of these practices aren’t specific to AMPscript:

* It is good practice to place the majority of your AMPscript code at the top of the email or web page. This will make your code easier to find and maintain.
* Do not try to hide your AMPscript code with HTML comments or blocks. This often leads to inadvertent code inclusion, especially in the text-only version of your email.
* Use descriptive variable names and match them exactly to your send context field names where possible. As you get into more complex scripting scenarios, this will make a big difference.
* Take the time to add comments to your AMPscript code. Sometimes it’s helpful to rough out the logic of your solution with comments and fill in the code afterward.
* Align opening and closing script block tags: `%%[` and `]%%`.
* Align `if`, `else` and `endif` elements as well as your `for` and `next` blocks.
* Instead of using a string of nested, in-line AMPscript functions to display a variable value in the body of your email or web page, create a variable for it at the top of the email or web page and reference it with a short `v()` function. This organization technique keeps the logic centralized and the body less cluttered.

You will note that that the Marketing Cloud visual editors (WYSIWYG) are not always optimized for displaying nicely formatted AMPscript code. The built-in indention and parsing is not perfect and may undo your code formatting efforts. This can be mitigated by not using the visual editor content blocks and sticking with HTML-only ones.