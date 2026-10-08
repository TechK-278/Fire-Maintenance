import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import RegisterOrganization from './pages/RegisterOrganization';
import RegisterTechnician from './pages/RegisterTechnician';
import Profile from './pages/Profile';

import OrganizationDashboard from './pages/organization/OrganizationDashboard';
import OrgEquipment from './pages/organization/OrgEquipment';
import OrgAddEquipment from './pages/organization/OrgAddEquipment';
import OrgComplaints from './pages/organization/OrgComplaints';
import OrgNewComplaint from './pages/organization/OrgNewComplaint';
import OrgMaintenance from './pages/organization/OrgMaintenance';

import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import TechTasks from './pages/technician/TechTasks';
import TechMaintenance from './pages/technician/TechMaintenance';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageOrganizations from './pages/admin/ManageOrganizations';
import ManageTechnicians from './pages/admin/ManageTechnicians';
import ManageEquipment from './pages/admin/ManageEquipment';
import ManageComplaints from './pages/admin/ManageComplaints';
import AdminNewComplaint from './pages/admin/AdminNewComplaint';
import ManageTasks from './pages/admin/ManageTasks';
import ManageMaintenance from './pages/admin/ManageMaintenance';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register/organization" element={<RegisterOrganization />} />
              <Route path="/register/technician" element={<RegisterTechnician />} />

              <Route
                path="/organization"
                element={
                  <ProtectedRoute allowedRoles={['Organization']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<OrganizationDashboard />} />
                <Route path="equipment" element={<OrgEquipment />} />
                <Route path="add-equipment" element={<OrgAddEquipment />} />
                <Route path="complaints" element={<OrgComplaints />} />
                <Route path="new-complaint" element={<OrgNewComplaint />} />
                <Route path="maintenance" element={<OrgMaintenance />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              <Route
                path="/technician"
                element={
                  <ProtectedRoute allowedRoles={['Technician']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<TechnicianDashboard />} />
                <Route path="tasks" element={<TechTasks />} />
                <Route path="maintenance" element={<TechMaintenance />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="organizations" element={<ManageOrganizations />} />
                <Route path="technicians" element={<ManageTechnicians />} />
                <Route path="equipment" element={<ManageEquipment />} />
                <Route path="complaints" element={<ManageComplaints />} />
                <Route path="new-complaint" element={<AdminNewComplaint />} />
                <Route path="tasks" element={<ManageTasks />} />
                <Route path="maintenance" element={<ManageMaintenance />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
