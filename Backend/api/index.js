const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Todo = require('../Models/Todo');
require('dotenv').config();

const app = express();

// CORS: allow Netlify frontend
const allowedOrigins = ['https://rk-to-do-mern-project.netlify.app'];
// const allowedOrigins = ['http://localhost:3000'];


app.use(cors({
  origin: function (origin, callback) {
    console.log('Origin:', origin); // Check if origin is correct
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));


app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB error:', err));

// Routes

app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    console.log('Fetched todos:', todos);  // Log the fetched tasks
    res.json(todos);
  } catch (err) {
    console.error('Error fetching tasks:', err);  // Log the error
    res.status(500).json({ error: err.message });
  }
});


app.post('/api/todos', async (req, res) => {
  const todo = new Todo(req.body);
  await todo.save();
  res.status(201).json(todo);
});

app.put('/api/todos/:id', async (req, res) => {
  const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete('/api/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
