---
path: understanding-css-specificity-rules
date: 2021-06-30T17:14:35.768Z
title: Understanding CSS specificity rules
description: >-
  CSS specificity rules are tricky to understand. In this blog post we will
  learn how to master it.
---
If you have ever worked with CSS, I bet you have already faced a situation where some CSS changes were not getting applied as expected, making no sense at all. The solution ended up using the `!important` statement at the end of it. It magically worked! But you had no idea why.

![Magic](/assets/magic.gif)

`!important` is basically overriding one of the most important rules of CSS, the **specificity rule**. To understand how to avoid it we first need to master this concept. So, let's deep dive into it.

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

Interesting enough, there is no red color in any of the boxes. Check the [code sandbox example](https://codesandbox.io/s/blue-sun-s8vcv?file=/index.html) out and play with it live.

Now, try adding an `!important` to the `body div` selector and see what happens.

```css
body div {
   background-color: red !important;
}
```

Yes. Now all the boxes are red. 

![Boxes](/assets/screen-shot-2021-06-30-at-12.37.46-pm.png)

The `!important` is jumping the line and getting ahead of all the other rules that were already in queue defined by the priority (also called SPECIFICITY).

![Cut the line](/assets/cuting-line.gif)

# How does this specificity rule work?

Imagine every selector has given a number in 3 categories, let's suppose category A, B and C.

When rendering the page and applying a given CSS property, the browser will choose the property within the selector with a higher score on CATEGORY A. If there is a tie it will check the score on CATEGORY B. In case of tie again, it will now get the one with a higher CATEGORY C. If there is still a tie it will grab the one that comes last in the code.

To make it clear, let's give some numbers to the selectors above:

![Ranking selectors](/assets/screen-shot-2021-06-30-at-1.33.55-pm.png)

As we can see, the `#box-2` selector has the priority as it has a higher score on category A, followed by `body div:first-of-type.box` which has a higher score on category B than the remaining ones. Next comes the `.box` selector followed by the `body div` in the last position in the priority list.

You might be wondering what in fact are those categories. Here they are:

**Category A:** The number of ID selectors.

**Category B:** The number of class selectors, attribute selectors, and pseudo-classes.

**Category C:** The number of element (a.k.a. type) selectors and pseudo-elements.

This image, created by [Estelle Weyl](https://estelle.github.io/CSS/selectors/specificity.html#slide3), demonstrates exactly this hierarchy using plankton, fish and sharks.

![Specificity table](/assets/screen-shot-2021-06-30-at-1.52.03-pm.png)

As you can see, the last two items in the table are `inline styles` and the `!important` statement. They are skipping all that hierarchy that CSS defines and are going straight to the front of the queue.

It is also worth noting that universal selector (`*,+,~s` ) and combinators do not increase specificity, that is why the first item on the table has score 0-0-0.

The same happens with the negation selector (`:not(x)`) which has no value, but the argument it takes has value.

# Conclusion

Using `!important` is much like using a nuclear explosion to stop the foxes from killing your chickens. Yes, the foxes will be killed, but so will the chickens. And the neighbourhood. It also makes debugging your CSS a nightmare (from personal, empirical, experience).

I know, it takes time and practice to master this specificity rule but, understanding that there is a hierarchy order for the selectors and knowing where to reference this table will save you a ton of time and will help you avoid using `!important` as a silver bullet.

I hope this might help you.
