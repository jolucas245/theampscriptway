---
title: "Script Blocks"
---


Script blocks can also be included within code blocks to whether the containing code should be interpreted. Two attributes can be included in a script block: `name` and `type`.

#### Example 1

In the example below, the `HTTPGet` function will only be executed if the execution context is ‘post’.

```html
%%[

[type="post"] HTTPGet("https://limedash.com/webhook")

]%%
```

#### Example 2

In the example below, the `HTTPGet` function will only be executed if the execution context is ‘post’ and the name `callback` is specified.

```html
%%[

[name="callback";type="post"] HTTPGet("https://limedash.com/webhook")

]%%
```

> NOTE: Script blocks must be completed within the same script block section. For example, if the script block includes an `if` statement, the `endif` statement must reside within the same script block.