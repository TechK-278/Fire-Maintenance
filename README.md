# 🔥 Fire Equipment Maintenance Management System

A full-stack web application for managing fire safety equipment, complaints, technician tasks, and maintenance records.

The system connects **Organizations, Technicians, and Administrators** in one platform. Organizations can register their fire equipment and raise complaints. The system automatically finds the **nearest technician** using location coordinates and creates a maintenance task for that technician.

---

## 📌 Project Overview

Fire safety equipment such as fire extinguishers, fire alarms, smoke detectors, sprinklers, fire hydrants, and fire hoses require regular inspection and maintenance.

Managing this work manually can make it difficult to:

- Track equipment and expiry dates
- Register maintenance complaints
- Find nearby technicians
- Assign technicians to complaints
- Track task progress
- Maintain maintenance history
- Notify organizations and technicians

This project provides a centralized system to manage the complete process.

### Main Workflow

```text
Organization
     ↓
Registers Equipment
     ↓
Raises Complaint
     ↓
System Finds Nearest Technician
     ↓
Task Created
     ↓
Technician Receives Task
     ↓
Technician Updates Status
     ↓
Task Completed
     ↓
Maintenance Record Created
     ↓
Organization Can View Maintenance History
```

---

# 🎯 Objectives

The main objectives of the project are:

1. Manage fire safety equipment digitally.
2. Allow organizations to register their equipment.
3. Store equipment issue and expiry dates.
4. Allow organizations to raise maintenance complaints.
5. Allow administrators to raise complaints on behalf of organizations.
6. Store organization and technician locations.
7. Find the nearest technician using latitude and longitude.
8. Automatically create a task for the nearest technician.
9. Allow technicians to update task status.
10. Maintain a history of completed maintenance work.
11. Send email notifications to organizations and technicians.
12. Provide separate dashboards for Admin, Organization, and Technician.
13. Make the application responsive for laptops and Android phones.

---

# 👥 User Roles

The system contains three main user roles.

## 1. Admin

The administrator manages the complete system.

### Admin can:

- Login to the system
- View organizations
- View technicians
- View equipment
- View complaints
- Raise complaints on behalf of organizations
- View assigned tasks
- Monitor task status
- View maintenance records
- Monitor expired equipment
- Monitor expiring equipment

---

## 2. Organization

An organization represents a company, building, institution, or other location where fire equipment is installed.

### Organization can:

- Register an account
- Login
- Store organization details
- Store organization location
- Register fire equipment
- View equipment
- View equipment expiry dates
- Raise complaints
- View complaint status
- View assigned technician
- View maintenance history

---

## 3. Technician

A technician is responsible for performing maintenance work.

### Technician can:

- Register an account
- Login
- Store technician location
- View assigned tasks
- View organization information
- View complaint information
- View equipment information
- View distance from the organization
- Update task status
- Complete maintenance work
- Add maintenance details

---

# 🏠 Main Pages

## Home Page

The home page provides information about the system.

It contains:

- Project title
- Login button
- Organization Registration
- Technician Registration
- About section
- Services section
- Contact section

---

# 🔐 Login Page

Users can login using:

- Email
- Password
- Login As

Available roles:

```text
Organization
Technician
Admin
```

After successful login, the user is redirected to the appropriate dashboard.

```text
Organization → Organization Dashboard

Technician → Technician Dashboard

Admin → Admin Dashboard
```

---

# 📝 Organization Registration

The organization registration form contains:

```text
Organization Name
Contact Person
Email
Phone
Password
Address
Latitude
Longitude
```

The system uses the browser **Geolocation API** to obtain the organization's location.

Example:

```javascript
navigator.geolocation.getCurrentPosition()
```

The latitude and longitude are stored in the database.

---

# 👨‍🔧 Technician Registration

Technician registration contains:

```text
Name
Email
Phone
Password
Address
Latitude
Longitude
```

The technician can click:

```text
Get My Location
```

The browser obtains the current location and stores:

```text
Latitude
Longitude
```

in the database.

---

# 📍 Location-Based Technician Assignment

One of the main features of this project is automatic technician selection based on location.

The system stores the location of:

- Organization
- Technician

as:

```text
Latitude
Longitude
```

When an organization raises a complaint, the backend calculates the distance between the organization and available technicians.

The nearest technician is selected.

### Example

```text
Organization
      |
      |---- Technician A → 2.4 km
      |
      |---- Technician B → 5.8 km
      |
      |---- Technician C → 9.7 km
```

Technician A is nearest, so the system creates a task for Technician A.

---

# 📐 Distance Calculation

The system uses the **Haversine Formula** to calculate the distance between two geographical coordinates.

