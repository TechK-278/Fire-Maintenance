import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function AdminNewComplaint() {
  const [organizations, setOrganizations] = useState([]);
  const [allEquipment, setAllEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dispatchStep, setDispatchStep] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orgRes, eqRes] = await Promise.all([
          api.get('/organizations'),
          api.get('/equipment')
        ]);
        setOrganizations(orgRes.data);
        setAllEquipment(eqRes.data);

        if (orgRes.data.length > 0) {
          const firstOrgId = orgRes.data[0].organization_id;
          setSelectedOrgId(firstOrgId);
          const matching = eqRes.data.filter((e) => e.organization_id === firstOrgId);
          setFilteredEquipment(matching);
          if (matching.length > 0) {
            setSelectedEquipmentId(matching[0].equipment_id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleOrgChange = (orgId) => {
    setSelectedOrgId(orgId);
    const matching = allEquipment.filter((e) => String(e.organization_id) === String(orgId));
    setFilteredEquipment(matching);
    if (matching.length > 0) {
      setSelectedEquipmentId(matching[0].equipment_id);
    } else {
      setSelectedEquipmentId('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedOrgId || !selectedEquipmentId || !description.trim()) {
      setError('Please select an organization, equipment, and provide a description.');
      return;
    }

    setLoading(true);
    setDispatchStep(1);

    const stepTimer1 = setTimeout(() => setDispatchStep(2), 600);
    const stepTimer2 = setTimeout(() => setDispatchStep(3), 1200);

    try {
      const res = await api.post('/complaints', {
        organization_id: selectedOrgId,
        equipment_id: selectedEquipmentId,
        description
      });
      setDispatchStep(4);
      setTimeout(() => {
        setSuccessData(res.data);
        setLoading(false);
        setDispatchStep(0);
      }, 700);
    } catch (err) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setError(err.response?.data?.message || 'Failed to submit complaint.');
      setLoading(false);
      setDispatchStep(0);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card-custom">
            <div className="card-header-custom">
              <h4 className="fw-bold mb-0">Admin: Raise Complaint on Behalf of Organization</h4>
            </div>
            <div className="card-body-custom">
              {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

              {loading ? (
                <div className="p-4 bg-light rounded-4 border text-center my-3">
                  <div className="email-pulse-animation mb-3" style={{ fontSize: '3rem' }}>
                    ✉️ ⚡
                  </div>
                  <h5 className="fw-bold text-dark mb-1">Processing Maintenance Dispatch</h5>
                  <p className="text-muted small mb-4">Assigning nearest certified technician and sending automated email notifications...</p>

                  <div className="d-flex flex-column gap-2 text-start max-w-md mx-auto" style={{ maxWidth: '480px', margin: '0 auto' }}>
                    <div className={`dispatch-step-item ${dispatchStep === 1 ? 'active' : dispatchStep > 1 ? 'completed' : ''}`}>
                      <span>{dispatchStep > 1 ? '✓' : '🔄'}</span>
                      <span>Calculating Haversine GPS distance to find closest technician</span>
                    </div>

                    <div className={`dispatch-step-item ${dispatchStep === 2 ? 'active' : dispatchStep > 2 ? 'completed' : ''}`}>
                      <span>{dispatchStep > 2 ? '✓' : dispatchStep === 2 ? '🔄' : '⏳'}</span>
                      <span>Registering defect in database & creating task assignment</span>
                    </div>

                    <div className={`dispatch-step-item ${dispatchStep === 3 ? 'active' : dispatchStep > 3 ? 'completed' : ''}`}>
                      <span>{dispatchStep > 3 ? '✓' : dispatchStep === 3 ? '🔄' : '⏳'}</span>
                      <span>Connecting to Gmail SMTP & dispatching alert emails</span>
                    </div>

                    <div className={`dispatch-step-item ${dispatchStep >= 4 ? 'completed' : ''}`}>
                      <span>{dispatchStep >= 4 ? '✓' : '⏳'}</span>
                      <span>Email confirmation & technician dispatch complete</span>
                    </div>
                  </div>
                </div>
              ) : successData ? (
                <div className="alert alert-success p-4">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <h5 className="fw-bold mb-0">Complaint Created & Dispatch Emails Sent!</h5>
                  </div>
                  <p className="mb-3">Complaint Reference: <strong>#{successData.complaint_id}</strong></p>

                  {successData.task ? (
                    <div className="border bg-white p-3 rounded-3 mb-3 shadow-sm">
                      <h6 className="fw-bold text-dark mb-2">Nearest Technician Assigned:</h6>
                      <div className="d-flex flex-wrap justify-content-between gap-2 small">
                        <div>Technician: <strong className="text-dark">{successData.task.technician_name}</strong></div>
                        <div>Phone: <strong>{successData.task.technician_phone}</strong></div>
                        <div>Distance: <strong className="text-primary">{successData.task.distance} km</strong></div>
                      </div>
                    </div>
                  ) : (
                    <p className="mb-3 text-muted small">No technician was available nearby.</p>
                  )}

                  <div className="card border p-3 mb-3 bg-white">
                    <div className="fw-bold text-dark small mb-1">✉️ Automated Email Notifications:</div>
                    <ul className="list-unstyled mb-0 small text-muted">
                      <li>✓ Confirmation email sent to the organization's email address.</li>
                      <li>✓ Task assignment alert sent to the assigned technician.</li>
                    </ul>
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-fire-primary" onClick={() => navigate('/admin/complaints')}>
                      View Complaints
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setSuccessData(null);
                        setDescription('');
                      }}
                    >
                      Raise Another
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Target Organization / Facility</label>
                    <select
                      className="form-select"
                      value={selectedOrgId}
                      onChange={(e) => handleOrgChange(e.target.value)}
                      required
                    >
                      {organizations.map((org) => (
                        <option key={org.organization_id} value={org.organization_id}>
                          #{org.organization_id} - {org.organization_name} ({org.contact_person})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Equipment Item</label>
                    {filteredEquipment.length === 0 ? (
                      <div className="alert alert-warning small">
                        This organization does not have any registered equipment yet.
                      </div>
                    ) : (
                      <select
                        className="form-select"
                        value={selectedEquipmentId}
                        onChange={(e) => setSelectedEquipmentId(e.target.value)}
                        required
                      >
                        {filteredEquipment.map((eq) => (
                          <option key={eq.equipment_id} value={eq.equipment_id}>
                            #{eq.equipment_id} - {eq.equipment_type} ({eq.model}) - {eq.location}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Reported Issue Description</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Describe the maintenance or inspection requirement..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-fire-primary px-4 fw-bold"
                      disabled={loading || filteredEquipment.length === 0}
                    >
                      🚨 Dispatch Nearest Technician & Send Emails
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/admin/complaints')}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
