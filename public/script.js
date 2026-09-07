import { getTasks, createTask, deleteTask, toggleTask } from "./api.js";
import { createTaskUI, updateTaskStatus, updateTaskTitleStyle, updateToggleButton } from "./ui.js";

const addTaskButton = document.getElementById("addTaskButton");
const taskInput = document.getElementById("taskInput");
const errorMessageBox = document.getElementById("errorMessageBox");

const taskcontainer= document.getElementById("tasks");


async function loadTasks(){
  try{
    const tasks = await getTasks();

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


  