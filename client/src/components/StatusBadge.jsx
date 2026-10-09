export default function StatusBadge({ status }) {
  let badgeClass = 'status-valid';

  if (status === 'Expiring Soon' || status === 'Pending') {
    badgeClass = 'status-pending';
  } else if (status === 'Expired') {
    badgeClass = 'status-expired';
  } else if (status === 'In Progress') {
    badgeClass = 'status-inprogress';
  } else if (status === 'Completed' || status === 'Valid') {
    badgeClass = 'status-completed';
  }

  return <span className={`status-badge ${badgeClass}`}>{status}</span>;
}
