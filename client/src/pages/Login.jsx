import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Organization');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password, role);
      if (user.role === 'Admin') {
        navigate('/admin');
      } else if (user.role === 'Organization') {
        navigate('/organization');
      } else if (user.role === 'Technician') {
        navigate('/technician');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card-custom shadow-sm">
            <div className="card-header-custom text-center">
              <h4 className="fw-bold mb-0">System Login</h4>
            </div>
            <div className="card-body-custom">
              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Login As</label>
                  <select
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="Organization">Organization</option>
                    <option value="Technician">Technician</option>
                    <option value="Admin">System Administrator</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-fire-primary w-100 py-2 fw-bold"
                  disabled={loading}
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-4 text-center small text-muted">
                <div>Don't have an account?</div>
                <div className="d-flex justify-content-center gap-2 mt-1">
                  <Link to="/register/organization" className="text-danger fw-semibold">
                    Register Organization
                  </Link>
                  <span>•</span>
                  <Link to="/register/technician" className="text-danger fw-semibold">
                    Register Technician
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
