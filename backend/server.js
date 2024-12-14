const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./config');
const { User, Doctor, Consultation } = require('./models'); 
const authRoutes = require('./routes/authRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const doctorAvailabilityRoutes = require('./routes/doctorAvailabilityRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const messageRoutes=require('./routes/messageRoutes');
const path = require('path');

dotenv.config();

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Middleware
app.use(cors());
app.use(express.json()); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api', doctorAvailabilityRoutes);
app.use('/api/messages',messageRoutes);

const PORT = process.env.PORT;

sequelize.sync({alter:true})
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
