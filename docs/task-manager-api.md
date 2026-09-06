# Task Manager API

A REST API for managing tasks. The API supports creating, reading, updating, and deleting tasks.

## Features

* Get all tasks
* Get a single task by ID
* Create a task
* Update a task's completion status
* Delete a task
* Persistent storage using a JSON file
* Separate route and service layers
* Asynchronous operations using Promises and `async/await`

---

## Project Structure

```text
FullStack-journey/
├── data/
│   └── tasks.json
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── routes/
│   └── tasks.js
├── services/
│   └── taskService.js
├── server-express.js
└── package.json
```

### Responsibilities

**`server-express.js`**

Creates and configures the Express server, middleware, and route mounting.

**`routes/tasks.js`**

Handles HTTP requests and responses. It is responsible for request validation, HTTP status codes, and calling the appropriate service functions.

**`services/taskService.js`**

Contains task-related logic such as finding, creating, updating, and deleting tasks.

**`data/tasks.json`**

Stores the tasks persistently.

**`public/`**

Contains the frontend files that communicate with the API.

---

# API Endpoints

| Method | Endpoint     | Purpose                  | Success |
| ------ | ------------ | ------------------------ | ------- |
| GET    | `/tasks`     | Get all tasks            | `200`   |
| GET    | `/tasks/:id` | Get one task             | `200`   |
| POST   | `/tasks`     | Create a task            | `201`   |
| PATCH  | `/tasks/:id` | Update completion status | `200`   |
| DELETE | `/tasks/:id` | Delete a task            | `204`   |

Common error responses:

| Status | Meaning                       |
| ------ | ----------------------------- |
| `400`  | Invalid request data          |
| `404`  | Requested task does not exist |
| `500`  | Server-side error             |

---

# GET `/tasks`

Returns all tasks.

### Flow

```text
Client
  ↓
GET /tasks
  ↓
Route handler
  ↓
taskService.getTasks()
  ↓
getTasks()
  ↓
tasks.json
  ↓
tasks array
  ↓
Route sends 200 response
```

The route calls `getTasks()`, which returns a Promise. The route uses `await` to wait for the Promise to fulfill.

If the operation fails, the error is caught by `try/catch` and the route returns `500`.

### `getTasks()`

`getTasks()` creates and returns a Promise.

Inside the Promise, `fs.readFile()` reads `tasks.json`.

If the file is successfully read, its contents are parsed into a tasks array and the Promise is fulfilled with that array.

If reading the file fails, the Promise is rejected with the error.

---

# GET `/tasks/:id`

Returns a single task.

### Flow

```text
Client
  ↓
GET /tasks/:id
  ↓
Route gets ID from URL
  ↓
taskService.getTaskById(id)
  ↓
getTasks()
  ↓
find task
  ↓
task / null
  ↓
Route converts result to HTTP response
```

If the task exists, the route returns `200` with the task.

If no task exists with that ID, the service returns `null` and the route converts that into a `404` response.

If an error occurs, the route returns `500`.

### `getTaskById(id)`

`getTaskById()` waits for `getTasks()` and searches the resulting array for the requested ID.

If a matching task is found, it returns the task.

If no task is found, it returns `null`.

The service does not return HTTP status codes. HTTP concerns are handled by the route.

---

# POST `/tasks`

Creates a new task.

### Request body

```json
{
  "title": "Learn Express"
}
```

### Flow

```text
Client
  ↓
POST /tasks
  ↓
Validate title
  ↓
taskService.createTask(title)
  ↓
getTasks()
  ↓
find highest ID
  ↓
create new task
  ↓
push into tasks array
  ↓
writeTasks(tasks)
  ↓
return newTask
  ↓
201 Created
```

The route validates that `title` is a non-empty string. If it is invalid, the route returns `400`.

The title is trimmed before being passed to the service.

### `createTask(title)`

`createTask()` gets the current tasks and finds the highest existing ID.

It creates a new task with:

```json
{
  "id": "highest existing ID + 1",
  "title": "provided title",
  "completed": false
}
```

The new task is pushed into the tasks array.

The entire updated array is then passed to `writeTasks()` and saved to `tasks.json`.

After the write succeeds, `createTask()` returns the new task.

---

# PATCH `/tasks/:id`

Updates a task's completion status.

### Request body

```json
{
  "completed": true
}
```

### Flow

```text
Client
  ↓
PATCH /tasks/:id
  ↓
Validate completed
  ↓
taskService.updateTask(id, completed)
  ↓
getTasks()
  ↓
find task
  ↓
modify completed
  ↓
writeTasks(tasks)
  ↓
return updatedTask
  ↓
200 OK
```

The route first validates that `completed` is a boolean.

If it isn't, the route returns `400`.

If the task doesn't exist, `updateTask()` returns `null`, which the route converts into `404`.

