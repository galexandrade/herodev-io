---
path: we-are-writing-legacy-code
date: 2020-03-03T15:23:43.280Z
title: We are writing legacy code
description: >-
  Technology is in continuous evolution and that makes the code we write today
  outdated pretty soon.
---
If you have more than 5 years of experience working with frontend, probably you have worked with many different technologies (server render web app, plain javascript, JQuery, React, Angular, Vue) or a mix of them for doing the same thing, render a web page.

Let's take a look on how approaches changes throughout the years. 

Consider we have our web app that does a lot of cool things, one of the features is to show up a list of heroes. All the following code examples will render a heroes list, exactly like the following:

* Spiderman
* Hulk
* Black Phanter
* Doctor Strange

_Server rendering_

Let's suppose the best approach at the moment to do that is through server rendering, for example PHP. Considering \`$heroes\` is coming from a database, the following code is iterating them and generating the output HTML that is going to be returned to the browser.

```
<ul>
<?php foreach ($heroes as $hero): ?>
   <li><?= $hero->name ?></li>
<?php endforeach; ?>
</ul>
```

JQuery

Now we have our app server rendered, but we want more flexibility on the front site end, so we found out that JQuery is on its boom and can solve our problems. So, here we go to rewrite our amazing app to use JQuery.

```
<ul id="heroes-list"></ul>
<script>
   $(document).ready(function() {
      $.get("heroes.json", function(heroes, status) {
         heroes.forEach(heroe =>
            $("#heroes-list").append("<li>" + heroe + "</li>")
         );
      });
   });
</script>
```

[![Edit JQuery Ajax](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/jquery-ajax-lyqly?fontsize=14&hidenavigation=1&theme=dark)

The code above is getting the data from the server (imagine \`heroes.json\` as a rest api) and appending each hero to the DOM inside \`heroes-list\` div.