The formula is used because latitude and longitude represent positions on the Earth's surface.

Conceptually:

```text
Organization Location
        +
Technician Locations
        ↓
Distance Calculation
        ↓
Find Minimum Distance
        ↓
Nearest Technician
```

The calculated distance is stored in the `tasks` table.

---

# 🧯 Fire Equipment Management

Organizations can register fire safety equipment.

Examples:

- Fire Extinguisher
- Fire Alarm
- Fire Hydrant
- Smoke Detector
- Sprinkler
- Fire Hose

Equipment information includes:

```text
Equipment ID
Equipment Type
Model
Issue Date
Expiry Date
Location
Status
```

---

# 📅 Equipment Expiry Management

The system checks equipment expiry dates.

Equipment can have statuses such as:

```text
Valid
Expiring Soon
Expired
```

Example:

```text
Fire Extinguisher
Issue Date: 10-01-2025
Expiry Date: 10-01-2027
Status: Valid
```

The organization can be notified when equipment is approaching its expiry date.

---

# 🚨 Complaint Management

An organization can raise a complaint for a particular fire equipment.

A complaint contains:

```text
Complaint ID
Organization
Equipment
Description
Complaint Date
Status
Created By
```

The complaint status initially becomes:

```text
Pending
```

There is **no priority field** in the complaint system.

The admin can also create a complaint on behalf of an organization.

---

# 🔄 Complaint → Task → Maintenance Record

The system follows three separate concepts.

### Complaint

Describes **what is wrong**.

Example:

```text
Fire extinguisher pressure is low.
```

### Task

Represents **the work given to a technician**.

Example:

```text
Task 101
Technician: Rahul
Distance: 2.4 km
Status: Pending
```

### Maintenance Record

Stores **what the technician actually did**.

Example:

```text
Pressure checked
Cylinder inspected
Maintenance completed
```

Therefore:

```text
Complaint
    ↓
Task
    ↓
Maintenance Record
```

---

# 📋 Task Management

After a complaint is registered:

1. System identifies the organization.
2. System obtains the organization's latitude and longitude.
3. System gets technician locations.
4. Distance is calculated.
5. Nearest technician is selected.
6. A task is created.
7. Technician receives the task.
8. Organization receives technician information.

### Task fields

```text
Task ID
Complaint ID
Technician ID
Distance
Task Date
Status
```

Task status:

```text
Pending
   ↓
In Progress
   ↓
Completed
```

---

# 👨‍🔧 Technician Dashboard

The technician dashboard displays assigned tasks.

Example:

| Task ID | Organization | Equipment | Distance | Date | Status |
|---|---|---|---|---|---|
| 101 | ABC Company | Fire Extinguisher | 2.4 km | 01-10-2026 | Pending |
| 102 | XYZ School | Smoke Detector | 4.1 km | 02-10-2026 | In Progress |

The technician can update the status.

```text
Pending
   ↓
In Progress
   ↓
Completed
```

After completing the task, the technician can add maintenance details.

---

# 🏢 Organization Dashboard

The organization dashboard contains:

### Equipment

```text
View Equipment
Add Equipment
View Expiry
```

### Complaints

```text
Raise Complaint
View Complaints
View Complaint Status
```

### Technician

```text
View Assigned Technician
View Distance
```

### Maintenance

```text
View Maintenance History
```

---

# 🛠️ Admin Dashboard

The admin dashboard provides an overall view of the system.

### Dashboard Cards

```text
Total Organizations
Total Technicians
Pending Complaints
In Progress Tasks
Completed Tasks
Expired Equipment
Active Tasks
```

### Admin Functions

```text
Manage Organizations
Manage Technicians
Manage Equipment
View Complaints
Raise Complaint
View Tasks
View Maintenance Records
View Expired Equipment
```

---

# 🧾 Maintenance Records

After the technician completes a task, a maintenance record is stored.

The record contains:

```text
Record ID
Equipment ID
Complaint ID
Technician ID
Maintenance Date
Description
Status
```

Example:

```text
Equipment: Fire Extinguisher

Maintenance:
Pressure checked
Cylinder inspected
Safety seal checked

Status:
Completed
```

This creates a historical record of maintenance work.

---

# 📧 Email Notifications

The application uses **Nodemailer** for email notifications.

Emails can be sent when:

### Complaint Registered

The organization receives complaint information.

### Technician Assigned

The organization receives information about the assigned technician.

### New Task

The technician receives information about the new task.

### Equipment Expiry

The organization can receive a notification when equipment is approaching expiry.

---

# 🗄️ Database Design

The project uses **MySQL**.