If the update succeeds, the route returns the updated task.

If an error occurs, the route returns `500`.

### `updateTask(id, completed)`

`updateTask()` gets the tasks and finds the task with the requested ID.

If the task doesn't exist, it returns `null`.

If it exists, its `completed` property is changed.

The entire tasks array is then passed to `writeTasks()` so the modified task is persisted to the file.

After the write succeeds, the function returns the updated task.

---

# DELETE `/tasks/:id`

Deletes a task.

### Flow

```text
Client
  ↓
DELETE /tasks/:id
  ↓
taskService.deleteTask(id)
  ↓
getTasks()
  ↓
find task
  ↓
create new array without task
  ↓
writeTasks(newTasks)
  ↓
return deletedTask
  ↓
204 No Content
```

If the task doesn't exist, the service returns `null` and the route returns `404`.

If the deletion succeeds, the route returns `204 No Content`.

If an error occurs, the route returns `500`.

### `deleteTask(id)`

`deleteTask()` first finds and stores the task that will be deleted.

It then uses `filter()` to create a new array containing every task except the one with the requested ID.

The new array is written to `tasks.json`.

After the write succeeds, the function returns the deleted task.

The returned deleted task is useful to the service/route, but the route currently responds with `204 No Content`.

---

# `writeTasks(tasks)`

`writeTasks()` is responsible for writing the complete tasks array to `tasks.json`.

It returns a Promise.

```text
writeTasks(tasks)
      ↓
fs.writeFile()
      ↓
   ┌──┴──┐
   ↓     ↓
success error
   ↓     ↓
resolve reject
```

The Promise resolves when the file is successfully written.

It rejects if `fs.writeFile()` encounters an error.

The function does not need to resolve with the tasks because its caller already has the array.

---

# Async Operations

The application uses different asynchronous approaches at different layers.

The Node.js filesystem functions such as `fs.readFile()` and `fs.writeFile()` use callbacks.

`getTasks()` and `writeTasks()` wrap those callback-based operations in Promises.

The task service functions use `async/await` to work with those Promises.

The route handlers also use `async/await` to work with the service functions.

```text
fs.readFile / fs.writeFile
          ↓
       Promise
          ↓
    Task Service
     async/await
          ↓
        Routes
     async/await
          ↓
     HTTP response
```

An `async` function always returns a Promise.

`await` works with a Promise regardless of how that Promise was created. It waits for the Promise to fulfill and gives the function its resolved value. If the Promise rejects, `await` throws the rejection error.

Because errors can propagate through the async functions, the route can handle them using `try/catch`.

---

# Separation of Responsibilities

The application separates HTTP concerns from task logic.

### Routes handle:

* HTTP methods and URLs
* Request data
* Input validation
* HTTP status codes
* HTTP responses
* Error responses

### Services handle:

* Reading tasks
* Finding tasks
* Creating tasks
* Updating tasks
* Deleting tasks
* Writing tasks to storage

This means the service layer does not need to know about HTTP status codes.

For example:

```text
Service:
task doesn't exist → null

Route:
null → 404 Not Found
```

Similarly:

```text
Service:
file operation fails → rejected Promise

Route:
rejected Promise → 500 Internal Server Error
```

This separation makes the application easier to understand, test, and extend.

---

# Overall Request Flow

```text
                 Client
                   ↓
              HTTP Request
                   ↓
              Express Router
                   ↓
          Validation / HTTP logic
                   ↓
              Task Service
                   ↓
             Business logic
                   ↓
        getTasks() / writeTasks()
                   ↓
             JSON file
                   ↓
              Result / Error
                   ↓
              Route handler
                   ↓
             HTTP Response
```

The main goal of using `async/await` is to make asynchronous operations read in a linear and understandable way while still using Promises underneath.

# Known Limitations

## Concurrent modifications

The application currently uses a JSON file as its data store.

Operations that modify tasks follow a **read → modify → write** pattern. If multiple requests modify the tasks at nearly the same time, one write can overwrite another, resulting in a lost update.

This is acceptable for this small learning project, but it would not be a reliable storage solution for a production application with concurrent users.

A production application would typically use a database with appropriate concurrency control and transaction mechanisms.


## Why I separated the API functions from UI functions

I separated the API and UI responsibilities to reduce complexity, making it easier to understand what each part of the code is actually responsible for.

The API communication responsibilities were separated into `createTask()`, `toggleTask()`, and `deleteTask()`.

`createTaskUI()`, `updateTaskTitleStyle()`, `updateTaskStatus()`, and `updateToggleButton()` handle the DOM-related work.

`addTaskToPage()` now creates the UI using `createTaskUI()` and sets up the toggle and delete event handlers, which use `toggleTask()` and `deleteTask()`.

`addTaskToPage()` acts somewhat like a manager. It coordinates the different functions without implementing all of their internal work itself.