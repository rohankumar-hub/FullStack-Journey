
const button = document.getElementById("changeButton");
const message = document.getElementById("message");
const heading = document.getElementById("heading");
const title = document.getElementById("topLine");

const addTaskButton = document.getElementById("addTaskButton");
const taskInput = document.getElementById("taskInput");

const taskcontainer= document.getElementById("tasks");
  
let clickCount=1;

button.addEventListener("click", () => {
  if(clickCount===1)
  message.textContent="I have changed the DOM!";

  else if(clickCount===2)
  heading.textContent="Heading changed!";

  else if(clickCount===3)
  title.textContent="my webpage name changed"

  else if(clickCount === 4){
    fetch("/tasks")
      .then((response) => {

        if(!response.ok){
          throw new Error("Failed to fetch tasks");
            
        }

        return response.json();
      })

      .then((tasks) =>{

        console.log(tasks);

        tasks.forEach(task => {
          addTaskToPage(task);
        });
      })

      .catch((error) =>{
        console.error(error);
      });
  }  
  clickCount++;
});

addTaskButton.addEventListener("click", () =>{

  const task = {
      title: taskInput.value
  }
  let noTitle= false

  fetch("/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(task)
  })
  .then((response) =>{
    if(!response.ok){
      throw new Error("failed to add task");
    }
    console.log("task successfully added");
    return response.json();
  })
  .then((task) =>{
    addTaskToPage(task);
    taskInput.value="";
    console.log(task);
  })
  .catch(error =>{
    console.log(error);
  })
});

function addTaskToPage(task){
  const row = document.createElement("div");
  row.style.marginTop = '15px';

  const text = document.createElement("span");
  text.textContent = task.title;
  text.style.marginRight = '15px';

  const buttonForView = document.createElement("button");
  buttonForView.textContent = "view";
  buttonForView.style.marginRight = '15px';

  const buttonForDelete = document.createElement("button");
  buttonForDelete.textContent = "Delete";
  buttonForDelete.style.marginLeft= "15px";
            
  const check = document.createElement("span");

  row.appendChild(text);
  row.appendChild(buttonForView);
  row.appendChild(check);
  row.appendChild(buttonForDelete);
            
  taskcontainer.appendChild(row);

  buttonForView.addEventListener("click", () =>{
    let body;
    fetch(`/tasks/${task.id}`)
    .then((response) =>{
      if(!response.ok){
        throw new Error("failed to fetch task info");
      }
      return response.json();
    })
    .then((taskForBody) =>{
      body = {
        completed: !taskForBody.completed
      };
      return fetch(`/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
    })
    .then((resTask) =>{
      if(!resTask.ok){
        throw new Error("failed to update data");
        return;
      }
      return resTask.json();
    })
    .then(taskForUpdate =>{
      console.log("PATCH response:",taskForUpdate);
      console.log("completed:", taskForUpdate.completed);
      check.textContent = String(taskForUpdate.completed);
    })
    .catch((error) =>{
      console.log(error);
    })
  });

  buttonForDelete.addEventListener("click", () =>{
    fetch(`/tasks/${task.id}`,{
      method: "DELETE"
    })
    .then((response) =>{
      if(!response.ok){
        console.log("couldn't delete task");
        return;
      }
      row.remove();
      console.log("successfully deleted");
    });
  });
};




  