async function getTasks(){
    const response = await fetch("/tasks");

    if(!response.ok){
        throw new Error("failed to fetch tasks");
    }

    const tasks = await response.json();

    return tasks;
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

async function deleteTask(taskId){
  const response = await fetch(`/tasks/${taskId}`,{
    method: "DELETE"
  });

  if(!response.ok){
    throw new Error("failed to delete task");
  }
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

async function updateTaskTitle(taskId, taskTitle){
  const response = await fetch(`/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: taskTitle
    })
  });

  if(!response.ok){
    throw new Error("failed to update title");
  }

  const updatedTask = await response.json();

  return updatedTask;
}

export { getTasks, createTask, deleteTask, toggleTask, updateTaskTitle};