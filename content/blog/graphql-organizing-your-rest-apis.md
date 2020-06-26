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

![Rest API](/assets/rest.png "Rest API")

On the front end is where things get complicated. For every mission coming from \`/missions\` we need to display also the villain and heroes information, but we only have id's on the \`/missions\` endpoint. We would have to deal with multiple api calls on the frontend to get all the data needed, and also play with \`Promises\` to wait for the related data. Something like this:

```
FETCH MISSION 1    - FETCH VILLAIN    - FETCH HEROES...for all other missions
```

You could do some magic with \`Promise.all()\` but even that is a nightmare and not permanent as it will hit your REST api server several times.

This is just a pretty simple application to exemplify the need to fetch related data. I am sure you have clear and real example where you were struggling to fetch those related data.

ROUTE

So, we can call GraphQL to save the day!

But, what is GraphQL?

SOLUTION

How can we simplfy this application with GraphQL?
