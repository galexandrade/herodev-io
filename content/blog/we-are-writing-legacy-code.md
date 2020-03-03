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

```php
<ul>
<?php foreach ($heroes as $hero): ?>
   <li><?= $hero->name ?></li>
<?php endforeach; ?>
</ul>
```

_JQuery_

Now we have our app server rendered, but we want more flexibility on the front site end, so we found out that JQuery is on its boom and can solve our problems. So, here we go to rewrite our amazing app to use JQuery.

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

The code above is getting the data from the server (imagine \`heroes.json\` as a rest api) and appending each hero to the DOM inside \`heroes-list\` div.

_React_

As our product and team grows, we realized that JQuery doesn't help much for scale, as it requires a lot of effort to maintain and add new functionalities, as routes for instance. So, we realized that some great Javascript frameworks is emerging like Angular, Vue, React and they offer great flexibility to work with frontend making it easier for scale as there is a ton of libraries we can just add to our project according to our needs. Here we go to rewrite our application to React (just for example):

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

Some time later a \`hooks\` as added to React improving a log the way our apps is written. We started using it and soon we updated to use hooks:

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



All the examples above renders just a simple list of heroes, but in practice it cold be much bigger with a lot of functionalities and features and that means changing to a new technology or approach can take a lot of time and planning.

As we can see with this simple app, we are always writing code that, somehow, is going to be rewritten later. So we can assume:

> "A code becomes LEGACY CODE as soon as shipped into production!"

Dealing with technology changes

There are three possible ways of dealing with a huge technology change, for example from a server rendered app to a React App:

**Keep maintaining/adding features the existing one**

If your app is not a huge one and improving the app and adding features is not an issue with the current stack, chances are you don't need to change the technology you are using currently.

**Rewrite it from scratch**

If you cannot improve your app or adding the features your customers want takes a lot of time or maybe it is not even possible, rewrite from scratch might be an option.

Rewriting from scratch means you will throw away your current app and replace with the new one. If your app is a small one and you can keep maintaining the current one while rewriting the new one, this could be a good approach for you. But if you app is large, or it has years of knowledge applied thought code on it, I don't recommend this approach.

**Progressively rewrite**

This approach means you are going to keep the current app, progressively moving towards the new approach. You can start moving one page to React, for example, while all the others still uses the old approach.

Chances are this is the option you will choose if your app is a large one.

As we just saw, we are writing legacy code all the time, it does not matter if this is the top technology of the moment, it becomes legacy code as soon as shipped into production. 

With that in mind, what really is leaving behind a good code, so we/our coworkers can look back and understand what is going on.

There is just one rule to rule everything:

![KISS - Keep It Simple Stupid](/assets/kiss.png "KISS - Keep It Simple Stupid")

Keeping it simple can be really hard, though. It is not the scope of this article to cover how to keep your code simple, as this could be a whole new article, but simple actions can help your code to be clear, for example:

* Name file, variables, functions, components appropriately;
* Have a sense of when to break your component into multiple components;
* Always cover you code with tests (static code analysis, unit tests, integration tests, E2E tests)
