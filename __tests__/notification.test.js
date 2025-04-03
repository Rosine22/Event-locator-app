import {describe, test, beforeAll, beforeEach} from "@jest/globals"
import request from 'supertest';
import app from '../server'; // Import your Express app
import { sequelize, Notification, User, Event } from '../models';

describe('Notification API Tests', () => {
    
    beforeAll(async () => {
        // Sync database and create test data
        await sequelize.sync({ force: true });

        // Create a user and an event
        await User.create({ id: 1, username: 'testuser', email: 'test@example.com', password_hash: 'hashedpassword' });
        await Event.create({ id: 2, title: 'Tech Meetup', location: 'NYC', date: '2025-04-05' });
    });

    afterAll(async () => {
        // Close the database connection
        await sequelize.close();
    });

    // ✅ Test Notification Creation
    test('Should create a notification', async () => {
        const res = await request(app)
            .post('/notifications')
            .send({ user_id: 1, event_id: 2 })
            .expect(201);

        expect(res.body).toHaveProperty('message', 'Notification sent');
        expect(res.body.notification).toHaveProperty('id');
    });

    // ✅ Test Fetching Notifications for a User
    test('Should retrieve notifications for a user', async () => {
        const res = await request(app)
            .get('/notifications/1')
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('event_id', 2);
    });

    // ✅ Test Deleting a Notification
    test('Should delete a notification', async () => {
        const res = await request(app)
            .delete('/notifications/1')
            .expect(200);

        expect(res.body).toHaveProperty('message', 'Notification deleted');
    });
});
