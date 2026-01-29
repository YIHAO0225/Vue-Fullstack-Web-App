Cartoonopia – Full-Stack Cartoon Character Management System

A full-stack web application built with Vue 3, Node.js, and MongoDB.

Cartoonopia is a character management platform where users can browse, filter, compare, and favourite cartoon characters with multiple attributes.
The system includes user authentication, admin approval workflow, and a full CRUD backend powered by MongoDB.
This project was developed as part of a team, and I contributed across the entire full-stack lifecycle.

Features
User Features

Browse all cartoon characters

Filter by attributes (strength, speed, intelligence, power, etc.)

View character details

Compare characters (VS view)

Register & log in

Favourite characters

Submit new characters as “contribution requests”

View personal profile and contribution history

Admin Features

Approve/reject character contribution requests

Manage character list

Manage users

View all contribution history

My Role (Full-Stack Contributor)

I participated in all major development activities, including:

Frontend (Vue 3 + Element Plus)

Implemented multiple UI views (Home, Character Detail, New Character, Profile, Admin Panel)

Integrated frontend with backend REST APIs using Axios

Built form pages, filters, validation, and interactive components

Designed and implemented page routing using Vue Router

Helped with state handling, layout design, and UX consistency

Backend (Node.js + Express.js + MongoDB)

Helped design MongoDB models (characters, users, favourites, contributions)

Implemented and tested RESTful APIs for authentication, characters, contributions, and favourites

Worked on login logic (bcryptjs hashing, session handling)

Participated in backend debugging, error handling, and schema validation

Ensured consistent API contracts with the frontend

Collaboration & Testing

Participated in team discussions, feature breakdown, and task planning

Performed full-stack integration tests

Troubleshot issues across UI, API routes, and database behaviour

Supported other developers during integration and testing phases

Tech Stack
Frontend
Vue 3
Vite
Vue Router
Element Plus
Axios

Backend
Node.js
Express.js
MongoDB + Mongoose
bcryptjs
body-parser, CORS

System Architecture (Overview)
Vue Frontend (SPA)
   ↕ Axios
Express.js Backend (REST API)
   ↕ Mongoose
MongoDB Database


Main API modules include:

/v1/characters
/v1/users
/v1/favourites
/v1/contributions
/v1/sessions (login)

Run the Project
Backend
cd server
npm install
node server.js
# Backend runs on http://localhost:3001

Frontend
cd cartoonopia
npm install
npm run dev
# Frontend runs on http://localhost:5173

Project Structure (Simplified)
cartoonopia/
  src/
    views/          # UI pages
    components/     # reusable components
    router/         # page routing
    assets/         # images/icons
    main.js

server/
  app/
    models/         # Mongoose schemas
    controllers/    # request handlers
    routers/        # API routing
  server.js         # Express entrypoint

Project Summary

Cartoonopia demonstrates a complete full-stack workflow using modern JavaScript technologies.
The project includes user authentication, admin workflows, CRUD operations, data modelling, and full front-to-backend integration—reflecting practical experience in building real-world web applications.
