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

function updateTaskTitleStyle(title, completed){
  title.style.textDecoration = completed? "line-through" : "none";
}

function updateToggleButton(buttonForToggle, completed){
  buttonForToggle.textContent = completed? "Mark Not Done" : "Mark Done";
}

function updateTaskStatus(taskStatus, completed){
  taskStatus.textContent = completed? "Completed" : "Pending";
}

export { createTaskUI, updateTaskStatus, updateTaskTitleStyle, updateToggleButton};