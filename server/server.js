const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const technicianRoutes = require('./routes/technicianRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const taskRoutes = require('./routes/taskRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const initDatabase = require('./config/initDb');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { sendEmail } = require('./utils/email');

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/test-email', async (req, res) => {
    const to = req.query.to || process.env.EMAIL_USER;
    const result = await sendEmail({
        to,
        subject: 'Fire Maintenance Nodemailer Test',
        text: 'Nodemailer configuration is working successfully!',
        html: '<h3>Success</h3><p>Nodemailer configuration is working successfully!</p>'
    });
    return res.json(result);
});

app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'API route not found.' });
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error.' });
});

initDatabase().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to init DB on startup:', err.message);
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT} (Database pending configuration)`);
    });
});
