import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    organization_name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    latitude: '',
    longitude: ''
  });

  const [geoLoading, setGeoLoading] = useState(false);
  const [geoMessage, setGeoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        organization_name: user.organizationName || '',
        contact_person: user.contactPerson || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        latitude: user.latitude !== undefined && user.latitude !== null ? String(user.latitude) : '',
        longitude: user.longitude !== undefined && user.longitude !== null ? String(user.longitude) : ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoMessage('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    setGeoMessage('Detecting GPS location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        }));
        setGeoMessage(`Location updated: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        setGeoLoading(false);
      },
      (err) => {
        setGeoMessage(`Detection failed (${err.message}). You can edit coordinates manually.`);
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      await updateProfile(formData);
      setSuccessMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete account.');
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card-custom">
            <div className="card-header-custom">
              <h4 className="fw-bold mb-0">Edit Profile & Account Settings</h4>
              <span className="badge bg-secondary">{user.role}</span>
            </div>
            <div className="card-body-custom">
              {successMessage && <div className="alert alert-success py-2 small mb-3">{successMessage}</div>}
              {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

              <form onSubmit={handleSubmit}>
                {user.role === 'Organization' ? (
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Organization / Facility Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="organization_name"
                        value={formData.organization_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Contact Person</label>
                      <input
                        type="text"
                        className="form-control"
                        name="contact_person"
                        value={formData.contact_person}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Physical / Base Address</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="card bg-light border p-3 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semibold text-dark">Location Coordinates (GPS)</span>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm fw-semibold"
                      onClick={handleGetLocation}
                      disabled={geoLoading}
                    >
                      {geoLoading ? 'Detecting...' : 'Get My Location'}
                    </button>
                  </div>
                  {geoMessage && <div className="small text-muted mb-2">{geoMessage}</div>}

                  <div className="row g-2">
                    <div className="col-md-6">
                      <label className="form-label small text-muted mb-1">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        className="form-control form-control-sm"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-muted mb-1">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        className="form-control form-control-sm"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-fire-primary px-4 fw-bold"
                    disabled={loading}
                  >
                    {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card-custom border-danger">
            
            <div className="card-body-custom">
              <p className="text-muted small mb-3">
                Deleting your account will permanently remove your profile, registered equipment records, complaints, and service history. This action cannot be undone.
              </p>
              <button
                type="button"
                className="btn btn-outline-danger fw-semibold"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-bold">Confirm Account Deletion</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  Are you absolutely sure you want to delete your account? All your associated records will be permanently removed from the system.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Yes, Permanently Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
