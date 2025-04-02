import React, { useState, useEffect } from "react";

const Addtask = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("https://backend-reactclass.onrender.com/api/get");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (newTask.trim() === "") return;

    try {
      const response = await fetch("https://backend-reactclass.onrender.com/api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newTask, completed: false }),
      });

      if (response.ok) {
        setNewTask("");
        fetchTasks();
      } else {
        console.error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setEditText(task.text);
  };

  const handleUpdate = async (id) => {
    if (editText.trim() === "") return;

    console.log("Updating task with ID:", id, "New text:", editText);

    try {
      const response = await fetch(`https://backend-reactclass.onrender.com/api/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: editText }),
      });

      if (response.ok) {
        console.log("Task updated successfully");
        setEditingId(null);
        fetchTasks();
      } else {
        console.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (id) => {
    console.log("Deleting task with ID:", id);

    try {
      const response = await fetch(`https://backend-reactclass.onrender.com/api/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Task deleted successfully");
        fetchTasks();
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleTaskCompletion = async (id, completed) => {
    try {
      const response = await fetch(`https://backend-reactclass.onrender.com/api/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !completed }),
      });

      if (response.ok) {
        fetchTasks();
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
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="task-item">
              {editingId === task._id ? (
                <div>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="edit-input"
                  />
                  <button onClick={() => handleUpdate(task._id)} className="update-button">
                    Update
                  </button>
                  <button onClick={() => setEditingId(null)} className="cancel-button">
                    Cancel
                  </button>
                </div>
              ) : (
                <span
                  className={task.completed ? "completed" : ""}
                  onClick={() => toggleTaskCompletion(task._id, task.completed)}
                >
                  {task.text}
                </span>
              )}
              <button onClick={() => handleEdit(task)} className="edit-button">
                Edit
              </button>
              <button onClick={() => handleDelete(task._id)} className="delete-button">
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Addtask;