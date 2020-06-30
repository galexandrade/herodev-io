---
path: graphql-as-rest-api-data-layer
date: 2020-06-30T00:24:47.596Z
title: GraphQL organizing your REST apis
description: GraphQL organizing your REST apis
---
In this blog post you will learn how you can fetch related data from Rest endpoints without ending up with several http requests on the frontend. We will use GraphQL as a Rest Api data layer.

Just a disclaimer, my goal here is to go hand's on code, so don't expect this to be short! If you are with me, let's get the party started!

We all know it is a good practice to structure our Reat Apis with a clear boundaries between the resources. When we have relationships between the resources we expose the entity id and then we can get the full entity on the proper rest resource endpoint. Something like this:

```javascript
GET /missions
[
   {
      name: 'Mission 1',
      villain_id: 1,
      heroes_ids: [1, 2]
   }
]

GET /villains/1
{
    name: 'Thanos',
    photo: 'thanos.jpg'
}

GET /heroes/1
{
    name: 'Hulk',
    photo: 'hulk.jpg'
}
```

On the front end is where things get complicated. Let's suppose we have the following screen backed by those endpoints:

![Missions application](/assets/screen-shot-2020-06-25-at-6.33.27-pm.png "Missions application")

For every mission coming from \`/missions\` we need to display also the villain and heroes information, but we only have id's on the \`/missions\` endpoint. We would have to deal with multiple api calls on the frontend to get all the data needed, and also play with \`Promises\` to wait for the related data. Something like this:

```
FETCH MISSION 1
    - FETCH VILLAIN
    - FETCH HEROES

...the same for all other elements in the missions array
```

You could do some magic with \`Promise.all()\` but even that would be a nightmare and also not performant as it will hit the endpoints several times to fetch the `villain` and `heroes` for each mission.

The above application is a pretty simple one just to exemplify the need of fetching related data. I am sure you have a clear and real example where you were struggling to fetch those related data.

GraphQL might be the key to save the day!

For those that is not familiar, and is wondering what GraphQL is, here is the official definition:

> GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

Basically, you ask for something and your GrapgQL server will give it to you if it is available. The data might come from different sources, but in our case we are using our Rest APIs as datasource.

GraphQL is not a software you can download, it is just an specification. Following the specification a lot of great libraries arose adding support for most part of the languages. Between them Relay and Apollo.

Theory is cool but, let's code! Let's build our heroes mission's application.

For that to work we will need to build:

1. REST API Server
2. GraphQL Server
3. Front end application

The full codebase you can find here: https://github.com/galexandrade/heroes-graphql

## REST API Server

I have decided to use NodeJS with [hapi](https://hapi.dev/) to build our Rest API Server. You can use whatever language you are more familiar with.

Let's build the same endpoints I have mentioned beforehand:

```javascript
//index.jsconst init = async () => {
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

It will create three endpoints \`/missions\`, \`/villains/{id}\` and \`/heroes/{id}\` returning some mock data as my goal here if just to focus on the GraphQL part. You can take a look [here](https://github.com/galexandrade/heroes-graphql/blob/master/rest-api-server/index.js) to see the full code.

Running \`yarn start\` or \`npm start\` you should be able to start the server.

## GraphQL Server

Now that we have our Rest Api server ready, we need to build our GraphQL server using as data-loader the Rest Api server we just built.

For this have choose to use Apollo but you can use whatever you are more comfortable with.

You can refer [this documentation](https://www.apollographql.com/docs/apollo-server/) if you are not familiar with Apollo. Following the how to is pretty straightforward.

An Apollo server is pretty simple:

```javascript
//index.js
const { ApolloServer, gql } = require('apollo-server');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const RestAPI = require('./dataSource');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
        return { restAPI: new RestAPI() };
    },
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
```

It is just grouping together three files, witch one refering to one important concepts when we talk about GraphQL Server:

**1 - TypeDefs**

It is where we define our graphs, the schema. Here is the place where we define the domain relationships. Forget about API's schema, switch your mind to think about domains.

Let's create the following entities:

```javascript
//typeDefs.js
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

The exclamation mark says that property cannot be \`null\`.

**2 - Resolvers**

Resolvers is the guy responsible for gether a piece of data that the user requested. 

```javascript
//resolvers.js
const resolvers = {
    Query: {
        missions: (_source, _args, { dataSources }) =>
            dataSources.restAPI.getMissions(),
    },
    ...
};

module.exports = resolvers;
```

First we have defined a resolver for \`Query\` and inside \`missions\`, it means when we request for missions, that fonction will be executed. There it is calling a datasource (we will talk more about datasources) to fetch our missions witch is the same response we retuen on our \`/missions\` rest endpoint.

Wait? How will it load the villain and the heroes as we have defined on our type definition?

There is a resolver for \`Mission\`. Whenever a \`Mission\` type is returned this resolver will be invoked to grab related data (if the user requested it). Here it have a resolver for \`villain\`, it basiclay calls a data source to call our endpoint \`/villains/{id}\` with the id comming from the parent, I mean the mission.

```javascript
//resolvers.js
const resolvers = {
    ...
    Mission: {
        villain: (parent, _args, { dataSources }) => {
            return dataSources.restAPI.getVillain(parent.villain_id);
        },
        ...
    },
};

