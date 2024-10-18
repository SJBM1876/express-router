const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

let fruits = [];

// POST /fruits - Create a new fruit
router.post(
    '/',
    [
        check('name').notEmpty().withMessage('Name must not be empty.').isLength({ min: 5, max: 20 }).withMessage('Name must be between 5 and 20 characters.'),
        check('color').notEmpty().withMessage('Color must not be empty.')
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        const { name, color } = req.body;
        const newFruit = { id: fruits.length + 1, name, color };
        fruits.push(newFruit);
        res.status(201).json(newFruit);
    }
);

// PUT /fruits/:id - Update a fruit by ID
router.put(
    '/:id',
    [
        check('name').optional().isLength({ min: 5, max: 20 }).withMessage('Name must be between 5 and 20 characters.'),
        check('color').optional().notEmpty().withMessage('Color must not be empty.')
    ],
    (req, res) => {
        const id = parseInt(req.params.id);
        const fruit = fruits.find(fruit => fruit.id === id);
        if (!fruit) {
            return res.status(404).json({ message: 'Fruit not found' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        const { name, color } = req.body;
        if (name) fruit.name = name;
        if (color) fruit.color = color;

        res.json(fruit);
    }
);

module.exports = router;
