---
path: we-are-writing-legacy-code
date: 2020-03-03T15:23:43.280Z
title: We are writing legacy code
description: >-
  Technology is in continuous evolution and that makes the code we write today
  the one we are going to rewrite tomorrow
---
If you have more than 5 years of experience working with frontend, probably you have worked with many different technologies (server render web app, plain javascript, JQuery, React, Angular, Vue) or a mix of them for doing the same thing, render a web page.

Let's take a look at how approaches change throughout the years. 

## The startup tale

No one starts a new business or a new startup project with some old or deprecated technology, everyone chooses the top technologies of the moment that the team knows.

Consider we are building our new startup back to 2005. Our app does a lot of cool things, one of them is to show a list of heroes, like the following:

![Heroes list](/assets/heroes-list.png "Heroes list")

_**Server rendering**_

At that time PHP was the one, and we could render our pages on the server easily, so this was our choice to start our project.

Considering \`$heroes\` is coming from a database, the following code is iterating them and generating the output HTML that is going to be returned to the browser.

```php
<ul>
<?php foreach ($heroes as $hero): ?>
   <li><?= $hero->name ?></li>
<?php endforeach; ?>
</ul>
```

Now we have our app server rendered working fine in production.

_**JQuery**_

As time goes, we want more flexibility on the front end side, so we looked around and discovered that JQuery is on its boom and it fits our needs. So, here we go to rewrite our amazing app to use JQuery:

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

The code above is getting the data from the server (imagine \`heroes.json\` as a Rest API) and appending each hero to the DOM inside the \`heroes-list\` div.

_**React**_

As our product grows as well as our team, we realized that JQuery doesn't help much for scale. Adding routes, for example, requires a lot of effort as well as to maintain the codebase and adding new functionalities. So, we realized that some great Javascript frameworks are taking place like Angular, Vue, React offering great flexibility to work with frontend making it easier for scale as there is a ton of libraries we can just add to our project according to our needs.

Here we go to rewrite our application to React, the one chosen:

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

The code above is fetching the data from the server once the component was loaded and rendering the list.

Sometime later, \`hooks\` was added to React improving a lot the way our apps are written. We started using it and soon we updated it to use hooks:

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

In our startup study case, we are always rewriting to something newer as the time goes. The last one is written in React, but we don't certainly know what is going to take place in the coming years, maybe Svelte, or Polymer or maybe Web Assembly? Who knows.

## What is Legacy Code

All the examples above render just a simple list of heroes, but in practice, it could be much bigger with a lot of functionalities and features and that means changing to a technology or approach can take a lot of time and planning.

As we can see with this simple app, we are always writing code that, somehow, is going to be rewritten later. So we can assume:

> A code becomes LEGACY CODE as soon as shipped into production!

## Dealing with technology changes

There are three possible ways of dealing with a huge technology change, for example from a server-rendered app to a React App:

**Keep maintaining/adding features the existing one**

If your app is not a huge one and improving the app and adding features is not an issue with the current stack, chances are you don't need to change the technology you are using currently.

**Rewrite it from scratch**

If you cannot improve your app or adding the features your customers want takes a lot of time or maybe it is not even possible, rewrite from scratch might be an option.

Rewriting from scratch means you will throw away your current app and replace it with the new one. If your app is a small one and you can keep maintaining the current one while rewriting the new one, this could be a good approach for you. But if your app is large, or it has years of knowledge applied thought code on it, I don't recommend this approach.

**Progressively rewrite**

This approach means you are going to keep the current app, progressively moving towards the new approach. For example, you can start moving one page to React while all the others still use the old approach, moving progressively towards your goal.

Chances are this is the option you will choose if your app is a large one.

## Leaving behind a good legacy code

As we just saw, we are writing legacy code all the time! It does not matter if we are using the top technology of the moment, it is going to become legacy code as soon as shipped into production. 

With that in mind, what really matters is leaving behind a good code, so ourselves or our coworkers can look back and understand what is going on.

There is just one rule to rule everything, it is called KISS:

![KISS - Keep It Simple Stupid](/assets/kiss.png "KISS - Keep It Simple Stupid")

Keeping it simple can be really hard, though. It is not the scope of this article to cover how to keep your code simple, as this could take a whole new article, but simple actions can help your code to be clear, for example:

* [Name file, variables, functions, components appropriately;](https://www.robinwieruch.de/javascript-naming-conventions)
* [Have a sense of when to break your component into multiple components;](https://kentcdodds.com/blog/when-to-break-up-a-component-into-multiple-components)
* Always cover your code with tests ([static code analysis, unit tests, integration tests, E2E tests](https://kentcdodds.com/blog/unit-vs-integration-vs-e2e-tests))
