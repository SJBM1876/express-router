const request = require('supertest');
const app = require('./src/app');
const usersRouter = require('./routes/users');

// Ensure the users router is mounted in the app for testing
app.use('/users', usersRouter);

describe('Users Router', () => {
  // Sample in-memory database for testing purposes
  let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
    { id: 3, name: 'Bob Smith', email: 'bob@example.com' }
  ];

  // Reset the users array before each test
  beforeEach(() => {
    users = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
      { id: 3, name: 'Bob Smith', email: 'bob@example.com' }
    ];
  });

  afterEach(async () => {
    // Close any database connections or other external resources here
    // For example:
    // await db.close();
  });

  afterAll(async () => {
    // Close any global resources here
    // For example:
    // await server.close();
  });

  // GET /users - Get all users
  it('should return all users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(users);
  });

  // GET /users/:id - Get a particular user by ID
  it('should return a user by ID', async () => {
    const response = await request(app).get('/users/2');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(users[1]);
  });

  it('should return 404 if user not found', async () => {
    const response = await request(app).get('/users/100');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'User not found' });
  });

  // POST /users - Create a new user
  it('should create a new user', async () => {
    const newUser = { name: 'Alice Johnson', email: 'alice@example.com' };
    const response = await request(app).post('/users').send(newUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', users.length + 1);
    expect(response.body).toHaveProperty('name', newUser.name);
    expect(response.body).toHaveProperty('email', newUser.email);
  });

  // PUT /users/:id - Update a user by ID
  it('should update a user by ID', async () => {
    const updatedUser = { name: 'Jane Updated', email: 'jane.updated@example.com' };
    const response = await request(app).put('/users/2').send(updatedUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 2);
    expect(response.body).toHaveProperty('name', updatedUser.name);
    expect(response.body).toHaveProperty('email', updatedUser.email);
  });

  it('should return 404 if user not found for update', async () => {
    const updatedUser = { name: 'User Not Found', email: 'user.not.found@example.com' };
    const response = await request(app).put('/users/100').send(updatedUser);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'User not found' });
  });

   // Check if the user is actually deleted
   
  

  it('should return 404 if user not found for delete', async () => {
    const response = await request(app).delete('/users/100');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'User not found' });
  });
});