There are seven main tables.

```text
users
organizations
technicians
equipment
complaints
tasks
maintenance_records
```

---

## 1. Users Table

Stores login information.

| Column | Description |
|---|---|
| user_id | Unique user ID |
| email | User email |
| password | Encrypted password |
| role | Admin / Organization / Technician |

---

## 2. Organizations Table

Stores organization information.

| Column | Description |
|---|---|
| organization_id | Organization ID |
| user_id | Related user |
| organization_name | Organization name |
| contact_person | Contact person |
| phone | Phone number |
| address | Organization address |
| latitude | Organization latitude |
| longitude | Organization longitude |

---

## 3. Technicians Table

Stores technician information.

| Column | Description |
|---|---|
| technician_id | Technician ID |
| user_id | Related user |
| name | Technician name |
| phone | Phone number |
| address | Technician address |
| latitude | Technician latitude |
| longitude | Technician longitude |

---

## 4. Equipment Table

Stores fire equipment.

| Column | Description |
|---|---|
| equipment_id | Equipment ID |
| organization_id | Equipment owner |
| equipment_type | Type of equipment |
| model | Equipment model |
| issue_date | Issue date |
| expiry_date | Expiry date |
| location | Equipment location |
| status | Equipment status |

---

## 5. Complaints Table

Stores complaints.

| Column | Description |
|---|---|
| complaint_id | Complaint ID |
| organization_id | Related organization |
| equipment_id | Related equipment |
| description | Complaint description |
| complaint_date | Date of complaint |
| status | Complaint status |
| created_by | Organization/Admin |

---

## 6. Tasks Table

Stores technician tasks.

| Column | Description |
|---|---|
| task_id | Task ID |
| complaint_id | Related complaint |
| technician_id | Assigned technician |
| distance | Distance from organization |
| task_date | Task date |
| status | Task status |

---

## 7. Maintenance Records Table

Stores completed maintenance information.

| Column | Description |
|---|---|
| record_id | Maintenance record ID |
| equipment_id | Related equipment |
| complaint_id | Related complaint |
| technician_id | Technician |
| maintenance_date | Maintenance date |
| description | Work performed |
| status | Maintenance status |

---

# 🔗 Database Relationship

The main relationships are:

```text
                    users
                   /     \
                  /       \
        organizations    technicians
              |
              |
          equipment
              |
              ↓
         complaints
              |
              ↓
            tasks
              |
              ↓
    maintenance_records
```

More specifically:

```text
users
 ├── organizations
 └── technicians

organizations
 ├── equipment
 └── complaints

equipment
 └── complaints

complaints
 └── tasks

tasks
 └── technicians

complaints
 └── maintenance_records

equipment
 └── maintenance_records

technicians
 └── maintenance_records
```

---

# 💻 Technology Stack

## Frontend

- React.js
- HTML5
- CSS3
- Tailwind css
- Bootstrap 5
- JavaScript
- React Router
- Axios

## Backend

- Node.js
- Express.js

## Database

- MySQL

## APIs / Services

- Browser Geolocation API
- Nodemailer
- Gmail/Google SMTP

## Security

- bcrypt
- JSON Web Token (JWT)

---

# 🏗️ System Architecture

```text
                 ┌──────────────────────┐
                 │      React.js        │
                 │ Bootstrap + CSS + JS  │
                 └──────────┬───────────┘
                            │
                         REST API
                            │
                 ┌──────────▼───────────┐
                 │    Node.js +         │
                 │      Express.js      │
                 └──────┬─────┬─────────┘
                        │     │
             ┌──────────┘     └──────────────┐
             │                               │
       ┌─────▼─────┐                  ┌──────▼──────┐
       │   MySQL   │                  │  Nodemailer │
       │ Database  │                  │    Email    │
       └───────────┘                  └─────────────┘
             │
       ┌─────▼──────────┐
       │ Location Data  │
       │ Latitude/Long. │
       └────────────────┘
```

---

# 📁 Project Structure

```text
fire-maintenance/
│
├── client/
│   ├── public/
│   │
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── services/
│       ├── context/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── organizationController.js
│   │   ├── technicianController.js
│   │   ├── equipmentController.js
│   │   ├── complaintController.js
│   │   ├── taskController.js
│   │   └── maintenanceController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── organizationRoutes.js
│   │   ├── technicianRoutes.js
│   │   ├── equipmentRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── taskRoutes.js
│   │   └── maintenanceRoutes.js
│   │
│   ├── utils/
│   │   ├── distance.js
│   │   └── email.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── database/
│   └── fire_maintenance.sql
│
└── README.md
```

---

# ⚙️ Installation

