const mongoose = require('mongoose');
let mongoServer;

const connectDB = async () => {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    try {
        let uri = process.env.MONGODB_URI;

        if (!uri) {
            uri = 'mongodb://127.0.0.1:27017/taskflow';
        }

        try {
            const conn = await mongoose.connect(uri, options);
            console.log(`MongoDB connected: ${conn.connection.host}`);
            return;
        } catch (connectError) {
            if (!process.env.MONGODB_URI) {
                console.warn('Local MongoDB not available, starting in-memory fallback...');
                const { MongoMemoryServer } = require('mongodb-memory-server');
                mongoServer = await MongoMemoryServer.create();
                const memoryUri = mongoServer.getUri();
                const conn = await mongoose.connect(memoryUri, options);
                console.log(`MongoDB MemoryServer connected: ${conn.connection.host}`);
                return;
            }
            throw connectError;
        }
    } catch (error) {
        console.error(`Database connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
