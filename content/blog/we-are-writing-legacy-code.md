---
path: we-are-writing-legacy-code
date: 2020-03-03T15:23:43.280Z
title: We are writing legacy code
description: >-
  Technology is in continuous evolution and that makes the code we write today
  the one we are going to rewrite tomorrow.
---
Technology is in constantly evolving, and that makes the code we write today the one we are going to rewrite tomorrow.

[![](/assets/screen-shot-2020-03-17-at-3.22.59-pm.png)](https://www.youtube.com/watch?v=naZp50j6U74)

If you worked with frontend for some time, probably you have worked with many different technologies (server render web app, plain Javascript, JQuery, React, Angular, Vue) or a mix of them for doing the same thing: render a web page.

We need to keep in mind that _technology is in continuous evolution._

Let's take a look at how the way we use to build software might change throughout the years. 

## A tale of one startup

No one wants to start a new business or project with old or deprecated technology, and everybody tries to choose current bleeding edge technologies that the team knows how to use.

Let’s say that we are building our new startup back in 2005. Our app does a lot of cool things. One of them is to show a list of heroes that looks like this:

![Heroes list](/assets/heroes-list.png "Heroes list")

_**Server rendering**_

At that time, PHP was the technology to build your website with. We can render our pages on the server easily, so this is our choice to start our new promising project.

Considering `$heroes` is coming from a database, the following code is iterating on them and generating the output as HTML that is going to be returned to the browser.

```php
<ul>
<?php foreach ($heroes as $hero): ?>
   <li><?= $hero->name ?></li>
<?php endforeach; ?>
</ul>
```

Now we have our server-rendered app working fine in production. Sweet!

_**JQuery**_

However, as time goes, we want more flexibility on the frontend side, so we looked around and found out that jQuery is booming, and it fits our needs. So, here we go to rewrite our amazing app to use jQuery:

```javascript
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

The code above is getting the data from the server (imagine `heroes.json` as a Rest API) and appending each hero to the DOM inside the `heroes-list` div.

_**React**_

As our product grows, our team grows as well and we realize that jQuery doesn't scale very well. Adding routes, for example, requires a lot of effort as well as maintaining the code-base and adding new functionality. But if we look around we see that there is a lot of new hip frameworks floating around. [Angular](https://angular.io/), [Vue](https://vuejs.org/), [React](https://reactjs.org/), all of them offer great flexibility when working with frontend and make it easier for us to scale our app as there is a ton of libraries we can just add to our project in case we need something.

Here we go to rewrite our application to React:

```javascript
import React, { Component } from "react";
import { fetchHeroes } from "./api";
import "./styles.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      heroes: []
    };
  }

  componentDidMount() {
    fetchHeroes().then(data => {
      this.setState({
        heroes: data
      });
    });
  }

  render() {
    return (
      <div className="App">
        <ul>
          {this.state.heroes.map(hero => (
            <li key={hero}>{hero}</li>
          ))}
        </ul>
      </div>
    );
  }
}
export default App;
```

[![Edit React Fetch Heroes - full lifecycle](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-fetch-heroes-59u61?fontsize=14&hidenavigation=1&theme=dark)

The code above fetches the data from the server once the component was loaded and renders the list.

Sometime later, `hooks` feature was added to React, improving the way our apps are written a lot. We started using it, and soon we updated our hero list to use hooks:

```javascript
import React, { useState, useEffect } from "react";
import { fetchHeroes } from "./api";
import "./styles.css";

const App = () => {
  const [heroes, setHeroes] = useState([]);

  useEffect(() => {
    fetchHeroes().then(data => setHeroes(data));
  }, [setHeroes]);

  return (
    <div className="App">
      <ul>
        {heroes.map(hero => (
          <li key={hero}>{hero}</li>
        ))}
      </ul>
    </div>
  );
};
export default App;
```

[![Edit React Fetch Heroes](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-fetch-heroes-jb1of?fontsize=14&hidenavigation=1&theme=dark)

In our startup case study, we are always rewriting to something newer as the time goes. The last one is written in React, but we don't certainly know what is going to take place in the coming years, maybe [Svelte](https://svelte.dev/), or [Polymer](https://www.polymer-project.org/) or maybe [Web Assembly](https://webassembly.org/)? Who knows.

## What is Legacy Code

All the examples above render just a simple list of heroes, but in practice, it could be much bigger with a lot of functionalities and features. That means changing technology or approach can take a lot of time and planning.

As we can see with this simple startup tale, we are always writing code that, somehow, is going to be rewritten later. I think that we can safely assume the following:

> A code becomes LEGACY CODE as soon as shipped into production!

## Dealing with technology changes

There are three possible ways of dealing with a huge technology change, for example from a server-rendered app to a React App:

**Keep maintaining/adding features the existing one**

If your app isn’t that big and improving the app and adding features is not an issue with the current stack, chances are that you don't need to change the stack you are using currently.

**Rewrite it from scratch**

Rewriting from scratch means you will throw away your current app and replace it with the new one. If your app is a small one and you can keep maintaining the current one while rewriting the new version, this could be a good approach for you.

But if your app is large, or it has years of knowledge applied throughout code, I wouldn’t recommend doing this.

**Progressively rewrite**

This approach means you are going to keep the current app, progressively moving towards the new approach. For example, you can start moving one page to React while all the others still use the old tech, gradually moving towards a single page application (SPA).

It’s likely that this is the option you will choose if your app is a large one.

## Leaving behind a good legacy code

As we just saw, **we are writing legacy code all the time**! It does not matter if we are using the cutting edge technology of the moment, it is going to become legacy code as soon as shipped into production. 

With that in mind, **what really matters is leaving behind a good code**, so ourselves or our coworkers can look back and understand what is going on.

There is just one rule to rule everything, and it is called [KISS](http://wiki.c2.com/?KeepItSimple):

![KISS - Keep It Simple Stupid](/assets/kiss.png "KISS - Keep It Simple Stupid")

Keeping it simple can be hard, though. It is not the scope of this article to cover how to keep your code simple, as this could take a whole new blog post, but simple actions can help your code to be clear, for example:

* [Naming components, variables, functions and others appropriately;](https://www.robinwieruch.de/javascript-naming-conventions)
* [Have a sense of when to break your component into multiple components;](https://kentcdodds.com/blog/when-to-break-up-a-component-into-multiple-components)
* Always cover your code with tests ([static code analysis, unit tests, integration tests, E2E tests](https://kentcdodds.com/blog/unit-vs-integration-vs-e2e-tests))

The main point is:

> Any fool can write code that a computer can understand. Good programmers write code that humans can understand
>
> \- Martin Fowler