## 1. Clone or Create the Project

```bash
mkdir fire-maintenance
cd fire-maintenance
```

---

# 2. Create React Frontend

```bash
npm create vite@latest client
```

Select:

```text
React
JavaScript
```

Then:

```bash
cd client
npm install
```

Install required packages:

```bash
npm install react-router-dom axios bootstrap
```

---

# 3. Create Node.js Backend

From the project root:

```bash
mkdir server
cd server
npm init -y
```

Install backend packages:

```bash
npm install express mysql2 cors dotenv bcrypt jsonwebtoken nodemailer
```

For development:

```bash
npm install --save-dev nodemon
```

---

# 4. MySQL Database

Create a database:

```sql
CREATE DATABASE fire_maintenance;
```

Select the database:

```sql
USE fire_maintenance;
```

The complete database structure should be stored in:

```text
database/fire_maintenance.sql
```

Import the SQL file into MySQL.

---

# 🔐 Environment Variables

Create:

```text
server/.env
```

Example:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fire_maintenance

JWT_SECRET=your_secret_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

Do not upload the `.env` file to GitHub.

Add it to `.gitignore`.

```text
.env
node_modules/
```

---

# ▶️ Running the Project

## Start Backend

Go to:

```bash
cd server
```

Run:

```bash
npm run dev
```

or:

```bash
node server.js
```

Backend example:

```text
http://localhost:5000
```

---

## Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

React will normally run on a development address such as:

```text
http://localhost:5173
```

---

# 📱 Android and Laptop Access

The application is designed to work on:

- Laptop
- Desktop
- Android phone

The laptop and Android phone should be connected to the **same Wi-Fi network**.

Instead of using:

```text
localhost
```

from the Android phone, use the laptop's local IP address.

Example:

```text
192.168.1.105
```

The application can then be accessed using the laptop's LAN address and configured port.

Example:

```text
http://192.168.1.105:5000
```

or the React development port when running the frontend separately.

---

# 🌐 LAN Configuration

The backend should listen on the network interface instead of only localhost.

Example:

```javascript
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
```

Find the laptop's IP address on Windows:

```bash
ipconfig
```

Look for:

```text
IPv4 Address
```

Example:

```text
IPv4 Address : 192.168.1.105
```

Then use:

```text
http://192.168.1.105:PORT
```

on the Android device.

---

# 📍 Geolocation

The project uses the browser's Geolocation API.

Example:

```javascript
navigator.geolocation.getCurrentPosition(
    (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
    }
);
```

The obtained values are stored in MySQL.

```text
latitude
longitude
```

These coordinates are later used for technician distance calculation.

> For Android/LAN testing, browser geolocation normally requires a secure context such as HTTPS. `localhost` is treated specially by browsers, but a plain LAN HTTP address may not provide geolocation reliably.

---

# 🔒 Security

The application should use:

### Password Hashing

Passwords should not be stored as plain text.

Use:

```text
bcrypt
```

### Authentication

Use:

```text
JWT
```

for maintaining authenticated sessions/API access.

### Environment Variables

Database and email credentials should be stored in:

```text
.env
```

and not directly inside source code.

---

# 📧 Email Configuration

Nodemailer is used for sending emails.

The system can send:

```text
Complaint Confirmation
Technician Assignment
New Technician Task
Equipment Expiry Notification
```

For Gmail SMTP, use a Google account configured for application access, typically with an **App Password** where applicable.

Never store the Gmail password directly in the source code.

---

# 🔄 Complete System Flow

```text
                    START
                      │
                      ▼
                 Home Page
                      │
             ┌────────┼────────┐
             │        │        │
             ▼        ▼        ▼
       Organization Technician Admin
         Register    Register   Login
             │          │         │
             ▼          ▼         ▼
        Get Location Get Location Dashboard
             │          │
             ▼          ▼
       Store Lat/Lng Store Lat/Lng
             │          │
             └────┬─────┘
                  │
                  ▼
          Organization Login
                  │
                  ▼
          Register Equipment
                  │
                  ▼
           Raise Complaint
                  │
                  ▼
        Find Organization Location
                  │
                  ▼
        Find Technician Locations
                  │
                  ▼
        Calculate Distances
                  │
                  ▼
       Find Nearest Technician
                  │
                  ▼
             Create Task
                  │
             ┌────┴────┐
             ▼         ▼
       Organization  Technician
        receives       receives
        details         task
             │           │
             │           ▼
             │      In Progress
             │           │
             │           ▼
             │       Completed
             │           │
             │           ▼
             │   Maintenance Record
             │           │
             └─────┬─────┘
                   ▼
          Maintenance History
                   │
                   ▼
                  END
```

