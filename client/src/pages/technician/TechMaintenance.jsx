import { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function TechMaintenance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await api.get('/maintenance');
        setRecords(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">My Serviced Maintenance Records</h2>
          <p className="text-muted small mb-0">History of equipment inspections and repairs performed by you.</p>
        </div>
      </div>

      <div className="card-custom">
        <div className="card-header-custom">
          <span>Maintenance Records ({records.length})</span>
        </div>
        <div className="card-body-custom p-0">
          {loading ? (
            <div className="p-4 text-center">Loading records...</div>
          ) : records.length === 0 ? (
            <div className="p-4 text-center text-muted">No maintenance records submitted yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th>Record ID</th>
                    <th>Facility / Organization</th>
                    <th>Equipment</th>
                    <th>Date</th>
                    <th>Maintenance Details</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec) => (
                    <tr key={rec.record_id}>
                      <td className="fw-semibold">#{rec.record_id}</td>
                      <td>
                        <div className="fw-bold text-dark">{rec.organization_name}</div>
                        <small className="text-muted">{rec.org_phone} • {rec.org_address}</small>
                      </td>
                      <td>
                        <div className="fw-semibold">{rec.equipment_type}</div>
                        <small className="text-muted">{rec.equipment_model} ({rec.equipment_location})</small>
                      </td>
                      <td>{new Date(rec.maintenance_date).toLocaleDateString()}</td>
                      <td style={{ maxWidth: '300px' }}>
                        <div className="p-2 bg-light rounded small text-dark border">
                          {rec.description}
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={rec.status} />
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
