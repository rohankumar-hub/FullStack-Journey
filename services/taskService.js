
const fs = require("fs");
const path = require("path");

const DEFAULT_TASKS_FILE = path.join(__dirname, "..", "data", "tasks.json");
let TASKS_FILE = DEFAULT_TASKS_FILE;

function setTasksFilePath(filePath){
    TASKS_FILE = filePath;
}

function getTasks() {
    return new Promise((resolve, reject) =>{
        fs.readFile(TASKS_FILE, (error, data)=>{
            if(error){
                reject(error);
                return;
            }
            try{
                const tasks = JSON.parse(data);
                if(!Array.isArray(tasks)){
                    throw new Error("Tasks must be an array");
                }

                tasks.forEach(task =>{
                    if(typeof task.id !== "number" || typeof task.title !== "string" || typeof task.completed !== "boolean"){
                        throw new Error("Invalid task data");
                    }
                });

                resolve(tasks);
            }
            catch(error){
                reject(error);
            }
        });
    });
}

async function getTaskById(id) {
    const tasks = await getTasks();

    const task = tasks.find(task => task.id === id);

    if(!task){
        return null;
    }

    return task;
}

async function createTask(title) {
    const tasks = await getTasks();

    let highestId = 0;
    tasks.forEach(task =>{
        if(task.id > highestId){
            highestId = task.id;
        }
    });

    const newTask = {
        id: highestId + 1,
        title: title,
        completed: false
    }

    tasks.push(newTask);

    await writeTasks(tasks);

    return newTask;

}

async function updateTask(id, updates) {
    const tasks = await getTasks();

    const updatedTask = tasks.find(task => task.id === id);

    if(!updatedTask){
        return null;
    }

    if(updates.completed !== undefined){
        updatedTask.completed = updates.completed;
    }

    if(updates.title !== undefined){
        updatedTask.title = updates.title;
    }

    await writeTasks(tasks);

    return updatedTask;
}

async function deleteTask(id) {
    const tasks = await getTasks();

    const deletedTask = tasks.find(task => task.id === id);

    if(!deletedTask){
        return null;
    }

    const newTasks = tasks.filter(task => task.id !==id);

    await writeTasks(newTasks);

    return deletedTask;
    
}

function writeTasks(tasks){
    return new Promise((resolve, reject) =>{
        fs.writeFile(TASKS_FILE, JSON.stringify(tasks), error =>{
            if(error){
                reject(error);
                return;
            }
            resolve();
        });
    });
}

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    setTasksFilePath,
    writeTasks
};
