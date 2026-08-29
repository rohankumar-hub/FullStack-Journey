const { error } = require("console");
const fs = require("fs");

const TASKS_FILE = "data/tasks.json";

function getTasks(callback) {
    fs.readFile(TASKS_FILE, (error, data) =>{
        if(error){
            callback(error, null);
            return;
        }

        const tasks = JSON.parse(data);
        callback(null, tasks);
    });
};

function getTaskById(id, callback) {
    getTasks((error, tasks) =>{
        if(error){
            callback(error, null);
            return;
        }

        const task = tasks.find(task => task.id== id);

        if(!task){
            callback(null,null);
            return;
        }
        callback(null, task);

    });
};

function createTask(title, callback) {
    getTasks((error, tasks) =>{
        if(error){
            callback(error, null);
            return;
        }

        let highestId = 0;
        tasks.forEach(task =>{
            if(task.id > highestId){
                highestId = task.id;
            }
        })

        const newTask = {
            id: highestId+1,
            title: title,
            completed: false
        }

        tasks.push(newTask);

        fs.writeFile(TASKS_FILE, JSON.stringify(tasks), (error) =>{
            if(error){
                callback(error,null);
                return;
            }
            callback(null, newTask);
        })

        console.log("Write to file successfull");

    })
}

function updateTask(id,completed, callback) {
    getTasks((error, tasks) =>{
        if(error){
            callback(error,null);
            return;
        }

        const updatedTask = tasks.find(task => task.id === id);

        if(!updatedTask){
            callback(null, null);
            return;
        }

        updatedTask.completed = completed;

        fs.writeFile(TASKS_FILE, JSON.stringify(tasks), (error) =>{
            if(error){
                callback(error, null);
                return;
            }
            callback(null, updatedTask);
            console.log("successfully updated!");
        })

    })
    
}

function deleteTask(id, callback) {
    getTasks((error, tasks) =>{
        if(error){
            callback(error, null);
            return;
        }
        
        const newTasks = tasks.filter(task => task.id !== id);

        if(newTasks.length === tasks.length){
            callback(null, null);
            return;
        }

        fs.writeFile(TASKS_FILE, JSON.stringify(newTasks), error =>{
            if(error){
                callback(error, null);
                return;
            }
            callback(null, newTasks);
        })
    })
}

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};