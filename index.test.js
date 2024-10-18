const request = require('supertest');
const app = require('./src/app');
const usersRouter = require('./routes/users');

// Ensure the users router is mounted in the app for testing
app.use('/users', usersRouter);

describe('Users Router', () => {
  // Sample in-memory database for testing purposes
  let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', age: 25 },
    { id: 3, name: 'Bob Smith', email: 'bob@example.com', age: 40 }
  ];

  // Reset the users array before each test
  beforeEach(() => {
    users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com', age: 25 },
      { id: 3, name: 'Bob Smith', email: 'bob@example.com', age: 40 }
    ];
  });

  // GET /users - Get all users
  it('should return all users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(users); // Update expected to match the new users structure
  });

  // GET /users/:id - Get a particular user by ID
  it('should return a user by ID', async () => {
    const response = await request(app).get('/users/2');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(users[1]); // Update to include age
  });

  it('should return 404 if user not found', async () => {
    const response = await request(app).get('/users/100');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'User not found' });
  });

  // POST /users - Create a new user
  it('should create a new user', async () => {
    const newUser = { name: 'Alice Johnson', email: 'alice@example.com', age: 28 }; // Include age
    const response = await request(app).post('/users').send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id', users.length + 1);
    expect(response.body).toHaveProperty('name', newUser.name);
    expect(response.body).toHaveProperty('email', newUser.email);
    expect(response.body).toHaveProperty('age', newUser.age); // Check for age
  });

  it('should return validation error for empty name', async () => {
    const newUser = { name: '', email: 'invalid@example.com', age: '' }; // Ensure age is included
    const response = await request(app).post('/users').send(newUser);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ // Use toEqual instead of toBe for object comparison
      error: [
        {
          value: '',
          msg: 'Name must not be empty.',
          param: 'name',
          location: 'body'
        },
        {
          value: '',
          msg: 'Name must be between 5 and 15 characters.',
          param: 'name',
          location: 'body'
        },
        {
          value: '',
          msg: 'Age must not be empty.',
          param: 'age',
          location: 'body'
        }
      ]
    });
  });
  

  // PUT /users/:id - Update a user by ID
  it('should update a user by ID', async () => {
    const updatedUser = { name: 'Jane Updated', email: 'jane.updated@example.com', age: 26 }; // Include age
    const response = await request(app).put('/users/2').send(updatedUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 2);
    expect(response.body).toHaveProperty('name', updatedUser.name);
    expect(response.body).toHaveProperty('email', updatedUser.email);
    expect(response.body).toHaveProperty('age', updatedUser.age); // Check for age
  });

  it('should return 404 if user not found for update', async () => {
    const updatedUser = { name: 'User Not Found', email: 'user.not.found@example.com', age: 30 }; // Include age
    const response = await request(app).put('/users/100').send(updatedUser);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'User not found' });
  });

  // DELETE /users/:id - Delete a user by ID
  it('should delete a user by ID', async () => {
    const response = await request(app).delete('/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User deleted successfully' });

    // Check if the user is actually deleted
    const getResponse = await request(app).get('/users/1');
    expect(getResponse.status).toBe(404);
    expect(getResponse.body).toEqual({ message: 'User not found' });
  });

  it('should return 404 if user not found for delete', async () => {
    const response = await request(app).delete('/users/100');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'User not found' });
  });
});


