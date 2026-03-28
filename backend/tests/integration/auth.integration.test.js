const request = require('supertest');
const { createApp } = require('../../app');
const mongoose = require('mongoose');
const Voter = require('../../models/Voter');
const bcrypt = require('bcryptjs');

describe('Auth Integration Flow', () => {
    let app;

    beforeAll(() => {
        app = createApp();
    });

    const testUser = {
        fullName: 'Test Voter',
        email: 'test@voter.com',
        phone: '0712345678',
        nationalId: '12345678',
        gender: 'male',
        region: 'Test Region',
        dob: '1990-01-01',
        password: 'oldpassword123'
    };

    test('Full lifecycle: register, login, forgot password, reset password, login new', async () => {
        // 1. REGISTER
        const regRes = await request(app)
            .post('/api/auth/register')
            .send(testUser)
            .expect(201);
        
        expect(regRes.body.message).toMatch(/successful/i);

        // 2. LOGIN (old password)
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ identifier: testUser.email, password: testUser.password })
            .expect(200);
        
        expect(loginRes.body.token).toBeDefined();

        // 3. FORGOT PASSWORD
        const forgotRes = await request(app)
            .post('/api/auth/forgot-password')
            .send({ identifier: testUser.email })
            .expect(200);
        
        expect(forgotRes.body.message).toMatch(/email was sent/i);

        // 4. GET TOKEN FROM DB (simulate receiving email)
        const voter = await Voter.findOne({ email: testUser.email });
        expect(voter.resetPasswordToken).toBeDefined();
        expect(voter.resetPasswordExpires.getTime()).toBeGreaterThan(Date.now());

        const resetToken = voter.resetPasswordToken;
        const newPassword = 'newpassword456';

        // 5. RESET PASSWORD
        const resetRes = await request(app)
            .post('/api/auth/reset-password')
            .send({
                userId: voter._id,
                token: resetToken,
                newPassword: newPassword
            })
            .expect(200);

        expect(resetRes.body.message).toMatch(/successful/i);

        // 6. VERIFY RESET (old password should fail)
        await request(app)
            .post('/api/auth/login')
            .send({ identifier: testUser.email, password: testUser.password })
            .expect(401);

        // 7. VERIFY RESET (new password should work)
        const loginNewRes = await request(app)
            .post('/api/auth/login')
            .send({ identifier: testUser.email, password: newPassword })
            .expect(200);
        
        expect(loginNewRes.body.token).toBeDefined();
    });

    test('Security: request reset for non-existent user should not reveal existence', async () => {
        const res = await request(app)
            .post('/api/auth/forgot-password')
            .send({ identifier: 'nonexistent@test.com' })
            .expect(200);
        
        expect(res.body.message).toMatch(/email was sent/i);
    });

    test('Security: reset with expired/invalid token should fail', async () => {
        const res = await request(app)
            .post('/api/auth/reset-password')
            .send({
                userId: new mongoose.Types.ObjectId(),
                token: 'invalid_token',
                newPassword: 'short'
            })
            .expect(400);

        expect(res.body.message).toMatch(/invalid or expired/i);
    });
});