---

# 📊 Status Flow

## Complaint

```text
Pending
```

The complaint can then be processed through task creation and maintenance.

## Task

```text
Pending
   ↓
In Progress
   ↓
Completed
```

## Equipment

```text
Valid
   ↓
Expiring Soon
   ↓
Expired
```

---

# 🧮 Example of Technician Selection

Suppose an organization has:

```text
Latitude  = 23.0225
Longitude = 72.5714
```

Technicians:

```text
Technician A → 2.4 km
Technician B → 5.8 km
Technician C → 9.7 km
```

The system compares the calculated distances and selects the technician with the smallest distance.

```text
Minimum Distance = 2.4 km

Selected Technician = Technician A
```

A task is then created:

```text
Task ID       : 101
Complaint ID  : 25
Technician    : Technician A
Distance      : 2.4 km
Status        : Pending
```

---

# 🧪 Testing

The following areas should be tested.

## Authentication

- Organization login
- Technician login
- Admin login
- Incorrect password
- Invalid email
- Logout

## Organization

- Registration
- Location retrieval
- Equipment registration
- Complaint registration
- Complaint status
- Technician information

## Technician

- Registration
- Location retrieval
- View tasks
- Update task status
- Complete task
- Add maintenance record

## Admin

- View organizations
- View technicians
- View equipment
- View complaints
- Raise complaint
- View tasks
- View maintenance records

## Location

- Location permission
- Latitude storage
- Longitude storage
- Distance calculation
- Nearest technician selection

## Email

- Complaint email
- Technician task email
- Technician assignment email
- Expiry notification

## Responsive Design

Test on:

```text
Laptop
Desktop
Android Phone
```

---

# 📱 Responsive Design

Bootstrap and CSS are used to make the application responsive.

The UI should support:

```text
Desktop
Tablet
Mobile
```

Important responsive requirements:

- No horizontal scrolling
- Responsive navigation
- Mobile-friendly forms
- Touch-friendly buttons
- Responsive tables
- Responsive dashboard cards
- Mobile-friendly sidebar
- Proper spacing on small screens

---

# 🚫 Important Design Decisions

The current version intentionally does **not** contain:

### No Priority Field

Complaints do not have:

```text
Low
Medium
High
```

priority levels.

### No Assignments Table

There is no separate:

```text
assignments
```

table.

The project uses:

```text
tasks
```

for technician work.

### No Skill Filtering

Technicians are selected based on geographical distance.

The system does not currently filter technicians based on:

- Skills
- Availability
- Certification
- Workload

The main selection logic is:

```text
Find nearest technician
        ↓
Create task
```

---

# ⭐ Main Features

| Feature | Description |
|---|---|
| Authentication | Role-based login |
| Organization Registration | Register organization |
| Technician Registration | Register technician |
| Geolocation | Get current location |
| Equipment Management | Manage fire equipment |
| Expiry Tracking | Track equipment expiry |
| Complaint Management | Register complaints |
| Nearest Technician | Find technician by distance |
| Automatic Task | Create task for nearest technician |
| Task Tracking | Track technician work |
| Maintenance Records | Store maintenance history |
| Email Notification | Send system emails |
| Admin Dashboard | Manage complete system |
| Responsive UI | Laptop and Android support |

---

# 🔮 Future Enhancements

Possible future improvements include:

- Google Maps integration
- Interactive technician map
- Push notifications
- SMS notifications
- PDF maintenance reports
- Equipment QR codes
- QR-based equipment identification
- Technician work history
- Organization maintenance reports
- Admin analytics
- Automatic maintenance reminders
- Export reports to Excel/PDF

---

# 👨‍💻 Project Type

```text
Full-Stack Web Application
```

### Frontend

```text
React.js
Bootstrap
CSS
JavaScript
```

### Backend

```text
Node.js
Express.js
```

### Database

```text
MySQL
```

### APIs / Services

```text
Geolocation API
Nodemailer
Gmail SMTP
```

---

# 📌 Summary

The **Fire Equipment Maintenance Management System** provides a complete digital platform for managing fire safety equipment and maintenance activities.

The main process is:

```text
Register Organization
        ↓
Register Equipment
        ↓
Raise Complaint
        ↓
Find Nearest Technician
        ↓
Create Task
        ↓
Technician Performs Maintenance
        ↓
Complete Task
        ↓
Create Maintenance Record
        ↓
Maintain History
```

The project combines **React.js, Bootstrap, Node.js, Express.js, MySQL, Geolocation API, and Nodemailer** to create a responsive full-stack application that can be used on both laptops and Android devices.