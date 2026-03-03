import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import AnimatedNumber from './AnimatedNumber.jsx';

const palettes = {
  indigo: { card: 'from-blue-50 to-white', stroke: '#3b82f6', fill: '#60a5fa' },
  emerald: { card: 'from-emerald-50 to-white', stroke: '#10b981', fill: '#34d399' },
  amber: { card: 'from-amber-50 to-white', stroke: '#f59e0b', fill: '#fbbf24' },
  rose: { card: 'from-rose-50 to-white', stroke: '#f43f5e', fill: '#fb7185' }
};

const EnhancedStatCard = ({ title, value, trend = [], color = 'indigo', prefix = '₹' }) => {
  const theme = palettes[color] || palettes.indigo;

  return (
    <div className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${theme.card} p-5 shadow-sm`}>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-1 text-3xl font-bold text-slate-800">
        <AnimatedNumber value={value} prefix={prefix} />
      </p>
      <div className="mt-4 h-14">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend}>
            <Area type="monotone" dataKey="value" stroke={theme.stroke} fill={theme.fill} fillOpacity={0.3} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EnhancedStatCard;
