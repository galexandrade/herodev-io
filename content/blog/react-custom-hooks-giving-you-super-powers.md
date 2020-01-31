---
path: react-custom-hooks-giving-you-super-powers
date: 2020-01-31T01:03:14.598Z
title: React custom hooks giving you super powers
description: How React hooks has changed the way we share behavior on our application
---
Since React v16.8.0 where hooks was released it has changed the way we write our applications. If you are not familiar with React hooks (I doubt it), I highly recommend you to check it out the [official documentation](https://reactjs.org/docs/hooks-intro.html) and [Dan Abramov's talk on React Conf](https://www.youtube.com/watch?v=dpw9EHDh2bM).

Before React 16.8.0, the main way to share behaviour between your components was using a pattern called [Higher Order Components (alson known as HOC)](https://reactjs.org/docs/higher-order-components.html). That approach allows you to empower your components with extra functionalities.

In this example `withSpecialPower` is adding to the component the prop `specialPower` containing a random special power (just to exemplify).

`Hero.js`

```javascript
import React from "react";
import withSpecialPower from './withSpecialPower';

const Hero = ({name, specialPower}) => {
  return (
      <h2>{name} - I can {specialPower}</h2>
  );
}

export default withSpecialPower(Hero);
```

`withSpecialPower.js`

```javascript
import React from 'react';

const withSpecialPower = (Component) => {
  return class WithHover extends React.Component {
    render() {
      const specialPowerList = [
        'be invisible',
        'flight',
        'see the future',
        'read your mind'
      ];
      const specialPower = specialPowerList[
        Math.floor(Math.random() * specialPowerList.length)
      ];
      return <Component {...this.props} specialPower={specialPower} />
    }
  }
};

export default withSpecialPower;
```

[![Edit higher-order-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/sweet-cloud-bfx58?fontsize=14&hidenavigation=1&theme=dark)

This pattern has been used widely by a lot of libraries like Redux, Formik, React-DnD and much others. However, since hooks was introduced they started using all the power hooks is giving to leverage the quality of their libraries. Let's take a look on how the code looks like using higher order components compared using hooks on some of those libraries.

**Redux**

[Redux](https://react-redux.js.org/) helps us manage the global state of the application. On the following piece of code, it is giving the component `HeroList` some extras props that allows the it to access some data from the store and also dispatch some action, in this case `callForHelp`.

```javascript
import { connect } from 'react-redux';
import { callForHelp } from './heroActions';

const HeroList = ({ heroes, callForHelp }) => ...

const mapStateToProps = (state) => {
  return {
    heroes: state.heroes
  }
}

const mapDispatchToProps = { callForHelp }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeroList)
```

Since React Redux v7.1.0, it was added new hooks to make easier to access with the store (useSelector) and dispatch actions (useDispatch). Below you can see the same component, with the same functionality, but much more cleaner and easier to read.

\[PIECE OF CODE REDUX HOOKS]

**Formik**

Formik is a library that helps us manage our forms regarding to form state, validation, errors and schema. In the following there is an example of how we can use it to manage this form.

\[PIECE OF CODE FORMIK]

Since Formik v2, we can use \`useFormik\` hook to do the same thing as before, but on a better and cleaner way.

\[PIECE OF CODE FORMIK HOOKS]

React-DnD

Another good example of a library completely changed by hooks is React-DnD that helps us drag and drop elements. Before hooks, the code to to make your drag and drop the code looked like a nightmare, only who was familiar with the library could undeerstand what was going on. Take a look on the links under Legacy Decorator API on the React-Dnd documentation to have an idea what what I am talking about.

\[SOME OLD REACT-DND CODE]

Since hooks was introduced to React-DnD it is been much easier to understande the code. \`useDrag\` and \`useDrop\` is much more readable, eve if you are not familiar with the library, you know that is doing, for instance, if a component is using \`useDrag\` you presume that component is draggable.

\[SOME REACT-DND HOOKS CODE]

Concluding

As we can see hooks has been empowering React libraries world wide. What I most like, is how it improves the readability of the components reducing boilerplate. It becomes easier to follow, you know your component is using .
