import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import AnimatedNumber from './AnimatedNumber.jsx';

const palettes = {
  indigo: { card: 'from-indigo-500/20 to-cyan-500/20', stroke: '#67e8f9', fill: '#6366f1' },
  emerald: { card: 'from-emerald-500/20 to-teal-500/20', stroke: '#5eead4', fill: '#10b981' },
  amber: { card: 'from-amber-500/20 to-orange-500/20', stroke: '#fcd34d', fill: '#f59e0b' },
  rose: { card: 'from-rose-500/20 to-pink-500/20', stroke: '#fda4af', fill: '#f43f5e' }
};

const EnhancedStatCard = ({ title, value, trend = [], color = 'indigo', prefix = '₹' }) => {
  const theme = palettes[color] || palettes.indigo;

  return (
    <div className={`rounded-2xl border border-white/20 bg-gradient-to-br ${theme.card} p-5 shadow-xl backdrop-blur`}>
      <p className="text-sm text-slate-200">{title}</p>
      <p className="mt-1 text-3xl font-bold text-white">
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
