# BlogApp

BlogApp is a simple blogging platform built with Node.js, Express, and MongoDB. It uses Handlebars as the templating engine and Passport for authentication.

## Features

- User authentication with Passport
- Flash messages for alerts and errors
- CRUD operations for blog posts and categories
- Sorting and filtering of blog posts by categories

## Modules

- `express`: Framework for building web applications on Node.js
- `express-handlebars`: A Handlebars view engine for Express
- `body-parser`: Middleware to handle HTTP POST request in Express.js
- `mongoose`: MongoDB object modeling tool
- `express-session`: Session middleware for Express
- `connect-flash`: Flash messages for Express applications
- `passport`: Authentication middleware for Node.js

## Setup

1. Install dependencies with `npm install`
2. Start the server with `npm start`
3. Visit `http://localhost:8081` in your browser

## Routes

- `/admin`: Admin routes
- `/usuarios`: User routes
- `/`: Home page, displays all blog posts
- `/postagem/:slug`: Displays a single blog post
- `/categorias`: Displays all categories
- `/categorias/:slug`: Displays all blog posts in a category
- `/404`: Error page

## Database

The application uses MongoDB for data storage. It connects to a local MongoDB instance by default (`mongodb://localhost/blogapp`).

## Public

The `public` directory contains all static files used in the application.

## Running the Application

The application runs on port 8081 by default. You can change this by modifying the `port` variable in `app.js`.

## Note

This is a basic blogging platform and is not intended for production use without further development and security considerations.
