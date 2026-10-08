import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function OrgEquipment() {
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this equipment?')) return;
    try {
      await api.delete(`/equipment/${id}`);
      setMessage('Equipment deleted successfully.');
      fetchEquipment();
    } catch (err) {
      alert('Failed to delete equipment.');
    }
  };

  const filteredItems = equipment.filter((item) => {
    if (filter === 'ALL') return true;
    return item.status === filter;
  });

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">Fire Safety Equipment Registry</h2>
          <p className="text-muted small mb-0">Track all registered equipment, physical locations, and inspection expiry dates.</p>
        </div>
        <Link to="/organization/add-equipment" className="btn btn-fire-primary btn-sm">
          + Register New Equipment
        </Link>
      </div>

      {message && <div className="alert alert-success py-2 small mb-3">{message}</div>}

      <div className="card-custom">
        <div className="card-header-custom flex-wrap gap-2">
          <span>Equipment List ({filteredItems.length})</span>
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
          ) : filteredItems.length === 0 ? (
            <div className="p-4 text-center text-muted">No equipment found matching criteria.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Equipment Type</th>
                    <th>Model / Spec</th>
                    <th>Location in Facility</th>
                    <th>Issue Date</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.equipment_id}>
                      <td className="fw-semibold">#{item.equipment_id}</td>
                      <td>
                        <span className="fw-bold text-dark">{item.equipment_type}</span>
                      </td>
                      <td>{item.model}</td>
                      <td>{item.location}</td>
                      <td>{new Date(item.issue_date).toLocaleDateString()}</td>
                      <td>{new Date(item.expiry_date).toLocaleDateString()}</td>
                      <td>
                        <StatusBadge status={item.status} />
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link
                            to="/organization/new-complaint"
                            state={{ selectedEquipmentId: item.equipment_id }}
                            className="btn btn-sm btn-outline-danger"
                            title="Raise Complaint"
                          >
                            Issue
                          </Link>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleDelete(item.equipment_id)}
                          >
                            Delete
                          </button>
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
    </div>
  );
}
