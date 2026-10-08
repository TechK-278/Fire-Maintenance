import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <section className="hero-banner text-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">

              <h1 className="display-4 fw-bold mb-3">
                Fire Safety Equipment Maintenance Management System
              </h1>
              <p className="lead text-light mb-4 opacity-90">
                End-to-end digital compliance, automated expiry tracking, complaint logging, and nearest-technician GPS assignment for emergency & routine safety equipment servicing.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Link to="/login" className="btn btn-fire-primary btn-lg px-4">
                  Account Login
                </Link>
                <Link to="/register/organization" className="btn btn-light btn-lg px-4 text-dark fw-semibold">
                  Register Organization
                </Link>
                <Link to="/register/technician" className="btn btn-outline-light btn-lg px-4">
                  Join as Technician
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">Automated Maintenance Workflow</h2>
            <p className="text-muted">How Fire Maintenance streamlines equipment reliability from inspection to resolution</p>
          </div>
          <div className="row g-4">
            <div className="col-md-3">
              <div className="feature-box text-center shadow-sm">
                <h5 className="fw-bold">1. Equipment Registry</h5>
                <p className="text-muted small mb-0">
                  Organizations register extinguishers, alarms, sprinklers, hydrants, and hoses with serial & expiry dates.
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="feature-box text-center shadow-sm">
                <h5 className="fw-bold">2. Instant Complaints</h5>
                <p className="text-muted small mb-0">
                  Log low pressure, broken seals, or inspection defects with real-time tracking from pending to resolved.
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="feature-box text-center shadow-sm">
                <h5 className="fw-bold">3. Nearest Technician</h5>
                <p className="text-muted small mb-0">
                  Automated Haversine geolocation calculates minimum distance and dispatches the closest certified tech.
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="feature-box text-center shadow-sm">
                <h5 className="fw-bold">4. Verified Records</h5>
                <p className="text-muted small mb-0">
                  Technicians submit maintenance logs upon task completion, building an audit-proof service history.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light" id="about">
        <div className="container">
          <div className="row align-items-center g-5 mb-4">
            <div className="col-lg-6">
              
              <h2 className="fw-bold mb-3 text-dark">Engineered for Reliability & Compliance</h2>
              <p className="text-muted mb-4" style={{ lineHeight: '1.7' }}>
                Fire safety equipment requires strict adherence to inspection intervals and immediate rectification of reported faults. Manual spreadsheets and paper logs lead to missed expiration deadlines, delayed technician assignments, and compliance penalties.
              </p>

              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-start gap-3">
                  <div className="badge bg-danger rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', flexShrink: 0 }}>
                    ✓
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Proactive 30-Day Expiry Notifications</h6>
                    <small className="text-muted">Automated reminders before safety equipment certifications lapse.</small>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="badge bg-danger rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', flexShrink: 0 }}>
                    ✓
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Role-Based Access Control</h6>
                    <small className="text-muted">Tailored workspaces for Admins, Organizations, and Field Technicians.</small>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="badge bg-danger rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', flexShrink: 0 }}>
                    ✓
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Smart Haversine GPS Dispatch</h6>
                    <small className="text-muted">Real-time distance calculation to assign the closest certified engineer.</small>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="badge bg-danger rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', flexShrink: 0 }}>
                    ✓
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Audit-Proof Service Records</h6>
                    <small className="text-muted">Complete maintenance logs and inspection history for safety audits.</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="position-relative">
                <img
                  src="/fire-equipment.jpg"
                  alt="Fire Safety Equipment System"
                  className="img-fluid rounded-4 shadow-lg w-100"
                  style={{
                    border: '3px solid #EADAC6',
                    objectFit: 'cover',
                    maxHeight: '440px'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="card-custom border p-4 shadow-sm bg-white mt-4">
            <div className="row align-items-center g-3">
              <div className="col-lg-4">
                <h5 className="fw-bold mb-1 text-dark">Supported Fire Safety Equipment</h5>
                <p className="text-muted small mb-0">Standardized registry & maintenance tracking for all commercial safety devices</p>
              </div>
              <div className="col-lg-8">
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge" style={{ backgroundColor: '#FEF3E2', color: '#2A1A0E', border: '1px solid #EADAC6', padding: '10px 16px', fontSize: '0.88rem' }}>
                    Fire Extinguisher (ABC/CO2/Foam)
                  </span>
                  <span className="badge" style={{ backgroundColor: '#FEF3E2', color: '#2A1A0E', border: '1px solid #EADAC6', padding: '10px 16px', fontSize: '0.88rem' }}>
                    Smoke Detectors & Sensors
                  </span>
                  <span className="badge" style={{ backgroundColor: '#FEF3E2', color: '#2A1A0E', border: '1px solid #EADAC6', padding: '10px 16px', fontSize: '0.88rem' }}>
                    Fire Alarm Control Panels
                  </span>
                  <span className="badge" style={{ backgroundColor: '#FEF3E2', color: '#2A1A0E', border: '1px solid #EADAC6', padding: '10px 16px', fontSize: '0.88rem' }}>
                    Automatic Sprinkler Systems
                  </span>
                  <span className="badge" style={{ backgroundColor: '#FEF3E2', color: '#2A1A0E', border: '1px solid #EADAC6', padding: '10px 16px', fontSize: '0.88rem' }}>
                    Fire Hydrant Posts
                  </span>
                  <span className="badge" style={{ backgroundColor: '#FEF3E2', color: '#2A1A0E', border: '1px solid #EADAC6', padding: '10px 16px', fontSize: '0.88rem' }}>
                    Fire Hose Reels & Nozzles
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white" id="contact">
        <div className="container text-center">
          <h2 className="fw-bold mb-2">Ready to secure your facilities?</h2>
          <p className="text-muted mb-4">Register your organization or technician account to get started immediately.</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/register/organization" className="btn btn-fire-primary">
              Register Organization
            </Link>
            <Link to="/login" className="btn btn-outline-secondary">
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
