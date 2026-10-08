import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get('/complaints');
        setComplaints(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">Facility Complaints & Dispatch Log</h2>
          <p className="text-muted small mb-0">System-wide list of reported equipment faults and assigned technician statuses.</p>
        </div>
        <Link to="/admin/new-complaint" className="btn btn-fire-primary btn-sm">
          🚨 Raise Complaint on Behalf
        </Link>
      </div>

      <div className="card-custom">
        <div className="card-header-custom">
          <span>All Complaints ({complaints.length})</span>
        </div>
        <div className="card-body-custom p-0">
          {loading ? (
            <div className="p-4 text-center">Loading complaints...</div>
          ) : complaints.length === 0 ? (
            <div className="p-4 text-center text-muted">No complaints recorded.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Facility</th>
                    <th>Equipment</th>
                    <th>Reported Issue</th>
                    <th>Created By</th>
                    <th>Assigned Technician</th>
                    <th>Calculated Distance</th>
                    <th>Complaint Status</th>
                    <th>Task Status</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((comp) => (
                    <tr key={comp.complaint_id}>
                      <td className="fw-semibold">#{comp.complaint_id}</td>
                      <td>
                        <div className="fw-bold text-dark">{comp.organization_name}</div>
                        <small className="text-muted">{comp.org_phone}</small>
                      </td>
                      <td>
                        <div className="fw-semibold">{comp.equipment_type}</div>
                        <small className="text-muted">{comp.equipment_model} ({comp.equipment_location})</small>
                      </td>
                      <td style={{ maxWidth: '200px' }}>
                        <div className="small text-muted">{comp.description}</div>
                      </td>
                      <td>
                        <span className="badge bg-secondary">{comp.created_by}</span>
                      </td>
                      <td>
                        {comp.technician_name ? (
                          <div>
                            <span className="fw-bold text-dark">{comp.technician_name}</span>
                            <div className="small text-muted">{comp.technician_phone}</div>
                          </div>
                        ) : (
                          <span className="text-muted small">Unassigned</span>
                        )}
                      </td>
                      <td>
                        {comp.distance ? (
                          <span className="badge bg-light text-dark border">
                             {comp.distance} km
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td>
                        <StatusBadge status={comp.status} />
                      </td>
                      <td>
                        {comp.task_status ? (
                          <StatusBadge status={comp.task_status} />
                        ) : (
                          <span className="text-muted small">No Task</span>
                        )}
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
