import { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function ManageTasks() {
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

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">Technician Dispatch & Assigned Tasks</h2>
          <p className="text-muted small mb-0">System-wide monitoring of task progress and travel distances.</p>
        </div>
      </div>

      <div className="card-custom">
        <div className="card-header-custom">
          <span>All Dispatched Tasks ({tasks.length})</span>
        </div>
        <div className="card-body-custom p-0">
          {loading ? (
            <div className="p-4 text-center">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="p-4 text-center text-muted">No tasks generated yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Complaint ID</th>
                    <th>Organization / Site</th>
                    <th>Assigned Technician</th>
                    <th>Distance</th>
                    <th>Equipment</th>
                    <th>Task Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.task_id}>
                      <td className="fw-semibold">#{task.task_id}</td>
                      <td>#{task.complaint_id}</td>
                      <td>
                        <div className="fw-bold text-dark">{task.organization_name}</div>
                        <small className="text-muted">{task.org_phone} • {task.org_address}</small>
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{task.technician_name}</div>
                        <small className="text-muted">{task.technician_phone}</small>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border fw-bold">
                           {task.distance} km
                        </span>
                      </td>
                      <td>
                        <div className="fw-semibold">{task.equipment_type}</div>
                        <small className="text-muted">{task.equipment_location}</small>
                      </td>
                      <td>{new Date(task.task_date).toLocaleDateString()}</td>
                      <td>
                        <StatusBadge status={task.status} />
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
