import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function ManageOrganizations() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await api.get('/organizations');
        setOrganizations(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgs();
  }, []);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">Registered Organizations & Facilities</h2>
          <p className="text-muted small mb-0">List of enrolled companies, facilities, and contact details.</p>
        </div>
      </div>

      <div className="card-custom">
        <div className="card-header-custom">
          <span>Organizations ({organizations.length})</span>
        </div>
        <div className="card-body-custom p-0">
          {loading ? (
            <div className="p-4 text-center">Loading organizations...</div>
          ) : organizations.length === 0 ? (
            <div className="p-4 text-center text-muted">No organizations registered yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Organization Name</th>
                    <th>Contact Person</th>
                    <th>Email & Phone</th>
                    <th>Facility Address</th>
                    <th>Coordinates (GPS)</th>
                    <th>Equipment</th>
                    <th>Complaints</th>
                  </tr>
                </thead>
                <tbody>
                  {organizations.map((org) => (
                    <tr key={org.organization_id}>
                      <td className="fw-semibold">#{org.organization_id}</td>
                      <td>
                        <span className="fw-bold text-dark">{org.organization_name}</span>
                      </td>
                      <td>{org.contact_person}</td>
                      <td>
                        <div>{org.email}</div>
                        <small className="text-muted">{org.phone}</small>
                      </td>
                      <td style={{ maxWidth: '200px' }}>{org.address}</td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {Number(org.latitude).toFixed(4)}, {Number(org.longitude).toFixed(4)}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-secondary">{org.total_equipment}</span>
                      </td>
                      <td>
                        <span className="badge bg-warning text-dark">{org.total_complaints}</span>
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
