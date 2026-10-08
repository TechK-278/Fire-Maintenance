import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" role="status"></div>
      </div>
    );
  }

  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">Technician Operations Dashboard</h2>
          <p className="text-muted small mb-0">
            Field Technician: <strong>{user?.name}</strong> | Base Coordinates: {user?.latitude}, {user?.longitude}
          </p>
        </div>
        <Link to="/technician/tasks" className="btn btn-fire-primary btn-sm">
          View Task Queue
        </Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <StatsCard label="Total Tasks" value={tasks.length} variant="primary" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatsCard label="Pending Acceptance" value={pendingCount} variant="warning" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatsCard label="In Progress" value={inProgressCount} variant="info" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatsCard label="Completed Jobs" value={completedCount} variant="success" />
        </div>
      </div>

      <div className="card-custom">
        <div className="card-header-custom">
          <span>Active Assigned Tasks (Nearest Dispatches)</span>
          <Link to="/technician/tasks" className="small text-danger fw-semibold">View All Tasks</Link>
        </div>
        <div className="card-body-custom p-0">
          {tasks.length === 0 ? (
            <div className="p-4 text-center text-muted">No maintenance tasks assigned currently.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Facility / Organization</th>
                    <th>Equipment</th>
                    <th>Distance</th>
                    <th>Reported Issue</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.slice(0, 5).map((task) => (
                    <tr key={task.task_id}>
                      <td className="fw-semibold">#{task.task_id}</td>
                      <td>
                        <div className="fw-bold text-dark">{task.organization_name}</div>
                        <small className="text-muted">{task.org_phone} • {task.org_address}</small>
                      </td>
                      <td>
                        <div className="fw-semibold">{task.equipment_type}</div>
                        <small className="text-muted">{task.equipment_location}</small>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border fw-bold">
                          {task.distance} km
                        </span>
                      </td>
                      <td style={{ maxWidth: '200px' }}>
                        <div className="small text-muted">{task.complaint_description}</div>
                      </td>
                      <td>
                        <StatusBadge status={task.status} />
                      </td>
                      <td>
                        <Link to="/technician/tasks" className="btn btn-sm btn-outline-danger">
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
