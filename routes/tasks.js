const express = require("express");

const taskService = require("../services/taskService");

const router = express.Router();

router.get("/tasks",async (request, response) =>{
    try{
        const tasks = await taskService.getTasks();

        return response.json(tasks);
    }
    catch(error){
        console.error(error);

        return response.status(500).json({
            success: false,
            message: "Server-side error"
        });
    }
});

router.get("/tasks/:id", async (request, response) =>{
    try{
        const id = Number(request.params.id);

        if(Number.isNaN(id)){
            return response.status(400).json({
                success: false,
                message: "ID must be a number"
            });
        }

        const task = await taskService.getTaskById(id);

        if(!task){
            return response.status(404).json({
                success: false,
                message: "Resource not found"
            });
        }

        return response.json(task);
    }
    catch(error){
        console.error(error);

        return response.status(500).json({
            success: false,
            message: "Server-side error"
        })
    }
});

router.post("/tasks", async (request, response) => {

    if(typeof request.body.title != "string" || request.body.title.trim().length === 0){
        return response.status(400).json({
            success: false,
             message: "Title must be a non empty string"
        });
    }

    try{
        const title = request.body.title.trim();

        const newTask = await taskService.createTask(title);

        return response.status(201).json(newTask);
    }
    catch(error){
        console.error(error);

        return response.status(500).json({
            success: false,
            message: "Server-side error"
        });
    }
});

router.delete("/tasks/:id", async (request, response) =>{
    const id = Number(request.params.id);

    if(Number.isNaN(id)){
        return response.status(400).json({
            success: false,
            message: "ID must be a number"
        });
    }

    try{
        const deletedTask = await taskService.deleteTask(id);

        if(!deletedTask){
            return response.status(404).json({
                success: false,
                message: "Resource not found"
            });
        }

        return response.status(204).send();
    }
    catch(error){
        console.error(error);

        return response.status(500).json({
            success: false,
            message: "Server-side error"
        });
    }
})

router.patch("/tasks/:id", async (request, response) =>{
    const id = Number(request.params.id);
    const completed = request.body.completed;

    if(Number.isNaN(id)){
        return response.status(400).json({
            success: false,
            message: "ID must be a number"
        });
    }

    if(typeof completed !== "boolean"){
        return response.status(400).json({
            success: false,
            message: "Completed must be boolean"
        })
    }

    try{
        const updatedTask = await taskService.updateTask(id, completed);
        if(!updatedTask){
            return response.status(404).json({
                success: false,
                message: "Resource not found"
            });
        }

        return response.json(updatedTask);
    }
    catch(error){
        console.error(error);
        
        return response.status(500).json({
            success: false,
            message: "Server-side error"
        });
    }
});

module.exports = router;