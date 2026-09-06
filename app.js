const express = require("express");

const taskRoutes = require("./routes/tasks");

const fs = require("fs");

const app = express();

app.use(express.json());

app.use((request, response, next) =>{
    console.log(request.method, request.url);
    next();
});

app.use("/tasks", (request, response, next) =>{
    console.log("Tasks API accessed");
    next();
})

app.use(taskRoutes);

app.use(express.static("public"));

module.exports = app;