

const request = require('supertest');
const app = require('./app');

test('User authentication', async () => {
    const response = await request(app).post('/login').send({ username: 'testuser', password: 'password' });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
});
