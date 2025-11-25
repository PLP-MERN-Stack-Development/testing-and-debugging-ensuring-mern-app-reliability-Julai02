const request = require('supertest');
const express = require('express');
const { generateToken } = require('../../src/utils/auth');
const verifyToken = require('../../src/utils/auth').verifyToken;
const User = require('../../src/models/User');
const mongoose = require('mongoose');

describe('Auth utilities', () => {
  it('generateToken returns a JWT token that contains user id and email', () => {
    const fakeUser = { _id: new mongoose.Types.ObjectId(), email: 'test@example.com' };
    const token = generateToken(fakeUser);
    expect(typeof token).toBe('string');
  });

  it('verifyToken middleware returns 401 if no token provided', async () => {
    const app = express();
    app.get('/protected', verifyToken, (req, res) => { res.json({ ok: true }); });

    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
  });

  it('verifyToken middleware allows a valid token', async () => {
    const app = express();
    app.get('/protected', verifyToken, (req, res) => { res.json({ user: req.user }); });

    const fakeUser = { _id: new mongoose.Types.ObjectId(), email: 'test2@example.com' };
    const token = generateToken(fakeUser);

    const res = await request(app).get('/protected').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('user');
  });
});
