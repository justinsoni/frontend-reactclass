import React, { useState, useEffect } from "react";
import "./Addtask.css";

const Addtask = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "https://backend-reactclass.onrender.com/api";

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }
      const data = await response.json();
      setTasks(data);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks. Please try again.");
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (newTask.trim() === "") return;

    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newTask, completed: false }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add task: ${response.statusText}`);
      }

      setNewTask("");
      fetchTasks();
      setError(null);
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Failed to add task. Please try again.");
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setEditText(task.text);
    setError(null);
  };

  const handleUpdate = async (id) => {
    if (editText.trim() === "") return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: editText }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update task: ${response.statusText}`);
      }

      const updatedTask = await response.json();
      console.log("Task updated successfully:", updatedTask);
      
      setEditingId(null);
      fetchTasks();
      setError(null);
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Delete response:", result);
      
      fetchTasks();
      setError(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task. Please try again.");
    }
  };

  const toggleTaskCompletion = async (id, completed) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !completed }),
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle task completion: ${response.statusText}`);
      }

      fetchTasks();
      setError(null);
    } catch (error) {
      console.error("Error toggling task completion:", error);
      setError("Failed to update task status. Please try again.");
    }
  };

  return (
    <div className="task-list">
      {error && <div className="error-message">{error}</div>}
      
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

      <div className="task-list">
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="task-item">
              {editingId === task._id ? (
                <div className="edit-mode">
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
                <>
                  <span
                    className={task.completed ? "completed" : ""}
                    onClick={() => toggleTaskCompletion(task._id, task.completed)}
                  >
                    {task.text}
                  </span>
                  <div className="task-actions">
                    <button onClick={() => handleEdit(task)} className="edit-button">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(task._id)} className="delete-button">
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Addtask;