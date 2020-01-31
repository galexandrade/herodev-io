---
path: react-custom-hooks-giving-you-super-powers
date: 2020-01-31T01:03:14.598Z
title: React custom hooks giving you super powers
description: How React hooks has changed the way we share behavior on our application
---
Since React 16.8.0 where hooks was released it has changed the way we write our applications. If you are not familiar with React hooks (I doubt it), I highly recommend you to check it out the [official documentation](https://reactjs.org/docs/hooks-intro.html) and [Dan Abramov's talk on React Conf](https://www.youtube.com/watch?v=dpw9EHDh2bM).

Before React 16.8.0, the main way to share behaviour between your components was using a pattern called [Higher Order Components (alson known as HOC)](https://reactjs.org/docs/higher-order-components.html). That approach allows you to empower your components with extra functionalities.

\[EXAMPLE]

This pattern was used widely by a lot of libraries like Redux, Formik, \[CITE OTHERS]. However, since hooks was introduced they started using it to leverage the quality of their libraries. Let's take a look on how the code looks like using higher order components compared using hooks on some of those libraries.

**Redux**

Redux helps us manage the global state of the application. On this piece of code, it is giving the component \`ComponentName\` some extras props that allows the component to acess some data from the store and also dispatch some action, in this case \`actionDispatched\`.

\[PIECE OF CODE]
