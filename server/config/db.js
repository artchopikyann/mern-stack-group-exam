const mongoose = require('mongoose');

const { MONGODB_URL } = process.env

const start = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log('MongoDB connected');
    } catch (err) {
        console.log('MongoDB connected error ' + err.message);
    }
}
module.exports = start;