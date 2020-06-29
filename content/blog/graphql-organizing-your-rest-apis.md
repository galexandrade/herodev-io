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

Theory is cool but, let's code! Let's build our heroes mission's application.

For that to work we will need to build:

1. REST API Server
2. GraphQL Server
3. Front end

The full codebase you can find here: https://github.com/galexandrade/heroes-graphql

## REST API Server

I have decided to use NodeJS with hapi to build our Rest API Server. You can use whatever language you are more familiar with.

If you have never used hapi you can refer https://hapi.dev/tutorials/?lang=en_US.

Let's build api schema that I showed on the top of this article to return our missions, heroes and villains:

```
const init = async () => {
    ...
    server.route({
        method: 'GET',
        path: '/heroes/{id}',
        handler: handleFindHeroRequest
    });
    server.route({
        method: 'GET',
        path: '/villains/{id}',
        handler: handleFindVillainRequest
    });
    server.route({
        method: 'GET',
        path: '/missions',
        handler: handleGetMissions
    });
    ...
};
```

It is just three endpoints returning to fetch our data. You can take a look [here](https://github.com/galexandrade/heroes-graphql/blob/master/rest-api-server/index.js) to see the full code.

## GraphQL Server

Now that we have our Rest Api server ready, we need to build our GraphQL server using as data-loader the Rest Api server we just built.

For this have choose to use Apollo but you can use whatever you are more comfortable with.

You can refer [this documentation](https://www.apollographql.com/docs/apollo-server/) if you are not familiar with Apollo. Following the how to is pretty straightforward.

An Apollo server is pretty simple:

```
//index.jsconst { ApolloServer, gql } = require('apollo-server');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const dataSources = require('./dataSources');

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources,
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
```

It is just grouping together three files, witch one refering to one important concepts when we talk about GraphQL Server:

1 - TypeDefs

It is where we define our graphs, the schema. Here is the place where we define the domain relationships. Forget about API's schema, switch your mind to think about domains.

Let's create the following entities:

```
const { gql } = require('apollo-server');

const typeDefs = gql`
    type Hero {
        id: ID
        name: String!
        photo: String!
    }

    type Villain {
        id: ID
        name: String!
        photo: String!
    }

    type Mission {
        id: ID
        name: String!
        villain: Villain!
        heroes: [Hero!]!
    }

    type Query {
        missions: [Mission!]!
    }
`;

module.exports = typeDefs;
```
Let's take a closer look at the `Mission` entity. There we say it has a villain of the type `Villain` and it also has multiple heroes, as an collection of `Hero`.


2 - Resolvers

3 - DataSources

## Front end

sadsada

SOLUTION

How can we simplfy this application with GraphQL?
