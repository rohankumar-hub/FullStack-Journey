const express = require("express");

const fs = require("fs");

const taskService = require("../services/taskService")

const router = express.Router();

router.get("/tasks", (request, response) =>{
    taskService.getTasks((err, tasks) =>{
        if(err)
        {  
            return response.status(500).json({
                success: false,
                message: "server-side error"
            })
        }
        response.json(tasks);
    });
    
});

router.get("/tasks/:id", (request, response) =>{
    const id = Number(request.params.id);

    taskService.getTaskById(id, (err, task) =>{
        if(err){
            return response.status(500).json({
                success: false,
                message: "server-side error"
            });
        }
        
        if(!task){
            return response.status(404).json({
                success: false,
                message: "Resource not found"
            });
        }
        
        response.json(task);
    });
});

router.post("/tasks", (request, response) => {

    if(typeof request.body.title != "string" || request.body.title.trim().length === 0){
        return response.status(400).json({
            success: false,
            message: "Title must be a non empty string"
        });
    }
    

    taskService.createTask(request.body.title, (error, newTask) =>{
        if(error){
            return response.status(500).json({
                success: false,
                message: "Could not create task"
            })
        }
        response.status(201).json(newTask);
    });

        
    
});

router.delete("/tasks/:id", (request, response) =>{
    const id = Number(request.params.id);

    taskService.deleteTask(id, (error, newTasks) =>{
        if(error){
            return response.status(500).json({
                success: false,
                message: "Server-side error"
            });
        }

        if(!newTasks){
            console.log("Deletion failed - No id match!");
            return response.status(404).json({
                success:false,
                message: "Resource not found"
            })
        }
         response.json(newTasks);
    })
})

router.patch("/tasks/:id", (request, response) =>{
    const id = Number(request.params.id);
    const completed = request.body.completed;

    taskService.updateTask(id, completed, (error, updatedTask) =>{
        if(error){
            return response.status(500).json({
                success: false,
                message: "Server-side error"
            });
        }

        if(!updatedTask){
            return response.status(404).json({
                success: false,
                message: "Resource not found"
            })
        }
        return response.json(updatedTask);
    });
});

module.exports = router;