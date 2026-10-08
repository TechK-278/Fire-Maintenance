const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function initDatabase() {
    try {
        const rootConnection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
        });

        await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'fire_maintenance'}\`;`);
        await rootConnection.end();

        const db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'fire_maintenance',
            port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
        });

        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('Admin', 'Organization', 'Technician') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS organizations (
                organization_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                organization_name VARCHAR(150) NOT NULL,
                contact_person VARCHAR(100) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                address TEXT NOT NULL,
                latitude DECIMAL(10, 8) NOT NULL,
                longitude DECIMAL(11, 8) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS technicians (
                technician_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                name VARCHAR(100) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                address TEXT NOT NULL,
                latitude DECIMAL(10, 8) NOT NULL,
                longitude DECIMAL(11, 8) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS equipment (
                equipment_id INT AUTO_INCREMENT PRIMARY KEY,
                organization_id INT NOT NULL,
                equipment_type VARCHAR(100) NOT NULL,
                model VARCHAR(100) NOT NULL,
                issue_date DATE NOT NULL,
                expiry_date DATE NOT NULL,
                location VARCHAR(150) NOT NULL,
                status ENUM('Valid', 'Expiring Soon', 'Expired') DEFAULT 'Valid',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (organization_id) REFERENCES organizations(organization_id) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS complaints (
                complaint_id INT AUTO_INCREMENT PRIMARY KEY,
                organization_id INT NOT NULL,
                equipment_id INT NOT NULL,
                description TEXT NOT NULL,
                complaint_date DATE NOT NULL,
                status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
                created_by ENUM('Organization', 'Admin') DEFAULT 'Organization',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (organization_id) REFERENCES organizations(organization_id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                task_id INT AUTO_INCREMENT PRIMARY KEY,
                complaint_id INT NOT NULL,
                technician_id INT NOT NULL,
                distance DECIMAL(8, 2) NOT NULL,
                task_date DATE NOT NULL,
                status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (technician_id) REFERENCES technicians(technician_id) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS maintenance_records (
                record_id INT AUTO_INCREMENT PRIMARY KEY,
                equipment_id INT NOT NULL,
                complaint_id INT NOT NULL,
                technician_id INT NOT NULL,
                maintenance_date DATE NOT NULL,
                description TEXT NOT NULL,
                status ENUM('Completed') DEFAULT 'Completed',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (technician_id) REFERENCES technicians(technician_id) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);

        const [adminRows] = await db.query('SELECT user_id FROM users WHERE email = ?', ['admin@firesafety.com']);
        if (adminRows.length === 0) {
            const adminPass = await bcrypt.hash('admin123', 10);
            await db.query(
                'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
                ['admin@firesafety.com', adminPass, 'Admin']
            );
            console.log('Default admin seeded: admin@firesafety.com / admin123');
        }

        await db.end();
        console.log('Database initialized successfully.');
        return true;
    } catch (error) {
        console.error('Database initialization error:', error.message);
        return false;
    }
}

module.exports = initDatabase;

if (require.main === module) {
    initDatabase().then(() => process.exit(0));
}
