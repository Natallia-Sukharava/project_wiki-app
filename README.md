## Wiki App Project

This project is a simple full-stack Node.js + React application for managing articles.

The project consists of two main parts:

Backend (Node.js, Express) — provides REST API for managing articles.
Frontend (React + Vite) — provides a simple user interface to create, view, and list articles.

## Project structure

project_wiki-app/
│
├── backend/
│   ├── controllers/
│   │   └── articlesController.js
│   ├── routes/
│   │   └── articles.js
│   │── models/
│   │   └── articleModel.js
│   ├── data/             
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

GET /api/articles — returns a list of all articles.
GET /api/articles/:id — returns a single article by its identifier.
POST /api/articles — creates a new article and saves it as a JSON file.
Basic validation for required fields (title, content).
Data is stored in backend/data as individual .json files.

### Frontend

Displays all existing articles.
Allows creating a new article using a WYSIWYG editor (ReactQuill).
Allows viewing a full article by clicking its title.
Automatically updates the article list after creating a new one.
Includes a development proxy (vite.config.js) to connect frontend and backend seamlessly.

## Installation

### 1. Clone the repository

git clone https://github.com/Natallia-Sukharava/project_wiki-app
cd project_wiki-app

### 2. Backend setup

cd backend
npm install
node server.js

The server will start at:
http://localhost:4000

### 3. Frontend setup

In a new terminal:

cd frontend
npm install
npm run dev


The app will run at:
http://localhost:5173

## Technologies used

Backend: Node.js, Express, CORS, Body-parser, File System (fs)
Frontend: React, React Router, React Quill, Vite