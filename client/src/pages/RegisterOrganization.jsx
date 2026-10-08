import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterOrganization() {
  const [formData, setFormData] = useState({
    organization_name: '',
    contact_person: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    latitude: '',
    longitude: ''
  });
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoMessage, setGeoMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerOrganization } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoMessage('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    setGeoMessage('Detecting your GPS location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        }));
        setGeoMessage(`Coordinates detected: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        setGeoLoading(false);
      },
      (err) => {
        setGeoMessage(`Location detection failed (${err.message}). You can manually enter latitude & longitude.`);
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.latitude || !formData.longitude) {
      setError('Please provide Latitude and Longitude (or click "Get My Location").');
      return;
    }

    setLoading(true);

    try {
      await registerOrganization(formData);
      navigate('/organization');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card-custom shadow-sm">
            <div className="card-header-custom">
              <h4 className="fw-bold mb-0">Organization Registration</h4>
              <span className="badge bg-danger">Facilities Portal</span>
            </div>
            <div className="card-body-custom">
              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Organization / Facility Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="organization_name"
                      placeholder="e.g. Acme Towers Ltd."
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
                      placeholder="e.g. John Doe"
                      value={formData.contact_person}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="contact@acme.com"
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
                      placeholder="e.g. +91 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Physical Facility Address</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="address"
                    placeholder="Street, Building No, City, Pincode"
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
                      {geoLoading ? 'Detecting...' : '📍 Get My Location'}
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
                        placeholder="e.g. 23.0225"
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
                        placeholder="e.g. 72.5714"
                        value={formData.longitude}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-fire-primary w-100 py-2 fw-bold"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Complete Organization Registration'}
                </button>
              </form>

              <div className="mt-3 text-center small text-muted">
                Already registered? <Link to="/login" className="text-danger fw-semibold">Sign in here</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
