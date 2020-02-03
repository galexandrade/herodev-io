---
path: react-hooks-giving-you-super-powers
date: 2020-01-31T01:03:14.598Z
title: How React hooks has been empowering amazing libraries
description: >-
  We will take a look on the most common libraries and how they havee been
  switching to hooks comparing how the code looks like before and after.
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

This pattern has been used widely by a lot of libraries like Redux, Formik, React-DnD and much others. However, since hooks was introduced they started using all the power hooks is giving to leverage the quality of their libraries. Don't get me wrong, sometimes this pattern can be very useful, specially if you need to wrap your component into something else like a Route or some Provider.

Let's take a look on how the code looks like using higher order components compared using hooks on some of those libraries. _Just a reminder that the idea here is not to give full examples of each library nor teach how they work, but instead, compare the code before and after hooks._

**Redux**

[Redux](https://react-redux.js.org/) helps us manage the global state of the application. On the following piece of code, it is giving the component `HeroList` some extras props that allows the it to access some data from the store and also dispatch some action, in this case `callForHelp`.

```javascript
import { connect } from 'react-redux';
import { callForHelp } from './heroActions';
//The component receives `heroes` and `callHero` from `connect`
const HeroList = ({ heroes, callHero }) => ...

const mapStateToProps = (state) => {
  return {
    heroes: state.heroes
  }
}

const mapDispatchToProps = dispatch => {
  callHero: hero => dispatch(callForHelp(hero))
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeroList)
```

Since React Redux v7.1.0, it was added new hooks to make easier to access with the store (useSelector) and dispatch actions (useDispatch). Below you can see the same component, with the same functionality, but much more cleaner and easier to read.

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { callForHelp } from './heroActions';

const HeroList = (props) => {  //The component uses a selector to get `heroes`
  const heroes = useSelector(state => state.heroes);
  const dispatch = useDispatch();
  const callHero = hero => dispatch(callForHelp(hero));
  ...
}

export default HeroList;
```

**Formik**

Formik is a library that helps us manage our forms regarding to form state, validation, errors and schema definition. In the following there is an example of how we can use it to manage this form.

```javascript
import React from 'react';
import { withFormik } from 'formik';

//The component receives all these props from `withFormik`
const MyForm = ({
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
  }) => ...;

const MyEnhancedForm = withFormik({
  mapPropsToValues: () => ({ name: '' }),
  // Custom sync validation
  validate: values => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Required';
    }
    return errors;
  },
  handleSubmit: values => {
    console.log('Will submit', values)
  }
})(MyForm);
```

See this full example [here](https://jaredpalmer.com/formik/docs/api/withFormik).

Since Formik v2, we can use \`useFormik\` hook to do the same thing as before, but on a better and cleaner way.

```javascript
import React from 'react';
import { useFormik } from 'formik';

const MyForm = () => {
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
    onSubmit: values => {
      console.log('Will submit', values)
    },
  });
  ...
};
```

See this full example [here](https://jaredpalmer.com/formik/docs/api/useFormik). Formik also provides `useField` and `useFormikContext` that can give you even more flexibility depending on the use case.

**React-DnD**

Another good example of a library completely changed by hooks is React-DnD that helps us drag and drop elements. Before hooks, the code to to make your drag and drop the code looked like a nightmare, only who was familiar with the library could understand what was going on. 

Take a look at [DragSource](https://react-dnd.github.io/react-dnd/docs/api/drag-source) higher order component and also [DropTarget](https://react-dnd.github.io/react-dnd/docs/api/drop-target) under Legacy Decorator API on the React-Dnd documentation to have an idea what what I am talking about.

Since hooks was introduced to React-DnD it is been much easier to understand the code. \`useDrag\` and \`useDrop\` is much more readable, eve if you are not familiar with the library, you know that is doing, for instance, if a component is using \`useDrag\` you presume that component is draggable.

```javascript
import { useDrag } from 'react-dnd';

function DraggableComponent(props) {
  const [collectedProps, drag] = useDrag({
    item: { id, type }
  })
  return <div ref={drag}>...</div>;
}
```

Example from [React DnD documentation](https://react-dnd.github.io/react-dnd/docs/api/use-drag).

## Concluding

As we can see, hooks has been empowering React libraries world wide simplifying how we use them. What I most like, is how it improves the code readability of the components reducing boilerplate and a lot of line of code. When Dan Abramov and Ryan Florence said [hooks could turn your application up to 90% cleaner](https://www.youtube.com/watch?v=wXLf18DsV-I), I was skeptical about it, but now, when I see this massive usage of hooks I know it is totally achievable.

It becomes easier to follow as well. Just by the word \`use\` you know your component is using something. Let's take a look at our first example, now, using hooks:
`Hero.js`

```javascript
import React from "react";
import useSpecialPower from './useSpecialPower';

const Hero = ({name}) => {
  const specialPower = useSpecialPower();
  return (
      <h2>{name} - I can {specialPower}</h2>
  );
}

export default Hero;
```

`useSpecialPower.js`

```javascript
const useSpecialPower = () => {
  const specialPowerList = [
    'be invisible',
    'flight',
    'see the future',
    'read your mind'
  ];
  return specialPowerList[
    Math.floor(Math.random() * specialPowerList.length)
  ];
};

export default useSpecialPower;
```

[![Edit heroes-app-using-hooks](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/heroes-app-using-hooks-h7wt4?fontsize=14&hidenavigation=1&theme=dark)
