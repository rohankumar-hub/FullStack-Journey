const express = require("express");

const fs = require("fs");

const router = express.Router();

router.get("/tasks", (request, response) =>{
    fs.readFile("data/tasks.json", (err, data) =>{
        if(err)
        {  
            return response.status(500).json({
                success: false,
                message: "server-side error"
            })
        }

        const tasks = JSON.parse(data);
        response.json(tasks);
    });
    
});

router.get("/tasks/:id", (request, response) =>{
    fs.readFile("data/tasks.json", (err, data) =>{
        if(err){
            return response.status(500).json({
                success: false,
                message: "server-side error"
            });
        }

        const tasks = JSON.parse(data);
        const id = Number(request.params.id);

        const task = tasks.find((task) => task.id === id);
        
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
    console.log(request.body);

    if(request.body.title=== "" ||typeof request.body.title != "string" || request.body.title.trim().length === 0){
        return response.status(400).json({
            success: false,
            message: "Title must be a non empty string"
        });
    }
    

    fs.readFile("data/tasks.json", (error, data) =>{
        if(error){
            return response.status(404).json({
                success: false,
                message: "Resource not found"
            })
        }

        const tasks = JSON.parse(data);
        let highestId=0;
        
        tasks.forEach(task =>{
            if(task.id > highestId){
                highestId = task.id;
            }
        })

        const newTask ={
          id: highestId+1,
          title: request.body.title,
          completed: false
        };

        tasks.push(newTask);

        fs.writeFile("data/tasks.json", JSON.stringify(tasks), (error) =>{
            if(error){
                return response.status(500).json({
                    success: false,
                    message: "Could not save task"
                });
            }
            response.status(201).json(newTask);
            console.log("Write to file successfull");
        });

        console.log(newTask);
        
    });
    
});

router.delete("/tasks/:id", (request, response) =>{
    const id = Number(request.params.id);

    fs.readFile("data/tasks.json", (error, data) =>{
        if(error){
            return response.status(404).json({
                success: false,
                message: "Resource not found"
            });
        }

        const tasks = JSON.parse(data);

        const newTasks = tasks.filter(task => task.id !== id);

        if(tasks.length === newTasks.length){
            console.log("Deletion failed - No id match!");
            return response.status(404).json({
                success:false,
                message: "Resource not found"
            })
        }

        fs.writeFile("data/tasks.json", JSON.stringify(newTasks), (error) =>{
            if(error){
                return response.status(500).json({
                    success: false,
                    message: "Could not save tasks"
                });
            }
            response.json(newTasks);
            console.log("successfully deleted");
        })
        console.log(newTasks);
    })
})

router.patch("/tasks/:id", (request, response) =>{
    const id = Number(request.params.id);

    fs.readFile("data/tasks.json", (error, data) =>{
        if(error){
            return response.status(404).json({
                success: false,
                message: "Resource not found"
            });
        }

        const tasks = JSON.parse(data);

        let taskNotFound = true;
        let updatedTask;

        tasks.forEach(task => {
            if(task.id === id){
                task.completed = request.body.completed;
                taskNotFound = false;
                updatedTask = task;
                return;
            }
        });

        if(taskNotFound){
            return response.status(404).json({
                success: false,
                message: "Resource not found"
            })
        }

        fs.writeFile("data/tasks.json", JSON.stringify(tasks), (error) =>{
            if(error){
                return response.status(500).json({
                    success: false,
                    message: "server side error"
                });
            }

            console.log("successfully updated!");
            console.log("sending:", updatedTask);
            return response.json(updatedTask);
        });
    });
});

module.exports = router;