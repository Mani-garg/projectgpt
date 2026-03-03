export const StatusBadge = ({ quantity, threshold = 50 }) => {
  const numericQuantity = Number(quantity) || 0;
  const status = numericQuantity > threshold ? 'healthy' : numericQuantity > 0 ? 'warning' : 'critical';

  const styles = {
    healthy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    critical: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  const labels = {
    healthy: 'Healthy',
    warning: 'Low',
    critical: 'Out'
  };

  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
};

export default StatusBadge;
