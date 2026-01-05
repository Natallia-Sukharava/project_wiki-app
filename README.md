## Wiki App Project

This project is a simple full-stack Node.js + React application for managing articles with support for PostgreSQL, Sequelize migrations, file uploads and workspaces.

The project consists of two main parts:

Backend (Node.js, Express) — provides REST API for managing articles. The backend uses environment variables from .env for DB configuration.
Frontend (React + Vite) — provides a simple user interface to create, view, and list articles.

## Environment variables

backend/.env:
DB_HOST=localhost
DB_NAME=wiki_app
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_DIALECT=postgres
DB_PORT=5432
JWT_SECRET=your_secure_secret_here

config/config.json is required only for sequelize-cli (migrations).
The application runtime uses environment variables from backend/.env.

## Authentication & Security
### Backend Authentication

JWT-based authentication is implemented.
Users must register and login to obtain a JWT token.
The token is required to access protected API routes.

## Project structure

project_wiki-app/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── migrations/
│   │── uploads/
│   ├── .env      
│   ├── .env.example       
│   └── server.js        
│
├── frontend/
│   ├── src/
│   │   ├── api/  
│   │   ├── components/
│   │   │   ├── articles/  
│   │   │   └── layout/    
│   │   ├── pages/         
│   │   ├── styles/       
│   │   └── main.jsx
│   │   └── App.jsx
│   └── vite.config.js
│   └── eslint.config.js
│── README.md
│── .gitignore

## Features

### Backend

The backend is built with Express + PostgreSQL + Sequelize ORM.

### REST API
GET    /api/articles        list articles
GET    /api/articles/:id    get a single article
POST   /api/articles        create an article
PUT    /api/articles/:id    update an article (creates a new version)
GET    /api/article/:id/with-current   list article versions with current flag
GET    /api/version/:versionId         get a specific article version (read-only)
DELETE /api/articles/:id    delete an article

### Workspaces API
GET    /api/workspaces              list all workspaces
POST   /api/workspaces              create workspace
GET    /api/workspaces/:id          get workspace by id
GET    /api/workspaces/:id/articles list articles inside a workspace

### Article versioning

Articles support version control.
Each time an article is updated, the previous state is saved as a new immutable version.
Old versions are accessible in read-only mode via a dedicated API endpoint.

### UI behavior for article versions

When viewing an old version of an article:
A read-only banner is displayed in the UI
Editing is disabled
Attachments and comments are hidden, as they are not versioned entities
Users can return to the latest version via a dedicated button


### Data storage

All data is stored in a PostgreSQL database using Sequelize models and migrations.
Tables created by migrations:
Articles
ArticleVersions
Workspaces

### Frontend

Displays all existing articles.
Allows creating a new article using a WYSIWYG editor (ReactQuill).
Allows viewing a full article by clicking its title.
Automatically updates the article list after creating a new one.
Includes a development proxy (vite.config.js) to connect frontend and backend seamlessly.
The frontend also supports viewing historical article versions in read-only mode via the Versions UI.

## Frontend Authentication Flow

User registers using Register Page
User logs in using Login Page
Received JWT + user info stored in localStorage
Navbar dynamically changes:
  Guest → Login, Register
  Authenticated user → Home, New Article, New Workspace, Logout + email
When JWT expires or becomes invalid:
  user session is cleared
  user is redirected to Login page

## Installation

### Clone the repository

git clone https://github.com/Natallia-Sukharava/project_wiki-app
cd project_wiki-app

### Backend setup

cd backend
npm install
copy .env.example → .env and fill database credentials.
node server.js

The server will start at:
http://localhost:4000

### Frontend setup

In a new terminal:

cd frontend
npm install
npm run dev

### Database setup

Create PostgreSQL database manually (via psql or PGAdmin):
Database name: wiki_app

### Run database migrations

npm run db:migrate
npm run db:migrate:reset
These run Sequelize migrations and create required tables (Articles, Workspaces).

The app will run at:
http://localhost:5173

## Technologies used

Backend: Node.js, Express, Sequelize ORM, PostgreSQL, multer, WebSockets, JWT Authentication(jsonwebtoken), Password hashing (bcrypt)
Frontend: React, React Router, React Quill, Vite, JWT handling via LocalStorage, Protected Routes