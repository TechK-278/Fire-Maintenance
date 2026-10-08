import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function ManageTechnicians() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechs = async () => {
      try {
        const res = await api.get('/technicians');
        setTechnicians(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTechs();
  }, []);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">Registered Field Technicians</h2>
          <p className="text-muted small mb-0">Certified maintenance personnel eligible for automated proximity dispatching.</p>
        </div>
      </div>

      <div className="card-custom">
        <div className="card-header-custom">
          <span>Technicians ({technicians.length})</span>
        </div>
        <div className="card-body-custom p-0">
          {loading ? (
            <div className="p-4 text-center">Loading technicians...</div>
          ) : technicians.length === 0 ? (
            <div className="p-4 text-center text-muted">No technicians registered yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Technician Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Base Location Address</th>
                    <th>GPS Coordinates</th>
                    <th>Total Assigned</th>
                    <th>Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {technicians.map((tech) => (
                    <tr key={tech.technician_id}>
                      <td className="fw-semibold">#{tech.technician_id}</td>
                      <td>
                        <span className="fw-bold text-dark">{tech.name}</span>
                      </td>
                      <td>{tech.email}</td>
                      <td>{tech.phone}</td>
                      <td style={{ maxWidth: '200px' }}>{tech.address}</td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {Number(tech.latitude).toFixed(4)}, {Number(tech.longitude).toFixed(4)}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-secondary">{tech.total_tasks}</span>
                      </td>
                      <td>
                        <span className="badge bg-success">{tech.completed_tasks}</span>
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
