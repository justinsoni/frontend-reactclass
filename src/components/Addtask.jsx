import React, { useState, useEffect } from "react";

const Addtask = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");  // State for new task input
  const [loading, setLoading] = useState(true);  // Loading state

  // Fetch tasks when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("https://backend-reactclass.onrender.com/api/get");
      const data = await response.json();
      
      console.log('Fetched tasks:', data); // Add this log
      
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error("Fetched data is not an array");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);  // Set loading to false when the fetch is done
    }
  };
  

  const handleAddTask = async () => {
    if (newTask.trim() === "") return; // Prevent adding empty tasks

    try {
      const response = await fetch("https://backend-reactclass.onrender.com/api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newTask, completed: false }), // Adjust if you need different fields
      });

      if (response.ok) {
        setNewTask(""); // Reset input field after successful add
        fetchTasks(); // Refetch tasks to update the list
      } else {
        console.error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      const response = await fetch(`https://backend-reactclass.onrender.com/api/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !currentStatus }),
      });

      if (response.ok) {
        fetchTasks(); // Refetch tasks to update the list
      } else {
        console.error("Failed to toggle task completion");
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  return (
    <div className="task-list">
      {/* Add Task Form */}
      <div className="add-task">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
          className="task-input"
        />
        <button onClick={handleAddTask} className="add-button">
          Add Task
        </button>
      </div>

      {/* Render Tasks */}
      <div className="task-list">
  {loading ? (
    <p>Loading tasks...</p> // Loading message
  ) : tasks.length === 0 ? (
    <p>No tasks available</p> // Message if no tasks are available
  ) : (
    tasks.map((task) => {
      console.log('Rendering task:', task); // Add this log
      return (
        <div key={task._id} className="task-item">
          <span
            className={task.completed ? "completed" : ""}
            onClick={() => toggleTaskCompletion(task._id, task.completed)}
          >
            {task.text}
          </span>
        </div>
      );
    })
  )}
</div>

    </div>
  );
};

export default Addtask;
