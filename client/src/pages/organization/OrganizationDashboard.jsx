import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';

export default function OrganizationDashboard() {
  const { user } = useAuth();
  const [equipmentList, setEquipmentList] = useState([]);
  const [complaintsList, setComplaintsList] = useState([]);
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eqRes, compRes, maintRes] = await Promise.all([
          api.get('/equipment'),
          api.get('/complaints'),
          api.get('/maintenance')
        ]);
        setEquipmentList(eqRes.data);
        setComplaintsList(compRes.data);
        setMaintenanceList(maintRes.data);
      } catch (err) {
        console.error('Failed to load organization data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" role="status"></div>
      </div>
    );
  }

  const validCount = equipmentList.filter((e) => e.status === 'Valid').length;
  const expiringCount = equipmentList.filter((e) => e.status === 'Expiring Soon').length;
  const expiredCount = equipmentList.filter((e) => e.status === 'Expired').length;
  const pendingComplaints = complaintsList.filter((c) => c.status === 'Pending').length;

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">{user?.organizationName || 'Facility'} Dashboard</h2>
          <p className="text-muted small mb-0">
            Address: {user?.address || 'N/A'} | Coordinates: {user?.latitude}, {user?.longitude}
          </p>
        </div>
        <div className="d-flex gap-2 mt-2 mt-md-0">
          <Link to="/organization/add-equipment" className="btn btn-fire-secondary btn-sm">
            + Add Equipment
          </Link>
          <Link to="/organization/new-complaint" className="btn btn-fire-primary btn-sm">
            Raise Complaint
          </Link>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <StatsCard label="Total Equipment" value={equipmentList.length} variant="primary" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatsCard label="Valid Equipment" value={validCount} variant="success" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatsCard label="Expiring / Expired" value={expiringCount + expiredCount} variant="warning" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatsCard label="Pending Complaints" value={pendingComplaints} variant="info" />
        </div>
      </div>

      {expiringCount + expiredCount > 0 && (
        <div className="alert alert-warning d-flex align-items-center justify-content-between mb-4">
          <div>
            <strong>Attention:</strong> You have {expiringCount} equipment expiring within 30 days and {expiredCount} expired items requiring inspection or renewal.
          </div>
          <Link to="/organization/equipment" className="btn btn-sm btn-outline-dark">
            Review Equipment
          </Link>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card-custom">
            <div className="card-header-custom">
              <span>Active Complaints & Assigned Tasks</span>
              <Link to="/organization/complaints" className="small text-danger fw-semibold">View All</Link>
            </div>
            <div className="card-body-custom p-0">
              {complaintsList.length === 0 ? (
                <div className="p-4 text-center text-muted">No complaints reported.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-custom">
                    <thead>
                      <tr>
                        <th>Equipment</th>
                        <th>Assigned Tech</th>
                        <th>Distance</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaintsList.slice(0, 5).map((comp) => (
                        <tr key={comp.complaint_id}>
                          <td>
                            <div className="fw-semibold">{comp.equipment_type}</div>
                            <small className="text-muted">{comp.equipment_location}</small>
                          </td>
                          <td>
                            {comp.technician_name ? (
                              <div>
                                <span className="fw-semibold">{comp.technician_name}</span>
                                <br />
                                <small className="text-muted">{comp.technician_phone}</small>
                              </div>
                            ) : (
                              <span className="text-muted small">Searching...</span>
                            )}
                          </td>
                          <td>
                            {comp.distance ? `${comp.distance} km` : '—'}
                          </td>
                          <td>
                            <StatusBadge status={comp.status} />
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

        <div className="col-lg-6">
          <div className="card-custom">
            <div className="card-header-custom">
              <span>Registered Fire Equipment</span>
              <Link to="/organization/equipment" className="small text-danger fw-semibold">Manage</Link>
            </div>
            <div className="card-body-custom p-0">
              {equipmentList.length === 0 ? (
                <div className="p-4 text-center text-muted">No equipment registered yet.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-custom">
                    <thead>
                      <tr>
                        <th>Type / Model</th>
                        <th>Location</th>
                        <th>Expiry Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equipmentList.slice(0, 5).map((eq) => (
                        <tr key={eq.equipment_id}>
                          <td>
                            <div className="fw-semibold">{eq.equipment_type}</div>
                            <small className="text-muted">{eq.model}</small>
                          </td>
                          <td>{eq.location}</td>
                          <td>{new Date(eq.expiry_date).toLocaleDateString()}</td>
                          <td>
                            <StatusBadge status={eq.status} />
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
      </div>
    </div>
  );
}
