import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const EQUIPMENT_TYPES = [
  'Fire Extinguisher (ABC Powder)',
  'Fire Extinguisher (CO2)',
  'Fire Extinguisher (Water/Foam)',
  'Smoke Detector',
  'Fire Alarm Control Panel',
  'Manual Call Point',
  'Automatic Fire Sprinkler',
  'Fire Hydrant Post',
  'Fire Hose Reel'
];

export default function OrgAddEquipment() {
  const [formData, setFormData] = useState({
    equipment_type: EQUIPMENT_TYPES[0],
    model: '',
    issue_date: '',
    expiry_date: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/equipment', formData);
      navigate('/organization/equipment');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register equipment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card-custom">
            <div className="card-header-custom">
              <h4 className="fw-bold mb-0">Register New Fire Safety Equipment</h4>
            </div>
            <div className="card-body-custom">
              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Equipment Type</label>
                  <select
                    className="form-select"
                    name="equipment_type"
                    value={formData.equipment_type}
                    onChange={handleChange}
                    required
                  >
                    {EQUIPMENT_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Model / Serial Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="model"
                      placeholder="e.g. Ceasefire 6KG ABC-2025"
                      value={formData.model}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Location / Placement</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      placeholder="e.g. 2nd Floor Server Room East"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Issue / Installation Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="issue_date"
                      value={formData.issue_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Expiry / Next Hydrotest Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="expiry_date"
                      value={formData.expiry_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-fire-primary px-4 fw-bold"
                    disabled={loading}
                  >
                    {loading ? 'Saving Equipment...' : 'Register Equipment'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/organization/equipment')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
