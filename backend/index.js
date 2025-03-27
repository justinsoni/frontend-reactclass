const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// CORS Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// MongoDB Connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/todoapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Todo Schema
const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/iteminsert', async (req, res) => {
  try {
    console.log('Fetching all todos...');
    const todos = await Todo.find();
    console.log('Todos found:', todos);
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/iteminsert', async (req, res) => {
  try {
    console.log('Received new todo:', req.body);
    
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ 
        message: 'Invalid request body',
        received: req.body 
      });
    }

    if (!req.body.text || typeof req.body.text !== 'string') {
      return res.status(400).json({ 
        message: 'Text is required and must be a string',
        received: req.body 
      });
    }

    const todo = new Todo({
      text: req.body.text,
      completed: false
    });

    const newTodo = await todo.save();
    console.log('Todo saved:', newTodo);
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(400).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.put('/iteminsert/:id', async (req, res) => {
  try {
    console.log('Updating todo:', req.params.id, req.body);
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    console.log('Todo updated:', todo);
    res.json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(400).json({ message: error.message });
  }
});

app.delete('/iteminsert/:id', async (req, res) => {
  try {
    console.log('Deleting todo:', req.params.id);
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    console.log('Todo deleted:', todo);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: error.message });
  }
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server with error handling
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test the server at http://localhost:${PORT}/test`);
  console.log(`API endpoint available at http://localhost:${PORT}/iteminsert`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy, trying ${PORT + 1}`);
    server.close();
    app.listen(PORT + 1, () => {
      console.log(`Server is running on port ${PORT + 1}`);
    });
  } else {
    console.error('Server error:', err);
  }
}); 