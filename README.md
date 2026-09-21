# Task Management REST API

A RESTful backend API built using Node.js, Express.js and SQLite.

## Features

- RESTful API
- CRUD operations
- SQLite database
- Input validation
- Error handling
- JSON responses
- Swagger API documentation
- Proper HTTP status codes

## Technologies

- Node.js
- Express.js
- SQLite
- Express Validator
- Swagger
- Postman

## Installation

Clone the repository:

git clone YOUR_GITHUB_URL

Navigate into the project:

cd task-management-api

Install dependencies:

npm install

Start the application:

npm start

For development:

npm run dev

## API Base URL

http://localhost:3000

## API Documentation

http://localhost:3000/api-docs

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/:id | Get task by ID |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

## Data Model

### Task

| Field | Type | Description |
|------|------|-------------|
| id | INTEGER | Unique task ID |
| title | TEXT | Task title |
| description | TEXT | Task description |
| status | TEXT | Task status |
| priority | TEXT | Task priority |
| created_at | DATETIME | Creation time |

## Status Values

- pending
- in-progress
- completed

## Priority Values

- low
- medium
- high

## Example Request

POST /api/tasks

```json
{
  "title": "Complete project",
  "description": "Build REST API",
  "status": "pending",
  "priority": "high"
}