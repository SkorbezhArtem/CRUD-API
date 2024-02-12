import request from 'supertest';
import server from '../src/server';

describe('API TESTS', () => {
  const mockUser = {
    username: 'RSS_USER',
    age: 22,
    hobbies: ['football', 'swimming'],
  };
  const testServer = request(server);

  describe('With success status', () => {
    it('getUsers: should return object with empty data array by default with status code 200', async () => {
      const { body, statusCode } = await testServer.get('/api/users');

      expect(statusCode).toBe(200);
      expect(body).toStrictEqual([]);
    });

    it('postUser: should create user and return it with status code 201', async () => {
      const { body, statusCode } = await testServer
        .post('/api/users')
        .send(mockUser);

      expect(statusCode).toBe(201);
      expect(body).toMatchObject(mockUser);
    });

    it('getUserById: should return correct user with status code 200', async () => {
      const {
        body: { id },
      } = await testServer.post('/api/users').send(mockUser);
      const { body, statusCode } = await testServer.get(`/api/users/${id}`);

      expect(statusCode).toBe(200);
      expect(body).toMatchObject({ ...mockUser, id });
    });

    it('putUserById: should return updated user with status code 200', async () => {
      const {
        body: { id },
      } = await testServer.post('/api/users').send(mockUser);
      const { body, statusCode } = await testServer
        .put(`/api/users/${id}`)
        .send({ ...mockUser, username: 'Artem' });

      expect(statusCode).toBe(200);
      expect(body).toMatchObject({ ...mockUser, id, username: 'Artem' });
    });

    it('deleteUserById: should return updated user with status code 204', async () => {
      const {
        body: { id },
      } = await testServer.post('/api/users').send(mockUser);
      const { body, statusCode } = await testServer.delete(`/api/users/${id}`);

      expect(statusCode).toBe(204);
      expect(body).toStrictEqual('');
    });
  });

  describe('With bad request status', () => {
    const badRequestMessage = 'Body does not contain required fields';
    const incorrectUuidMessage = 'Incorrect uuid';

    it('getUserById: should return correct error message with status code 400', async () => {
      const { body, statusCode } = await testServer.get('/api/users/123567');

      expect(statusCode).toBe(400);
      expect(body).toBe(incorrectUuidMessage);
    });

    it('postUser: should return correct error message with status code 400', async () => {
      const { body, statusCode } = await testServer.post('/api/users').send({});

      expect(statusCode).toBe(400);
      expect(body).toBe(badRequestMessage);
    });

    it('putUserById: should return correct error message with status code 400', async () => {
      const { body, statusCode } = await testServer.put('/api/users/123567');

      expect(statusCode).toBe(400);
      expect(body).toBe(incorrectUuidMessage);
    });

    it('deleteUserById: should return correct error message with status code 400', async () => {
      const { body, statusCode } = await testServer.delete('/api/users/123567');

      expect(statusCode).toBe(400);
      expect(body).toBe(incorrectUuidMessage);
    });
  });

  describe('With not found status for unknown id', () => {
    const uuid = '65e683d9-d030-48ec-9e78-f1c8ba17a6d5';
    const notFoundMessage = `User with id ${uuid} is not found`;

    it('getUserById: should return correct error message with status code 404', async () => {
      const { body, statusCode } = await testServer.get(`/api/users/${uuid}`);

      expect(statusCode).toBe(404);
      expect(body).toBe(notFoundMessage);
    });

    it('putUserById: should return correct error message with status code 404', async () => {
      const { body, statusCode } = await testServer
        .put(`/api/users/${uuid}`)
        .send(mockUser);

      expect(statusCode).toBe(404);
      expect(body).toBe(notFoundMessage);
    });

    it('deleteUserById: should return correct error message with status code 404', async () => {
      const { body, statusCode } = await testServer.delete(
        `/api/users/${uuid}`
      );

      expect(statusCode).toBe(404);
      expect(body).toBe(notFoundMessage);
    });
  });

  describe('With not found status for unknown url', () => {
    const url = '/some-non/existing/resource';
    const errorMessage = 'Incorrect endpoint';

    it('get method: should return correct error message with status code 404', async () => {
      const { body, statusCode } = await testServer.get(url);

      expect(statusCode).toBe(404);
      expect(body).toBe(errorMessage);
    });

    it('post method: should return correct error message with status code 404', async () => {
      const { body, statusCode } = await testServer.post(url).send(mockUser);

      expect(statusCode).toBe(404);
      expect(body).toBe(errorMessage);
    });

    it('put method: should return correct error message with status code 404', async () => {
      const { body, statusCode } = await testServer
        .put(url)
        .send({ ...mockUser, username: 'Artem' });

      expect(statusCode).toBe(404);
      expect(body).toBe(errorMessage);
    });

    it('delete method: should return correct error message with status code 404', async () => {
      const { body, statusCode } = await testServer.delete(url);

      expect(statusCode).toBe(404);
      expect(body).toBe(errorMessage);
    });

    it('patch method: should return correct error message with status code 404', async () => {
      const { body, statusCode } = await testServer.patch('/api/users');

      expect(statusCode).toBe(404);
      expect(body).toBe(errorMessage);
    });
  });

  describe('With server error', () => {
    it('post method: should return correct error message with status code 500', async () => {
      const { body, statusCode } = await testServer
        .post('/api/users')
        .send('test');

      expect(statusCode).toBe(500);
      expect(body).toBe('Server error');
    });
  });
});
