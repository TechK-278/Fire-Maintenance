import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatsCard from '../../components/StatsCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_organizations: 0,
    total_technicians: 0,
    total_equipment: 0,
    pending_complaints: 0,
    in_progress_tasks: 0,
    completed_tasks: 0,
    expired_equipment: 0,
    active_tasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" role="status"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">System Administration Control Panel</h2>
          <p className="text-muted small mb-0">System-wide monitoring of facilities, certified technicians, complaints, and tasks.</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/new-complaint" className="btn btn-fire-primary btn-sm">
            Raise Complaint for Facility
          </Link>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-md-3">
          <StatsCard label="Total Organizations" value={stats.total_organizations} variant="primary" />
        </div>
        <div className="col-sm-6 col-md-3">
          <StatsCard label="Total Technicians" value={stats.total_technicians} variant="info" />
        </div>
        <div className="col-sm-6 col-md-3">
          <StatsCard label="Registered Equipment" value={stats.total_equipment} variant="success" />
        </div>
        <div className="col-sm-6 col-md-3">
          <StatsCard label="Expired / Due" value={stats.expired_equipment} variant="warning" />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-md-4">
          <StatsCard label="Pending Complaints" value={stats.pending_complaints} variant="warning" />
        </div>
        <div className="col-sm-6 col-md-4">
          <StatsCard label="Active In-Progress Tasks" value={stats.in_progress_tasks} variant="info" />
        </div>
        <div className="col-sm-6 col-md-4">
          <StatsCard label="Completed Maintenance" value={stats.completed_tasks} variant="success" />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card-custom">
            <div className="card-header-custom">Quick Management Shortcuts</div>
            <div className="card-body-custom d-flex flex-column gap-2">
              <Link to="/admin/organizations" className="btn btn-outline-dark text-start d-flex justify-content-between align-items-center p-3">
                <span>Manage Organizations & Facilities</span>
                <span className="badge bg-secondary">{stats.total_organizations} registered</span>
              </Link>
              <Link to="/admin/technicians" className="btn btn-outline-dark text-start d-flex justify-content-between align-items-center p-3">
                <span>Manage Field Technicians</span>
                <span className="badge bg-secondary">{stats.total_technicians} registered</span>
              </Link>
              <Link to="/admin/equipment" className="btn btn-outline-dark text-start d-flex justify-content-between align-items-center p-3">
                <span>Inspect Equipment Expiry Status</span>
                <span className="badge bg-danger">{stats.expired_equipment} alerts</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card-custom">
            <div className="card-header-custom">Operations & Workflows</div>
            <div className="card-body-custom d-flex flex-column gap-2">
              <Link to="/admin/complaints" className="btn btn-outline-danger text-start d-flex justify-content-between align-items-center p-3">
                <span>System-wide Complaints & Tickets</span>
                <span className="badge bg-warning text-dark">{stats.pending_complaints} pending</span>
              </Link>
              <Link to="/admin/tasks" className="btn btn-outline-secondary text-start d-flex justify-content-between align-items-center p-3">
                <span>Dispatch & Assigned Tasks Queue</span>
                <span className="badge bg-info text-dark">{stats.active_tasks} active</span>
              </Link>
              <Link to="/admin/maintenance" className="btn btn-outline-success text-start d-flex justify-content-between align-items-center p-3">
                <span>Historical Maintenance Audit Log</span>
                <span className="badge bg-success">{stats.completed_tasks} records</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
