---
path: graphql-as-rest-api-data-layer
date: 2020-06-30T00:24:47.596Z
title: GraphQL organizing your REST apis
description: GraphQL organizing your REST apis
---
PROBLEM

Let's suppose we have a super complicated application that displays a list of missions' cards showing up the villain and also the heroes that saved the day. It looks like this one:

![Missions application](/assets/screen-shot-2020-06-25-at-6.33.27-pm.png "Missions application")

How would we build an application like this one backed by REST apis?

Let's suppose we have the following REST api schema:

![Rest API](/assets/rest2.png "Rest API")

On the front end is where things get complicated. For every mission coming from \`/missions\` we need to display also the villain and heroes information, but we only have id's on the \`/missions\` endpoint. We would have to deal with multiple api calls on the frontend to get all the data needed, and also play with \`Promises\` to wait for the related data. Something like this:

```
FETCH MISSION 1
    - FETCH VILLAIN
    - FETCH HEROES

...the same for all other elements in the missions array
```

You could do some magic with \`Promise.all()\` but even that is a nightmare and not performant as it will hit your REST api server several times.

The above application is a pretty simple one just to exemplify the need of fetching related data. I am sure you have a clear and real example where you were struggling to fetch those related data.

ROUTE

GraphQL might be the key to save the day!

For those that is not familiar, and is wondering what GraphQL is, here is the official definition:

> GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

Basically, you ask for something and your GrapgQL server will give it to you if it is available. The data might come from different sources, but in our case we are using our Rest APIs as datasource.

GraphQL is not a software you can download, it is just an specification. Following the specification a lot of great libraries arose adding GraphQL support for most part of the languages such as Relay and Apollo.

Theory is cool but, let's code!

SOLUTION

How can we simplfy this application with GraphQL?
