# Documentation

## Any instructions for us to run your code and understand your solution.

Steps to run the server:

- `cd server`
- `npm i`
- `npm run dev`

Steps to run rontend:

- `cd frotend`
- `npm i`
- `npm run dev`

My solution is fairly simple to understand. For the server, I didn't end up using any new libraries to implement my solution. My first goal was to create the accounts and deals tables, and make basic api endpoints to retrieve the organizations, accounts, and deals records from their tables. Then I added endpoints to create each object respectively. (These endpoints aren't actually needed for the final solution, however I used them for inital testing and left them in the solution for fun) I proceeded to test the endpoints with Postman, once I was confident the endpoints were working as expected, I began working on a page in the frontend that could call the api endpoints and simply display the data. Once I could see the application was working end-to-end, it was just refining the look and functionality of the web app. For the frontend, I decided to make use of Tailwind CSS, AntDesign, and React Router. I used React Router to add a navbar to the top of the screen, so that we can navigate from the orginal homepage to the `Deals` page. I used Tailwind CSS and Antdesign for components and styling.

## What decisions did you end up making?

Server

- I decided to organize the routes in the express api into files such as `organizations.route.ts` and put them in the routes folder. This helps keep the endpoints organized and seperated from unrelated endpoints.
- I used the `req.app.locals` storage for an easy way to store the database connection so that it can be accessed by all the route handlers.

Frontend

- I decided to use React Router, Tailwind CSS, and Antdesign for additional libraries.
- I added a navbar to the top of the screen for easy navigation.
- I decided to create a simple `api.ts` file which houses the interfaces and functions needed to interact with my server. I chose this solution because of how small and simple the application is.

## What assumptions did you make?

- I made the assumption that the infrastructure supporting this web app would be able to scale under pressure and continue serving the app efficiently.
- I made the assumption that if organizations want to "view all of their deals and how much they are worth.", then they might want to see the `total value` and `average value` of their deals as well.

## What would you have done if you had more time?

Server

- I would consider creating a cleaner architecture, where we would have service classes. For example `organizations.service.ts` which would house functions that would interact directly with the database as their only concern. These service classes when then be using directly in the route handlers to perform any datanse operations. This pattern is super helpful when codebases get large by reducing code duplication, increacing code resuability, and improving organization.
- I would have liked to implement a better solution for sharing types across the frontend and server. There are ways to share the types from end-to-end which make for a much better developer experience by improving type safety.

Frontend

- I would consider adding a service architecture to the frontend as well, for all the same benefits. The service classes would help code reusability and maintainability by having a single place to have functions that access the server.
- I would like to have a better way of pulling types from the backend to the frontend, for increased type safety as I mentioned before.

## Is there any feedback/questions you have for us?
