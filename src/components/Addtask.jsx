import React, { useState, useEffect } from 'react';
import './addtask.css';

const API_URL = 'http://localhost:3000';

const AddTask = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/iteminsert`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTask.trim() !== '') {
      try {
        const response = await fetch(`${API_URL}/iteminsert`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: newTask }),
        });
        const data = await response.json();
        setTasks([...tasks, data]);
        setNewTask('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setEditText(task.text);
  };

  const handleSave = async (id) => {
    if (editText.trim() !== '') {
      try {
        const response = await fetch(`${API_URL}/iteminsert/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: editText }),
        });
        const data = await response.json();
        setTasks(tasks.map(task =>
          task._id === id ? data : task
        ));
        setEditingId(null);
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/iteminsert/${id}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggle = async (id) => {
    try {
      const task = tasks.find(t => t._id === id);
      const response = await fetch(`${API_URL}/iteminsert/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !task.completed }),
      });
      const data = await response.json();
      setTasks(tasks.map(task =>
        task._id === id ? data : task
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  return (
    <div className="add-task-container">
      <h2>Add New Task</h2>
      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task..."
          className="task-input"
        />
        <button type="submit" className="add-button">Add Task</button>
      </form>

      <div className="task-list">
        {tasks.map(task => (
          <div key={task._id} className="task-item">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggle(task._id)}
              className="task-checkbox"
            />
            {editingId === task._id ? (
              <div className="edit-mode">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="edit-input"
                />
                <button
                  onClick={() => handleSave(task._id)}
                  className="save-button"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <span className={task.completed ? 'completed' : ''}>
                {task.text}
              </span>
            )}
            <div className="task-actions">
              <button
                onClick={() => handleEdit(task)}
                className="edit-button"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddTask;
