const { test, beforeEach } = require("node:test");
const assert = require("node:assert");

const fs = require("fs").promises;

const path = require("path");

const taskService = require("../services/taskService");

const TEST_PATH = path.join(__dirname, "test-tasks.json");

taskService.setTasksFilePath(TEST_PATH);

beforeEach(async () =>{
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
})

test("getTaskById returns the task with the requested id", async () =>{
    const task = await taskService.getTaskById(1);

    assert.deepStrictEqual(task, {
        id: 1,
        title: "Test task 1",
        completed: false
    });
});

test("getTaskById returns null when the task doesn't exist", async () =>{
    const task = await taskService.getTaskById(8);

    assert.strictEqual(task, null);
});

test("createTask creates a new task", async () => {
    const newTask = await taskService.createTask("Test task 3");

    assert.deepStrictEqual(newTask, {
        id: 3,
        title: "Test task 3",
        completed: false
    });
});

test("updates the completed status of task 1 to true", async () =>{
    const updatedTask = await taskService.updateTask(1, true);

    assert.deepStrictEqual(updatedTask, {
        id: 1,
        title: "Test task 1",
        completed: true
    });
})

test("updateTask() returns null when the task doesn't exist", async ()=>{
    const updatedTask = await taskService.updateTask(98, true);

    assert.strictEqual(updatedTask, null);
})

test("deleteTask() deletes test task 2", async () =>{
    const deletedTask = await taskService.deleteTask(2);

    assert.deepStrictEqual(deletedTask, {
        id: 2,
        title: "Test task 2",
        completed: false
    });
})

test("deleteTask returns null when the task doesn't exist", async () =>{
    const deletedTask = await taskService.deleteTask(988);

    assert.strictEqual(deletedTask, null);
})

test("checks the persistence of the data by updateTask()", async () =>{
    await taskService.updateTask(1, true);
    const task = await taskService.getTaskById(1);

    assert.deepStrictEqual(task, {
        id: 1,
        title: "Test task 1",
        completed: true
    });
})

test("checks the persistence of the data by deleteTask()", async () =>{
    await taskService.deleteTask(1);
    const task = await taskService.getTaskById(1);

    assert.strictEqual(task, null);
})

test("getTasks rejects when the JSON is invalid", async () =>{
    await fs.writeFile(TEST_PATH, "This is invalid JSON")

    await assert.rejects(
        taskService.getTasks()
    );

})

test("getTasks rejects when the data is not an array", async () =>{
    await fs.writeFile(TEST_PATH, '{"id":1,"title":"Not an array","completed":false}' );

    await assert.rejects(
        taskService.getTasks()
    );
});

test("getTasks rejects when the array contains invalid task", async () =>{
    await fs.writeFile(TEST_PATH, '{"id":"ha","title":7,"completed":"false"}');

    await assert.rejects(
        taskService.getTasks()
    );
});

test("getTask rejects when the file cannot be read", async () =>{
    taskService.setTasksFilePath("abaaba");

    await assert.rejects(
        taskService.getTasks()
    );
    taskService.setTasksFilePath(TEST_PATH);    
});