const express = require('express');
const router = express.Router();
const User = require('../models/User');

let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
    { id: 3, name: 'Bob Smith', email: 'bob@example.com' }
  ];

// GET /users - Get all users
router.get('/', (req, res) => {
  res.json(users);
});

// GET /users/:id - Get a particular user by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(user => user.id === id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
  } else {
    res.json(user);
  }
});

// POST /users - Create a new user
router.post('/', (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.json(newUser);
});

// PUT /users/:id - Update a user by ID
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(user => user.id === id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
  } else {
    const { name, email } = req.body;
    user.name = name;
    user.email = email;
    res.json(user);
  }
});

// DELETE /users/:id - Delete a user by ID
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(user => user.id === id);
  if (index === -1) {
    res.status(404).json({ message: 'User not found' });
  } else {
    users.splice(index, 1);
    res.json({ message: 'User deleted successfully' });
  }
});

module.exports = router;