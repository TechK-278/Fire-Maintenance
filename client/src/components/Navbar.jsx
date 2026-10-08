import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'Admin') return '/admin';
    if (user.role === 'Organization') return '/organization';
    if (user.role === 'Technician') return '/technician';
    return '/';
  };

  const getProfilePath = () => {
    if (user?.role === 'Organization') return '/organization/profile';
    if (user?.role === 'Technician') return '/technician/profile';
    return '/';
  };

  const displayName = user?.organizationName || user?.name || user?.email || 'User';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img
            src="/logo.png"
            alt="Logo"
            style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
          />
          <span>Fire Maintenance</span>
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            <li className="nav-item">
              <Link className="nav-link px-3" to="/">Home</Link>
            </li>

            {!isAuthenticated || !user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/register/organization">Register Organization</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/register/technician">Register Technician</Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link className="btn btn-fire-primary btn-sm px-3" to="/login">Login</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3" to={getDashboardPath()}>Dashboard</Link>
                </li>
                <li className="nav-item dropdown position-relative ms-lg-2" ref={dropdownRef}>
                  <button
                    className="btn btn-outline-amber d-flex align-items-center gap-2 px-3 py-1"
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    aria-expanded={dropdownOpen}
                    style={{ fontSize: '0.95rem' }}
                  >
                    <span>{displayName}</span>
                    <span style={{ fontSize: '0.75rem' }}>▼</span>
                  </button>

                  {dropdownOpen && (
                    <div
                      className="dropdown-menu dropdown-menu-end show custom-user-dropdown"
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        marginTop: '8px',
                        minWidth: '220px',
                        zIndex: 1050
                      }}
                    >
                      <div className="px-3 py-2 border-bottom user-dropdown-header">
                        <div style={{ color: '#EADAC6', fontSize: '0.8rem', marginBottom: '4px' }}>User Type</div>
                        <div>
                          <span className="badge" style={{ backgroundColor: '#FEF3E2', color: '#2A1A0E', fontWeight: '600' }}>
                            {user?.role || ''}
                          </span>
                        </div>
                      </div>

                      {user.role !== 'Admin' && (
                        <Link
                          className="dropdown-item py-2 d-flex align-items-center gap-2"
                          to={getProfilePath()}
                          onClick={() => setDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                      )}

                      <button
                        className="dropdown-item py-2 text-danger d-flex align-items-center gap-2"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
