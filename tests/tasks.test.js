const {test, before, beforeEach, after} = require("node:test");
const assert = require("assert");

const app = require("../app");

const path = require("path");

const taskService = require("../services/taskService");
const TEST_PATH = path.join(__dirname, "test-tasks.json");

taskService.setTasksFilePath(TEST_PATH);


let server;
let baseURL;

before(() =>{
    server = app.listen(0);

    const port = server.address().port;
    baseURL = `http://localhost:${port}`;
});

beforeEach(async ()=>{
    const testTasks = [
    {
        id: 1,
        title: "Test task 1",
        completed: false
    },
    {
        id: 2,
        title: "Test task 2",
        completed: false
    }
    ];
    await taskService.writeTasks(testTasks);
});

after(() =>{
    server.close();
});

test("GET /tasks returns all tasks", async () =>{
    const response = await fetch(`${baseURL}/tasks`);

    assert.strictEqual(response.status, 200);

    const tasks = await response.json();

    assert.ok(Array.isArray(tasks));
});

test("GET /tasks/:id returns the task when it exists", async ()=>{
    const response = await fetch(`${baseURL}/tasks/1`);

    assert.strictEqual(response.status, 200);

    const task = await response.json();

    assert.deepStrictEqual(task, {
        id: 1,
        title: "Test task 1",
        completed: false
    });
});

test("GET /tasks/:id returns 404 when the task doesn't exist", async () =>{
    const response = await fetch(`${baseURL}/tasks/979`);

    assert.strictEqual(response.status, 404);
});

test("GET /tasks/:id returns 400 when the id is invalid", async () =>{
    const response = await fetch(`${baseURL}/tasks/avb`);

    assert.strictEqual(response.status, 400);
});

test("POST /tasks creates a new task", async () =>{
    const response = await fetch(`${baseURL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type":"application/json" 
        },
        body: JSON.stringify({
            title: "Test API task"
        })
    });

    assert.strictEqual(response.status, 201);

    const task = await response.json();

    assert.strictEqual(task.title, "Test API task");
    assert.strictEqual(task.completed, false);
    assert.ok(typeof task.id === "number");
});

test("POST /tasks returns 400 if the title is invalid", async () =>{
    const response = await fetch(`${baseURL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
        })
    });

    assert.strictEqual(response.status, 400);
})

test("PATCH /tasks/:id updates the completed status", async () =>{
    const response = await fetch(`${baseURL}/tasks/2`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            completed: true
        })
    });

    assert.strictEqual(response.status, 200);

    const task = await response.json();

    assert.strictEqual(task.completed, true);
});

test("PATCH /tasks/:id returns 404 when the task doesn't exist", async () =>{
    const response = await fetch(`${baseURL}/tasks/87`,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            completed: true
        })
    });

    assert.strictEqual(response.status, 404);
});

test("PATCH /tasks/:id returns 400 when the completed is invalid", async () =>{
    const response = await fetch(`${baseURL}/tasks/2`,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            completed: "ha"
        })
    });

    assert.strictEqual(response.status, 400);
});

test("PATCH /tasks/:id returns 400 when the id is invalid", async () =>{
    const response = await fetch(`${baseURL}/tasks/abc`,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            completed: false
        })
    });

    assert.strictEqual(response.status, 400);
});

test("DELETE /tasks/:id deletes the task", async () =>{
    const response = await fetch(`${baseURL}/tasks/1`,{
        method: "DELETE",
    });

    assert.strictEqual(response.status, 204);
});

test("DELETE /tasks/:id returns 400 when id is invalid", async () =>{
    const response = await fetch(`${baseURL}/tasks/abc`,{
        method: "DELETE",
    });

    assert.strictEqual(response.status, 400);
});

test("DELETE /tasks/:id returns 404 if the task doesn't exist", async () =>{
    const response = await fetch(`${baseURL}/tasks/99`,{
        method: "DELETE",
    });

    assert.strictEqual(response.status, 404);
});