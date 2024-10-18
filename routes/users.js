const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', age: 25 },
    { id: 3, name: 'Bob Smith', email: 'bob@example.com', age: 40 }
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
router.post(
  '/',
  [
    check('name')
      .notEmpty().withMessage('Name must not be empty.')
      .isLength({ min: 5, max: 15 }).withMessage('Name must be between 5 and 15 characters.'),
    check('email').isEmail().withMessage('Email is not valid.'),
    check('age').notEmpty().withMessage('Age must not be empty.')
  ],
  (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ error: errors.array() });
      }

      const { name, email, age } = req.body;  // Include age in the new user
      const newUser = { id: users.length + 1, name, email, age: parseInt(age) }; // Store age
      users.push(newUser);
      
      res.status(201).json(newUser);
  }
);

// PUT /users/:id - Update a user by ID
router.put('/:id', 
  [
    check('name').optional().isLength({ min: 5, max: 15 }).withMessage('Name must be between 5 and 15 characters.'),
    check('email').optional().isEmail().withMessage('Email is not valid.'),
    check('age').optional().notEmpty().withMessage('Age must not be empty.')
  ],
  (req, res) => {
      const id = parseInt(req.params.id);
      const user = users.find(user => user.id === id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ error: errors.array() });
      }

      // Update user fields only if they are provided
      const { name, email, age } = req.body;
      if (name) user.name = name;
      if (email) user.email = email;
      if (age) user.age = parseInt(age); // Store age if provided

      res.json(user);
  }
);

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



