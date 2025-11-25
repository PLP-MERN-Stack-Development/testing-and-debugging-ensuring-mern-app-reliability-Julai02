const app = require('./src/app');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-testing';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error', err));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