module.exports = resolvers;
```

The same happens with heroes, where it maps all the \`heroes_ids\` from the mission and call our endpoint \`/heroes/{id}\`.

```javascript
//resolvers.js
const resolvers = {
    ...
    Mission: {
        ...,
        heroes: (parent, _args, { dataSources }) => {
            return parent.heroes_ids.map((heroId) =>
                dataSources.restAPI.getHero(heroId)
            );
        },
    },
};

module.exports = resolvers;
```

You might be concerned about performance as it will be calling our \`/heroes/{id}\` endpoint several times. As I said, my goal here is just to explain how you can merge and load related data easily. But, YES! This might be a problem and there is a solution, it is called [DataLoader](https://www.apollographql.com/docs/apollo-server/data/data-sources/) where you can batch and make only one request.

**3 - DataSources**

Data sources define where load things from. In this case I have used the \`apollo-datasource-rest\` to link our Rest Apis.

```javascript
//dataSource.js
const { RESTDataSource } = require('apollo-datasource-rest');

class RestAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'http://localhost:3030/';
    }

    async getMissions() {
        return this.get('missions');
    }

    async getVillain(id) {
        return this.get(`villains/${id}`);
    }

    async getHero(id) {
        return this.get(`heroes/${id}`);
    }
}

module.exports = RestAPI;
```

**Wrapping up our GraphQL Server**

[Here](https://github.com/galexandrade/heroes-graphql/tree/master/graphql-server) you can find the full codebase of our ApolloServer. At this point if you run \`yarn start\` or \`npm start\` you will start the server. Remember the RestAPI server need to be up.

On your browser, navigating to http://localhost:4000/ should open the GraphQL playground.

![Apollo playground](/assets/apolloplayground.png "Apollo playground")

Cool! Now we have our GraphQL running! Can you feel the power?

## Front end

Now let's connect the last piece missing on our plusze, the front end.

You can see the full code base [here](https://github.com/galexandrade/heroes-graphql/tree/master/react-web-app). My focus is on the GraphQL part, so, I'm not concerned about styling or testing the components properly here.

First we need to create a new React application with `create-react-app` and then install the [Apollo client for React](https://www.apollographql.com/docs/react/get-started/):

```shell
npm install apollo-boost @apollo/react-hooks graphql
```

Now we need to connect our Apollo Server with our frontend through `ApolloProvider`. Let's do this on \`index.js\`:

```javascript
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
    uri: 'http://localhost:4000',
});

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
```

Perfect! Now let's create the \`graphql/query.js\` file to create our first query asking for what we want:

```javascript
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

export const MISSIONS_QUERY = gql`
    {
        missions {
            name
            villain {
                name
                photo
            }
            heroes {
                name
                photo
            }
        }
    }
`;
```

Awesome! Now, we junt need to use it!

Let's open the \`App.js\` and hook it up with the query that we just built using \`useQuery\`:

```javascript
import React from 'react';
import Mission from './components/Mission';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { MISSIONS_QUERY } from './graphql/query';

const App = () => {
    const { loading, error, data } = useQuery(MISSIONS_QUERY);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div className="app">
            <header className="app-header">
                <h1>Missions</h1>
            </header>
            <div className="list">
                {data.missions.map((mission, index) => (
                    <Mission key={index} {...mission} />
                ))}
            </div>
        </div>
    );
};

export default App;
```

`useQuery` returns `data` with all the missions including everything we asked such as vilain and heroes. Now we just need to render it. On the code above I am rendering each `mission` with the component `Mission`. Let's take a look on that component:

```javascript
import React from 'react';
import ListItem from './ListItem';

const Mission = ({ name, villain, heroes }) => (
    <div className="mission">
        <h2 className="title">{name}</h2>
        <div className="label">Villain:</div>
        <ListItem name={villain.name} photo={villain.photo} />

        <div className="label">Heroes who saved the day:</div>
        {heroes.map((hero, index) => (
            <ListItem key={index} name={hero.name} photo={hero.photo} />
        ))}
    </div>
);

export default Mission;
```

As you can see it receives `villain` and `heroes` with name and photo. AMAZING!!

## Conclusion

With only one http request we were able to receive all the data we needed to render our mission cards displaing the villain and the heroes associated with each mission.

The GraphQL Server was able to handle our request and join all the associated data making the rest api calls on demand. We didn't dive deep here, but Apollo provides awesome performance tools. One of the greatest features is caching. I really recoment you to take a deep dive into it.

Without this
