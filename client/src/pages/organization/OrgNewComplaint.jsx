import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

export default function OrgNewComplaint() {
  const location = useLocation();
  const [equipmentList, setEquipmentList] = useState([]);
  const [equipmentId, setEquipmentId] = useState(location.state?.selectedEquipmentId || '');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dispatchStep, setDispatchStep] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await api.get('/equipment');
        setEquipmentList(res.data);
        if (!equipmentId && res.data.length > 0) {
          setEquipmentId(res.data[0].equipment_id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchEquipment();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setDispatchStep(1);

    const stepTimer1 = setTimeout(() => setDispatchStep(2), 600);
    const stepTimer2 = setTimeout(() => setDispatchStep(3), 1200);

    try {
      const res = await api.post('/complaints', {
        equipment_id: equipmentId,
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
              <h4 className="fw-bold mb-0">Report Equipment Defect / Maintenance Complaint</h4>
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
                    <h5 className="fw-bold mb-0">Complaint Registered & Emails Dispatched!</h5>
                  </div>
                  <p className="mb-3">
                    Complaint Reference: <strong>#{successData.complaint_id}</strong>
                  </p>

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
                    <p className="mb-3 text-muted small">No technicians available in database currently.</p>
                  )}

                  <div className="card border p-3 mb-3 bg-white">
                    <div className="fw-bold text-dark small mb-1">Automated Email Notifications:</div>
                    <ul className="list-unstyled mb-0 small text-muted">
                      <li>✓ Confirmation email sent to your registered Organization email address.</li>
                      <li>✓ Task assignment alert with address & equipment details sent to assigned Technician.</li>
                    </ul>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-fire-primary"
                      onClick={() => navigate('/organization/complaints')}
                    >
                      View All Complaints
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
                    <label className="form-label fw-semibold">Select Defective Equipment</label>
                    {equipmentList.length === 0 ? (
                      <div className="alert alert-warning small">
                        No equipment registered yet. Please add equipment first.
                      </div>
                    ) : (
                      <select
                        className="form-select"
                        value={equipmentId}
                        onChange={(e) => setEquipmentId(e.target.value)}
                        required
                      >
                        {equipmentList.map((eq) => (
                          <option key={eq.equipment_id} value={eq.equipment_id}>
                            #{eq.equipment_id} - {eq.equipment_type} ({eq.model}) - Location: {eq.location} - Status: {eq.status}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Defect / Maintenance Issue Description</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Describe the issue in detail (e.g. pressure gauge needle in red zone, safety pin broken, detector beeping intermittently)..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                    <div className="form-text small text-muted">
                      Our system will compute the nearest registered technician via GPS coordinates and dispatch an automated service task and email alerts.
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-fire-primary px-4 fw-bold"
                      disabled={loading || equipmentList.length === 0}
                    >
                      Submit Complaint & Dispatch Emails
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/organization/complaints')}
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
