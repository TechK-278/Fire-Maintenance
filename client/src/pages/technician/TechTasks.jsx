import { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function TechTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [maintenanceNotes, setMaintenanceNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

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

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setActionMessage(`Task #${taskId} updated to ${newStatus}.`);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task status.');
    }
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTask || !maintenanceNotes.trim()) return;

    setSubmitting(true);
    try {
      await api.post('/maintenance', {
        equipment_id: selectedTask.equipment_id,
        complaint_id: selectedTask.complaint_id,
        description: maintenanceNotes
      });

      setActionMessage(`Task #${selectedTask.task_id} completed and maintenance record saved.`);
      setSelectedTask(null);
      setMaintenanceNotes('');
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record maintenance.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">Assigned Maintenance Tasks</h2>
          <p className="text-muted small mb-0">Accept tasks, travel to organization sites, perform repairs, and submit completion reports.</p>
        </div>
      </div>

      {actionMessage && <div className="alert alert-success py-2 small mb-3">{actionMessage}</div>}

      <div className="card-custom">
        <div className="card-header-custom">
          <span>Task Queue ({tasks.length})</span>
        </div>
        <div className="card-body-custom p-0">
          {loading ? (
            <div className="p-4 text-center">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="p-4 text-center text-muted">No tasks assigned to your account.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Facility Details</th>
                    <th>Equipment</th>
                    <th>Distance</th>
                    <th>Defect Issue</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.task_id}>
                      <td className="fw-semibold">#{task.task_id}</td>
                      <td>
                        <div className="fw-bold text-dark">{task.organization_name}</div>
                        <div className="small text-muted">{task.contact_person} ({task.org_phone})</div>
                        <div className="small text-secondary">{task.org_address}</div>
                      </td>
                      <td>
                        <div className="fw-bold">{task.equipment_type}</div>
                        <small className="text-muted">{task.equipment_model} • {task.equipment_location}</small>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border fw-bold">
                           {task.distance} km
                        </span>
                      </td>
                      <td style={{ maxWidth: '220px' }}>
                        <div className="small bg-light p-2 rounded border">{task.complaint_description}</div>
                      </td>
                      <td>{new Date(task.task_date).toLocaleDateString()}</td>
                      <td>
                        <StatusBadge status={task.status} />
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          {task.status === 'Pending' && (
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleUpdateStatus(task.task_id, 'In Progress')}
                            >
                              Start Job
                            </button>
                          )}
                          {task.status === 'In Progress' && (
                            <button
                              className="btn btn-sm btn-success fw-semibold"
                              onClick={() => setSelectedTask(task)}
                            >
                              ✓ Complete & Log
                            </button>
                          )}
                          {task.status === 'Completed' && (
                            <span className="badge bg-success">Done</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedTask && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">
                  Complete Maintenance Task #{selectedTask.task_id}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedTask(null)}
                ></button>
              </div>
              <form onSubmit={handleCompleteSubmit}>
                <div className="modal-body">
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <div className="small text-muted">Organization:</div>
                      <div className="fw-bold">{selectedTask.organization_name}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="small text-muted">Equipment:</div>
                      <div className="fw-bold">{selectedTask.equipment_type} ({selectedTask.equipment_model})</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="small text-muted">Reported Defect:</div>
                    <div className="p-2 bg-light rounded border small">{selectedTask.complaint_description}</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Maintenance Actions Performed</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="e.g. Inspected pressure gauge, refilled extinguisher powder, replaced safety seal and valve pin, tested alarm circuit sensor..."
                      value={maintenanceNotes}
                      onChange={(e) => setMaintenanceNotes(e.target.value)}
                      required
                    ></textarea>
                    <div className="form-text small text-muted">
                      Submitting this form will record the official maintenance report and mark this task and complaint as Completed.
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedTask(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-fire-primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Save Maintenance Record & Complete'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
