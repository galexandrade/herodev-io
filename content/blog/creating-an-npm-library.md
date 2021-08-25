---
path: creatin-a-npm-library
date: 2021-08-25T12:20:32.956Z
title: Creating an NPM library
description: Creating an NPM library can be overwhelming. Let's make it simple together!
---
Creating an NPM library can be overwhelming. Let's make it simple together!



* Open your terminal and let's start creating our library using [create-react-library.](https://github.com/transitive-bullshit/create-react-library)
* Run the command to create your library: \`npx create-react-library\`. It will ask you a couple of questions:
  * Package Name: It should be the name you want it to show up on NPM, for example, \`sous-chef-icons\`.
  * Package Description: A simple description of what your library does (you also can change it later).
  * Author's GitHub Handle: Who is creating this library.
  * GitHub Repo Path: Where will this code be stored in Git.
  * License: How you want to distribute this library. The default is MIT.
  * Package Manager: Do you prefer using \`npm\` or \`yarn\`?
  * Template: You can select \`default\` which is plain javascript. You also have the option to select \`typescript\` or \`custom\` (if you use Flow you can customize to use it).
* Open the created folder on VSCode (or any other code editor of your choise, sorry).
* Let's understand the commands available on your \`package.json\`:
  * \`yarn build\` - It will compile your package and store it in the \`/dist\` folder. This is going to be stored in NPM later.
  * \`yarn start\` - Used for local development where you can have your example running (\`cd example & yarn start\`) then all the changes you make on the library will update the \`dist\` folder and reflect on your live example.
  * \`yarn test\` - It will ensure all your project is working fine (unit tests, linting and build). You can execute this in CI.
  * \`yarn test:unit\` - You can use this to run your local javascript tests.
  * \`yarn test:watch\` - As you love TDD, this will keep your tests watch for changes and then re-execute the tests again.
  * \`yarn deploy\` - If you want to deploy your example application using GitHub Pages, this command will do the trick for you.
*
