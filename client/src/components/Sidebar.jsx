import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <aside className="sidebar">
      {user.role === 'Admin' && (
        <>
          <div className="sidebar-title">Admin Management</div>
          <ul className="sidebar-nav">
            <li>
              <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                Dashboard Overview
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/organizations" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                Organizations
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/technicians" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                Technicians
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/equipment" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                Fire Equipment
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/complaints" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                All Complaints
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/new-complaint" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                Raise Complaint
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/tasks" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                Assigned Tasks
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/maintenance" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                Maintenance Records
              </NavLink>
            </li>
          </ul>
        </>
      )}

      {user.role === 'Organization' && (
        <>
          <div className="sidebar-title">Organization Portal</div>
          <ul className="sidebar-nav">
            <li>
              <NavLink to="/organization" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/organization/equipment" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                My Equipment
              </NavLink>
            </li>
            <li>
              <NavLink to="/organization/add-equipment" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                Register Equipment
              </NavLink>
            </li>
            <li>
              <NavLink to="/organization/complaints" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                Complaints Status
              </NavLink>
            </li>
            <li>
              <NavLink to="/organization/new-complaint" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                Raise New Complaint
              </NavLink>
            </li>
            <li>
              <NavLink to="/organization/maintenance" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                Maintenance History
              </NavLink>
            </li>
            <li>
              <NavLink to="/organization/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                Profile & Settings
              </NavLink>
            </li>
          </ul>
        </>
      )}

      {user.role === 'Technician' && (
        <>
          <div className="sidebar-title">Technician Workspace</div>
          <ul className="sidebar-nav">
            <li>
              <NavLink to="/technician" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                Technician Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/technician/tasks" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                Assigned Tasks
              </NavLink>
            </li>
            <li>
              <NavLink to="/technician/maintenance" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                Maintenance History
              </NavLink>
            </li>
            <li>
              <NavLink to="/technician/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                Profile & Settings
              </NavLink>
            </li>
          </ul>
        </>
      )}
    </aside>
  );
}
