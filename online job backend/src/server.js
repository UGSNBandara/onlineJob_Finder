const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const companyRoutes = require('./routes/companyRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const messageRoutes = require('./routes/messageRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

sequelize.authenticate()
  .then(() => {
    console.log('Connected to MariaDB');

    return sequelize.sync({ alter: false, force: false });
  })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((err) => console.error('MariaDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../public')));
app.use('/profileImages', express.static(path.join(__dirname, '../public/profileImages')));
app.use('/default_profile.jpg', express.static(path.join(__dirname, '../../frontend/public/default_profile.jpg')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Online Job Portal API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 