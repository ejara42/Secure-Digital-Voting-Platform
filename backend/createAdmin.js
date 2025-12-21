require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import your Voter model
const Voter = require('./models/Voter');

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/voterdb';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Admin data
const adminData = {
    fullName: "App Admin",
    email: "admin@example.com",
    phone: "0910000000",
    nationalId: "ADMIN001",
    gender: "male",
    region: "Addis",
    dob: new Date("1990-01-01"),
    role: "admin"
};

async function createAdmin() {
    try {
        // Check if admin already exists
        const existing = await Voter.findOne({ email: adminData.email });
        if (existing) {
            console.log('Admin user already exists.');
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('Admin123', 10);

        const admin = new Voter({
            ...adminData,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await admin.save();
        console.log('Admin user created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();
