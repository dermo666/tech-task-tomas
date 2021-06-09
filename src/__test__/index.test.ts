import { server } from '..';
import request from 'supertest';
import { expect } from 'chai';

describe('express', function () {
  after(() => {
    server.close()
  })

  it('should respond with 200 for /status', async () => {
    const res = await request(server)
      .get('/status')
    expect(res.statusCode).to.equal(200)
  });

  it('should respond with 404 with non-existant routes', function testPath(done) {
    request(server)
      .get('/non-existant-path')
      .expect(404, done);
  });

  describe('basic auth', async() => {
    it('should respond with 200 when called with valid Authorization header value', async () => {
      const res = await request(server)
      .get('/basic-auth')
      .set('Authorization', 'Basic: bWF0dEBnbWFpbC5jb206dGhpcyBpcyBhIHZAbGlkIHBhc3N3b3JkIQ==');
      expect(res.statusCode).to.equal(200);
    });

    it('should respond with 200 when called with a password containing colon in Authorization header value', async () => {
      const res = await request(server)
      .get('/basic-auth')
      .set('Authorization', 'Basic: am9objJAZ29vZ2xlLmNvbTohdFNwNSpNSGh6Zm1ASToyNypCQA=='); // user john2@google.com
      expect(res.statusCode).to.equal(200);
    });

    it('should respond with 401 when called with empty username & password in Authorization header value', async () => {
      const res = await request(server)
      .get('/basic-auth')
      .set('Authorization', 'Basic: Og==');
      expect(res.statusCode).to.equal(401);
    });

    it('should respond with 401 when called with empty password in Authorization header value', async () => {
      const res = await request(server)
      .get('/basic-auth')
      .set('Authorization', 'Basic: bWF0dEBnbWFpbC5jb206');
      expect(res.statusCode).to.equal(401);
    });

    it('should respond with 401 when called with empty username in Authorization header value', async () => {
      const res = await request(server)
      .get('/basic-auth')
      .set('Authorization', 'Basic: OnRoaXMgaXMgYSB2QGxpZCBwYXNzd29yZCE=');
      expect(res.statusCode).to.equal(401);
    });

    it('should respond with 401 when called with mixed username & password in Authorization header value', async () => {
      const res = await request(server)
      .get('/basic-auth')
      .set('Authorization', 'Basic: dGVzdEBnbWFpbC5jb206dGhpcyBpcyBhIHZAbGlkIHBhc3N3b3JkIQ==');
      expect(res.statusCode).to.equal(401);
    });

    it('should respond with 401 when called with invalid base64 in Authorization header value', async () => {
      const res = await request(server)
      .get('/basic-auth')
      .set('Authorization', 'Basic: dummy');
      expect(res.statusCode).to.equal(401);
    });

    it('should respond with 401 when called with email containing colon in Authorization header value', async () => {
      const res = await request(server)
      .get('/basic-auth')
      .set('Authorization', 'Basic: am86aG4yQGdvb2dsZS5jb206IXRTcDUqTUhoemZtQEkyNypCQA==');
      expect(res.statusCode).to.equal(401);
    });
  })
});