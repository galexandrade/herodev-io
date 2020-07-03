---
path: graphql-as-rest-api-data-layer
date: 2020-07-06T00:24:47.596Z
title: GraphQL organizing your REST APIs
description: GraphQL organizing your REST APIs
---

In this blog post, you will learn how you can fetch related data from REST endpoints without ending up with several HTTP requests on the front-end. We will use GraphQL as a REST API data layer.

My goal here is to go hand's on code, building a full application from scratch, so don't expect this to be short! If you are with me, let's get the party started!

We all know it is a good practice to structure REST APIs with [clear boundaries between the resources](https://hackernoon.com/restful-api-designing-guidelines-the-best-practices-60e1d954e7c9). When we have relationships between the resources we expose the entity id and then we can get the full information based on that id on the proper endpoint resource. Something like this:

```javascript
//GET /movies
[
   {
      name: 'Avangers: Infinit war',
      link: 'youtube-trailler-link',
      villain_id: 1,
      heroes_ids: [1, 2]
   }
]

//GET /villains/{id}
{
    name: 'Thanos',
    photo: 'thanos.jpg'
}

//GET /heroes/{id}
{
    name: 'Hulk',
    photo: 'hulk.jpg'
}
```

So far everything looks good but, things will get more complicated on the front-end side. Let's suppose we have the following application backed by those endpoints:

A list of heroes movie cards. For each card, it shows up the villain's picture and name as well as the heroes who saved the day. When clicking on a card it will open up the trailer on a separate tab.

![Heroes Movies application](/assets/heroesmovies.png "Heroes Movies application")

For every movie coming from `/movies` we need to display also the villain and heroes information, but we only have id's exposed. We would have to deal with multiple API calls on the front-end to get all the data needed, and also play with `Promises` to wait for the related data. Something like this:

```
FETCH MOVIES
ITERATE ON THE MOVIES COLLECTION. FOR EACH:
    - FETCH VILLAIN
    - FETCH HEROES
```

You could do some magic with `Promise.all()` but even that would be a nightmare and also not performant as it will hit the endpoints several times to fetch the `villain` and `heroes` for each movie from the browser.

The above application is a pretty simple one just to exemplify the pain of fetching related data. I am sure you have a clear and real example where you were struggling in the same situation.

GraphQL might be the hero to save the day! 🦸🏻‍♂️

For those that are not familiar, and is wondering what GraphQL is, here is the official definition:

> GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

Basically, you ask for something and your GraphQL server will give it to you if it is available. The data might come from different sources, but in our case, we are using our Rest APIs to fulfill the requests.

It is not a software you can download, but a [specification](https://spec.graphql.org/). Following that specification, awesome libraries arose adding support for a large number of [languages and platforms](https://graphql.org/code/). In the JavaScript world [Relay](https://relay.dev/) and [Apollo](https://www.apollographql.com/) are the most popular.

The theory is cool but, let's code! Let's build our application from scratch.

For that to work we will need to build:

1. The REST API Server
2. The GraphQL Server
3. The Front end application

The full code-base you can find [here](https://github.com/galexandrade/heroes-graphql). Feel free to clone it and play with it!

## REST API Server

I have decided to use NodeJS with [hapi](https://hapi.dev) to build our Rest API Server. You can use whatever language you are more familiar with.

Before following the [hapi start guide](https://hapi.dev/tutorials/gettingstarted/?lang=en_US) inside the folder `rest-api-server` I have created an `index.js` to configure the routes:

```javascript
//index.js
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
        path: '/movies',
        handler: handleGetMovies
    });
    ...
};
```

It will create three endpoints `/movies`, `/villains/{id}` and `/heroes/{id}` returning some mock data as my goal here if just to focus on the GraphQL part. You can take a look [here](https://github.com/galexandrade/heroes-graphql/blob/master/rest-api-server/index.js) to see the full code.

Running `yarn start` or `npm start` you should be able to start the server and hit those endpoints.

## GraphQL Server

Now we have our REST API server ready, we need to build the GraphQL server using as data-loader the endpoints we just built.

I have decided to use [Apollo](http://apollographql.com/) as I am more familiar with it, but you can use whatever you are more comfortable with.

I have created a folder called `graphql-server` and followed the [Apollo start guide](https://www.apollographql.com/docs/apollo-server/getting-started/) to install it there.

An Apollo server is pretty simple, this is the entry point `index.js`:

```javascript
//index.js
const { ApolloServer, gql } = require("apollo-server")
const typeDefs = require("./typeDefs")
const resolvers = require("./resolvers")
const RestAPI = require("./dataSource")

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return { restAPI: new RestAPI() }
  },
})

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
```

It is just grouping together three files into the class `ApolloServer`, witch one referring to one important concept when we talk about GraphQL Server: `typeDefs`, `Resolvers`, and `dataSources`. Let's take a closer look at them:

**1 - TypeDefs**

It is where we define our graphs, I mean, the schema. Here is the place where we define the domain relationships. Forget all about API schemas, [switch your mind to think only about domains and entities](https://graphqlme.com/2017/11/11/build-better-graphql-apis-thinking-in-graphs/).

Let's create the following entities:

```javascript
//typeDefs.js
const { gql } = require("apollo-server")

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

  type Movie {
    id: ID
    name: String!
    link: String!
    villain: Villain!
    heroes: [Hero!]!
  }

  type Query {
    getMovies: [Mission!]!
  }
`

module.exports = typeDefs
```

Let's take a closer look at the `Movie` entity. There, we say it has a villain of the type `Villain` and it also has multiple heroes, as a collection of `Hero`.

The exclamation mark says that property cannot be `null`.

**2 - Resolvers**

Resolver is the guy responsible for getting a piece of data that was requested.

First, we have defined a resolver for `Query` and inside `getMovies`, it will be our entry point for when we query for `movies`. There it is calling a data-source (we will talk more about data-sources) to fetch our movies witch is the same response we return on the `/movies` endpoint.

```javascript
//resolvers.js
const resolvers = {
    Query: {
        getMMovies: (_source, _args, { dataSources }) =>
            dataSources.restAPI.getMovies(),
    },
    ...
};

module.exports = resolvers;
```

Wait? How will it load the villain and the heroes as we have defined on our type definition?

This is important!

There is a resolver for `Movies`. Whenever a `Movie` type is returned this resolver will be invoked to grab related data (if the user requested it). Here it has a resolver for `villain`, it basically calls a data-source and them it bring data from `/villains/{id}` with the `id` coming from the parent, I mean, the movie.

```javascript
//resolvers.js
const resolvers = {
    ...
    Movie: {
        villain: (parent, _args, { dataSources }) => {
            return dataSources.restAPI.getVillain(parent.villain_id);
        },
        ...
    },
};

module.exports = resolvers;
```

The same happens with heroes. It maps all the `heroes_ids` and calls the endpoint `/heroes/{id}` for each element.

```javascript
//resolvers.js
const resolvers = {
    ...
    Movie: {
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

You might be concerned about performance as it will be calling the `/heroes/{id}` endpoint several times. As I said, my goal here is just to explain how you can merge and load related data easily. But, YES! This might be a problem and there is a solution, it is called [data-loader](https://www.apollographql.com/docs/apollo-server/data/data-sources/) where you can batch and make only one request.

Also, in production, the GraphQL server will be in the same network as the REST API server decreasing the load time compared with the client (browser) making those requests.

**3 - DataSources**

DataSources define where load things from. In this case, I have used the `apollo-datasource-rest` to link with the REST APIs. It is used by the resolver that we talked about above.

```javascript
//dataSource.js
const { RESTDataSource } = require("apollo-datasource-rest")

class RestAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = "http://localhost:3030/"
  }

  async getMovies() {
    return this.get("movies")
  }

  async getVillain(id) {
    return this.get(`villains/${id}`)
  }

  async getHero(id) {
    return this.get(`heroes/${id}`)
  }
}

module.exports = RestAPI
```

**Wrapping up our GraphQL Server**

At this point, if you run `yarn start` or `npm start` you will start the server. Remember the REST API server needs to be up.

On your browser, navigating to http://localhost:4000/ should open the GraphQL playground.

![Apollo playground](/assets/graphqlplayground.png "Apollo playground")

Cool! Now we have our GraphQL running! Can you feel the power? ⚡

[Here](https://github.com/galexandrade/heroes-graphql/tree/master/graphql-server) you can find the full code-base of our ApolloServer.

## Front end

Now, let's connect the last piece missing on our puzzle, the front-end.

My focus here is on the GraphQL part, so, I'm not concerned about styling or testing the components properly.

First, we need to [create a new React application](https://reactjs.org/docs/create-a-new-react-app.html) with `create-react-app` and then install the [Apollo client for React](https://www.apollographql.com/docs/react/get-started/):

```sh
npm install apollo-boost @apollo/react-hooks graphql
```

Now we need to connect our Apollo Server with our front-end through `ApolloProvider`.

```javascript
//index.js
import { ApolloProvider } from "@apollo/react-hooks"
import ApolloClient from "apollo-boost"

const client = new ApolloClient({
  uri: "http://localhost:4000",
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
```

Perfect! Now let's create the `graphql/query.js` file to create our first query asking for what we want:

```javascript
import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"

export const MOVIES_QUERY = gql`
  {
    getMovies {
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
`
```

Awesome! Now, we just need to use it!

Let's open the `App.js` and hook it up (literally) with the query that we just built using `useQuery`:

```javascript
import React from "react"
import MovieCard from "./components/MovieCard"
import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { MISSIONS_QUERY } from "./graphql/query"

const App = () => {
  const { loading, error, data } = useQuery(MISSIONS_QUERY)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>
  const movies = data.getMovies

  return (
    <div className="app">
      <header className="app-header">
        <h1>Heroes movies 🍿🎬</h1>
      </header>
      <div className="list">
        {movies.map((movie, index) => (
          <MovieCard key={index} {...movie} />
        ))}
      </div>
    </div>
  )
}

export default App
```

`useQuery` returns and object containing `loading`, `error`, and `data`. Inside `data` will be available all the movies including everything we asked such as villain and heroes.

Now we just need to render it. On the code above I am rendering each `movie` with the component `MovieCard`. Let's take a closer look at that component:

```javascript
import React from "react"
import ListItem from "./ListItem"

const MovieCard = ({ name, link, villain, heroes }) => (
  <div className="movie" onClick={() => window.open(link, "_blank")}>
    <h2 className="title">{name}</h2>
    <div className="label">Villain:</div>
    <ListItem name={villain.name} photo={villain.photo} />

    <div className="label">Heroes who saved the day:</div>
    {heroes.map((hero, index) => (
      <ListItem key={index} name={hero.name} photo={hero.photo} />
    ))}
  </div>
)

export default MovieCard
```

As you can see it receives `villain` and `heroes` with name and photo and just renders it. AMAZING!!

## Conclusion

As you saw, with only one HTTP request we were able to receive all the data we needed to render our movie cards displaying the villain and the heroes associated with each movie.

The GraphQL server was able to handle our request and join all the associated data making the REST API calls on demand. We didn't dive deep, but Apollo provides awesome performance tools. One of the greatest features is caching. I really recommend you to take a deep dive into it.

GraphQL brings great benefits:

1. Front-end and mobile just receive what they want! Nothing more, nothing less!
2. No need to make several requests to grab related data from other endpoints.
3. Less network traffic between your front-end application and backend as GraphQL might be on the same network as the REST Server.
4. Better user experience as the user will probably see fewer spinners and it will be faster (much faster when using cache).
5. Much more benefits that cannot fit on this article...

Enjoy it!
