
const button = document.getElementById("changeButton");
const message = document.getElementById("message");
const heading = document.getElementById("heading");
const title = document.getElementById("topLine");

const addTaskButton = document.getElementById("addTaskButton");
const taskInput = document.getElementById("taskInput");
const errorMessageBox = document.getElementById("errorMessageBox");

const taskcontainer= document.getElementById("tasks");
  
let clickCount=1;

async function loadTasks(){
  try{
    const response = await fetch("/tasks");

    if(!response.ok){
      throw new Error("Failed to fetch tasks");
    }

    const tasks = await response.json();

    taskcontainer.replaceChildren();

    tasks.forEach(task => {
      addTaskToPage(task);
    });
  }
  catch(error){
    console.error(error);
  }
}

loadTasks();

button.addEventListener("click", () => {
  if(clickCount===1){
    message.textContent="I have changed the DOM!";
  }

  else if(clickCount===2){
    heading.textContent="Heading changed!";
  }

  else if(clickCount===3){
    title.textContent="my webpage name changed";
  }

  else if(clickCount === 4) loadTasks();

  clickCount++;
});

addTaskButton.addEventListener("click", async () =>{
  try{
    const title = taskInput.value.trim();
    if(title.length === 0){
      errorMessageBox.textContent = "Invalid title";
      taskInput.value = "";
      return;
    }

    const newTask = await createTask(title);
    

    addTaskToPage(newTask);
    taskInput.value = "";
    errorMessageBox.textContent = "";

  }
  catch(error){
    console.error(error);
    errorMessageBox.textContent = "Something went wrong. Please try again";
  }
});

function addTaskToPage(task){
  const taskUI = createTaskUI(task);

  taskUI.buttonForToggle.addEventListener("click", async () =>{
    try{
      const updatedTask = await toggleTask(task.id);

      updateTaskStatus(taskUI.taskStatus, updatedTask.completed);
      updateTaskTitleStyle(taskUI.title, updatedTask.completed);
      updateToggleButton(taskUI.buttonForToggle, updatedTask.completed);
    }
    catch(error){
      console.log(error);
      errorMessageBox.textContent = "Something went wrong. Please try again";
    }
  });

  taskUI.buttonForDelete.addEventListener("click", async () =>{
    try{
      await deleteTask(task.id);

      taskUI.row.remove();
    }
    catch(error){
      console.error(error);
      errorMessageBox.textContent = "Something went wrong. Please try again";
    }
  });

  taskcontainer.appendChild(taskUI.row);
};

function updateTaskTitleStyle(title, completed){
  title.style.textDecoration = completed? "line-through" : "none";
}

function updateToggleButton(buttonForToggle, completed){
  buttonForToggle.textContent = completed? "Mark Not Done" : "Mark Done";
}

function updateTaskStatus(taskStatus, completed){
  taskStatus.textContent = completed? "Completed" : "Pending";
}

async function toggleTask(taskId){
  const response = await fetch(`/tasks/${taskId}`);

  if(!response.ok){
    throw new Error("Failed to fetch task");
  }
    
  const task = await response.json();

  const body = {
    completed: !task.completed
  };

  const updateResponse = await fetch(`/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  });

  if(!updateResponse.ok){
    throw new Error("failed to update task");
  }

  const updatedTask = await updateResponse.json();

  return updatedTask;
}

async function deleteTask(taskId){
  const response = await fetch(`/tasks/${taskId}`,{
    method: "DELETE"
  });

  if(!response.ok){
    throw new Error("failed to delete task")
  }
}

async function createTask(taskTitle){
  const body = {
    title: taskTitle
  };

  const response = await fetch("/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if(!response.ok){
    throw new Error("failed to create task");
  }

  const newTask = await response.json();

  return newTask;
}

function createTaskUI(task){
  const row = document.createElement("div");
  row.style.marginTop = '15px';

  const title = document.createElement("span");
  title.textContent = task.title;
  updateTaskTitleStyle(title, task.completed);
  title.style.marginRight = '15px';

  const buttonForToggle = document.createElement("button");
  updateToggleButton(buttonForToggle, task.completed);
  buttonForToggle.style.marginRight = '15px';

  const buttonForDelete = document.createElement("button");
  buttonForDelete.textContent = "Delete";
  buttonForDelete.style.marginLeft= "15px";
            
  const taskStatus = document.createElement("span");
  updateTaskStatus(taskStatus, task.completed);
  taskStatus.style.marginRight = "15px";

  row.appendChild(title);
  row.appendChild(taskStatus);
  row.appendChild(buttonForToggle);
  row.appendChild(buttonForDelete);

  return{ row, title, buttonForToggle, buttonForDelete, taskStatus};
}


  