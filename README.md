# CalcuBot 🤖

A client/server-based chatbot that can solve basic math problems.

The frontend is implemented in React and communicates with the backend via websockets using socket.io.

The backend is built on Node.js and the Express.js framework.

A history of calculations is stored in a MongoDB database.

## Prerequisites

In order to run this project, you need to have...

 * Node.js >= 22.0.0 (might work with older versions, but not tested)
 * Yarn (v1 is enough)
 * MongoDB (either install it locally on your computer or register for the free tier on https://www.mongodb.com/)

## Setup
 * Clone the repository
    ```bash
    git clone git@github.com:chrisEff/calcubot.git
    ```
 * Install the dependencies with Yarn.
    ```bash
    cd calcubot
    yarn
    ```
 * A postinstall hook should have automatically created `.env` files in both `packages/backend` and `packages/frontend`. You can change the settings to your liking or leave them as-is. The only thing you have to adjust is the `MONGODB_URI` in `packages/backend/.env` to point to your MongoDB instance.


 * Then you can start the backend by running this in the project's root directory:
    ```bash
    yarn start:backend
    ```
 * Next, open a second terminal and start the frontend:
    ```bash
    yarn start:frontend
    ```
 * Once the frontend has started up successfully, the console output will show you the URL where you can access the app. 

## Automated tests

The backend has a few unit tests that can be run with the following command:

```bash
   cd packages/backend
   yarn test
```
