const express = require('express');
const app = express();
const usersRouter = require('../routes/users');

// Middleware to parse JSON bodies
app.use(express.json());

// Mount the users router
app.use('/users', usersRouter);

// Example root route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;