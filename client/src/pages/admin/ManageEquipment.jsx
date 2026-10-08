import { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function ManageEquipment() {
  const [equipment, setEquipment] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchEquipment = async () => {
    try {
      const res = await api.get('/equipment');
      setEquipment(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleNotifyExpiry = async (id) => {
    try {
      const res = await api.post(`/equipment/${id}/notify-expiry`);
      setMessage(res.data.message || 'Expiry alert email sent.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send alert email.');
    }
  };

  const filtered = equipment.filter((eq) => {
    if (filter === 'ALL') return true;
    return eq.status === filter;
  });

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">System-Wide Equipment Inventory</h2>
          <p className="text-muted small mb-0">Monitor inspection status and upcoming expirations across all facilities.</p>
        </div>
      </div>

      {message && <div className="alert alert-success py-2 small mb-3">{message}</div>}

      <div className="card-custom">
        <div className="card-header-custom flex-wrap gap-2">
          <span>Equipment Records ({filtered.length})</span>
          <div className="btn-group btn-group-sm">
            <button
              className={`btn btn-outline-secondary ${filter === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilter('ALL')}
            >
              All ({equipment.length})
            </button>
            <button
              className={`btn btn-outline-success ${filter === 'Valid' ? 'active' : ''}`}
              onClick={() => setFilter('Valid')}
            >
              Valid
            </button>
            <button
              className={`btn btn-outline-warning ${filter === 'Expiring Soon' ? 'active' : ''}`}
              onClick={() => setFilter('Expiring Soon')}
            >
              Expiring Soon
            </button>
            <button
              className={`btn btn-outline-danger ${filter === 'Expired' ? 'active' : ''}`}
              onClick={() => setFilter('Expired')}
            >
              Expired
            </button>
          </div>
        </div>
        <div className="card-body-custom p-0">
          {loading ? (
            <div className="p-4 text-center">Loading equipment...</div>
          ) : filtered.length === 0 ? (
            <div className="p-4 text-center text-muted">No equipment found matching criteria.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Organization / Facility</th>
                    <th>Equipment Type</th>
                    <th>Model</th>
                    <th>Location</th>
                    <th>Issue Date</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.equipment_id}>
                      <td className="fw-semibold">#{item.equipment_id}</td>
                      <td>
                        <div className="fw-bold text-dark">{item.organization_name}</div>
                        <small className="text-muted">{item.contact_person} ({item.org_phone})</small>
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{item.equipment_type}</div>
                      </td>
                      <td>{item.model}</td>
                      <td>{item.location}</td>
                      <td>{new Date(item.issue_date).toLocaleDateString()}</td>
                      <td>{new Date(item.expiry_date).toLocaleDateString()}</td>
                      <td>
                        <StatusBadge status={item.status} />
                      </td>
                      <td>
                        {(item.status === 'Expiring Soon' || item.status === 'Expired') ? (
                          <button
                            className="btn btn-sm btn-outline-warning text-dark"
                            onClick={() => handleNotifyExpiry(item.equipment_id)}
                            title="Send Expiry Notification Email"
                          >
                            Alert
                          </button>
                        ) : (
                          <span className="text-muted small">—</span>
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
