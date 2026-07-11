export const StatusBadge = ({ quantity, threshold = 50 }) => {
  const numericQuantity = Number(quantity) || 0;
  const status = numericQuantity > threshold ? 'healthy' : numericQuantity > 0 ? 'warning' : 'critical';

  const styles = {
    healthy: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-200 border-amber-500/30',
    critical: 'bg-rose-500/20 text-rose-200 border-rose-500/30'
  };

  const labels = {
    healthy: 'Healthy',
    warning: 'Low',
    critical: 'Out'
  };

  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
};

export default StatusBadge;
