export default function StatsCard({ label, value, variant = 'primary' }) {
  return (
    <div className={`stat-card ${variant}`}>
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="stat-label">{label}</span>
      </div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
