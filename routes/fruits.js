const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

let fruits = [];

// GET /fruits - Get all fruits
router.get('/', (req, res) => {
    res.json(fruits);
});

// POST /fruits - Create a new fruit
router.post(
    '/',
    // Validation: Check that color is not empty or just whitespace
    check('color').notEmpty().withMessage('Color must not be empty.'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        const { name, color } = req.body; // Assuming name and color are provided
        const newFruit = { id: fruits.length + 1, name, color };
        fruits.push(newFruit);
        res.json(fruits); // Respond with the list of fruits including the new fruit
    }
);

module.exports = router;
