---
path: understanding-css-specificity-rules
date: 2021-06-30T17:14:35.768Z
title: Understanding CSS specificity rules
description: >-
  CSS specificity rules are tricky to understand. In this blog post we will
  learn how to master it.
---
If you have ever worked with CSS, I bet you already faced a situation where some CSS changes were not being applied and using the \`!import\` statement at the end of it magically worked but, you had no idea why.

![Magic](/assets/magic.gif)

Using \`!important\` is basically overriding one of the most important rules of CSS, the specificity rule. It is much like using a nuclear explosion to stop the foxes from killing your chickens. Yes, the foxes will be killed, but so will the chickens. And the neighbourhood. It also makes debugging your CSS a nightmare (from personal, empirical, experience).

To know how to avoid it we first need to understand what a wreck is this SPECIFICITY RULE. So, let's deep dive into it.

Given the following code, guess what would be the color for boxes 1, 2 and 3.

```html
<html>
    <head>
        <style>
            .box {
                width: 100px;
                height: 100px;
                margin: 20px;
                background-color: blue;
            }
            body div {
                background-color: red;
            }
            body div:first-of-type.box {
                background-color: yellow;
            }
            #box-2 {
                background-color: orange;
            }
        </style>
    </head>
    <body>
        <div class="box">Box 1</div>
        <div class="box" id="box-2">Box 2</div>
        <div class="box" style="background-color: grey">Box 3</div>
    </body>
</html>
```

Interesting enough, there is no blue color in any of the boxes. Check the [code sandbox example](https://codesandbox.io/s/blue-sun-s8vcv?file=/index.html) out and play with it live.
