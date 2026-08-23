const http = require("http");
const fs = require("fs")

const tasks = [
    { 
        id:1, 
        title:"Learn HTTP", 
        completed:false
    },
    { 
        id:2, 
        title:"Build a Project", 
        completed:false
    },
    { 
        id:3, 
        title:"Deploy it", 
        completed:false
    }
];

const server = http.createServer((request, response) => {
    console.log(request.url)
    switch(request.url) {
        case "/":
            fs.readFile("index.html", (err, data) => {
                response.end(data);
            });
            break;

        case "/style.css":
            fs.readFile("style.css", (error,data) =>{
                response.end(data);
            });
            break;

        case "/script.js":
            fs.readFile("script.js", (error, data) =>{
                response.end(data);
            });
            break;
        
        case "/about":
            response.end("This is my first backend.");
            break;

        case "/tasks":
            response.setHeader("Content-Type", "application/json")
            response.end(JSON.stringify(tasks));
            break;

        default:
            response.end("404 - Page not found");
    }
});

server.listen(3000, () => {
    console.log("server running on http://localhost:3000")
});