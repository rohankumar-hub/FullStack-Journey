import { getTasks, createTask, deleteTask, toggleTask, updateTaskTitle} from "./api.js";
import { createTaskUI, updateTaskStatus, updateTaskTitleStyle, updateToggleButton, createEditTaskUI} from "./ui.js";

const addTaskButton = document.getElementById("addTaskButton");
const taskInput = document.getElementById("taskInput");
const errorMessageBox = document.getElementById("errorMessageBox");

const taskcontainer= document.getElementById("tasks");

const searchInput = document.getElementById("searchInput");

const taskItems =[];

async function loadTasks(){
  try{
    const tasks = await getTasks();

    taskcontainer.replaceChildren();

    taskItems.length = 0;

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

    searchTaskItem(searchInput.value.trim().toLowerCase());
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

      task.completed = updatedTask.completed;
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

      //for search feature
      deleteTaskItemFromTaskItems(task.id);
    }
    catch(error){
      console.error(error);
      errorMessageBox.textContent = "Something went wrong. Please try again";
    }
  });

  taskUI.buttonForEdit.addEventListener("click", () =>{
    const editTaskUI = createEditTaskUI(task.title);

    taskUI.title.replaceWith(editTaskUI.editBox);

    taskUI.buttonForEdit.style.display = "none";

    editTaskUI.buttonForSave.addEventListener("click", async () =>{
      try{
        if(editTaskUI.editTaskInput.value.trim().length === 0){
          editTaskUI.errorMessageBox.textContent = "Title must be a non-empty string";
          return;
        }

        const updatedTask = await updateTaskTitle(task.id, editTaskUI.editTaskInput.value.trim());
        taskUI.title.textContent = updatedTask.title;
        editTaskUI.editBox.replaceWith(taskUI.title);
        taskUI.buttonForEdit.style.display = "";
        task.title = updatedTask.title;
        editTaskUI.errorMessageBox.textContent = "";

        searchTaskItem(searchInput.value.trim().toLowerCase());
      }
      catch(error){
        console.error(error);
        editTaskUI.errorMessageBox.textContent = "Something went wrong. Please try again";
      }
    })

    editTaskUI.buttonForCancel.addEventListener("click", () =>{
      editTaskUI.editBox.replaceWith(taskUI.title);
      taskUI.buttonForEdit.style.display = "";
      editTaskUI.errorMessageBox.textContent = "";
    })

  })

  taskItems.push({task, taskUI});

  taskcontainer.appendChild(taskUI.row);
}

function deleteTaskItemFromTaskItems(taskId){
  const index = taskItems.findIndex(taskItem => taskItem.task.id === taskId);

  if(index === -1){
    console.log("Failed to delete taskItem");
    return;
  }

  taskItems.splice(index, 1);
}

searchInput.addEventListener("input", () =>{
  const searchText = searchInput.value.trim().toLowerCase()
  
  searchTaskItem(searchText);
})

function searchTaskItem(searchText){
  taskItems.forEach(taskItem => {
    if(!taskItem.task.title.toLowerCase().includes(searchText)){
      taskItem.taskUI.row.style.display = "none";
    }
    else{
      taskItem.taskUI.row.style.display = "";
    }
  });
}