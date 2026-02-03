
import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';
import { WalletEntry, DailySummary, CharacterSummary } from '../types';
import { formatCurrency } from '../utils/parser';

interface DashboardProps {
  entries: WalletEntry[];
  t: any;
}

const Dashboard: React.FC<DashboardProps> = ({ entries, t }) => {
  const dailyData = useMemo(() => {
    const map = new Map<string, DailySummary>();
    
    entries.forEach(entry => {
      const current = map.get(entry.date) || { date: entry.date, income: 0, expense: 0, net: 0 };
      if (entry.amount > 0) {
        current.income += entry.amount;
      } else {
        current.expense += Math.abs(entry.amount);
      }
      current.net += entry.amount;
      map.set(entry.date, current);
    });

    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [entries]);

  const totals = useMemo(() => {
    return entries.reduce((acc, curr) => {
      if (curr.amount > 0) acc.income += curr.amount;
      else acc.expense += Math.abs(curr.amount);
      acc.net += curr.amount;
      return acc;
    }, { income: 0, expense: 0, net: 0 });
  }, [entries]);

  const charData = useMemo(() => {
    const map = new Map<string, CharacterSummary>();
    entries.forEach(entry => {
      const current = map.get(entry.character) || { name: entry.character, totalIncome: 0, totalExpense: 0, net: 0 };
      if (entry.amount > 0) current.totalIncome += entry.amount;
      else current.totalExpense += Math.abs(entry.amount);
      current.net += entry.amount;
      map.set(entry.character, current);
    });
    return Array.from(map.values()).sort((a, b) => b.net - a.net);
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1a1f2e] border border-green-900/30 p-6 rounded-xl shadow-lg">
          <p className="text-sm text-gray-400 mb-1">{t.dashboard.income}</p>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(totals.income)}</p>
        </div>
        <div className="bg-[#1a1f2e] border border-red-900/30 p-6 rounded-xl shadow-lg">
          <p className="text-sm text-gray-400 mb-1">{t.dashboard.expense}</p>
          <p className="text-2xl font-bold text-red-400">{formatCurrency(totals.expense)}</p>
        </div>
        <div className="bg-[#1a1f2e] border border-blue-900/30 p-6 rounded-xl shadow-lg">
          <p className="text-sm text-gray-400 mb-1">{t.dashboard.net}</p>
          <p className={`text-2xl font-bold ${totals.net >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
            {formatCurrency(totals.net)}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1f2e] p-6 rounded-xl border border-gray-800 shadow-xl">
          <h3 className="text-lg font-semibold mb-6 text-gray-200">{t.dashboard.trendTitle}</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => val.slice(5)} />
                <YAxis stroke="#94a3b8" fontSize={10} width={80} tickFormatter={(val) => (val / 1000000).toFixed(0) + 'M'} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                  formatter={(val: number) => formatCurrency(val)}
                />
                <Legend />
                <Bar name={t.dashboard.incomeLabel} dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar name={t.dashboard.expenseLabel} dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1a1f2e] p-6 rounded-xl border border-gray-800 shadow-xl">
          <h3 className="text-lg font-semibold mb-6 text-gray-200">{t.dashboard.netTitle}</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => val.slice(5)} />
                <YAxis stroke="#94a3b8" fontSize={10} width={80} tickFormatter={(val) => (val / 1000000).toFixed(0) + 'M'} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                  formatter={(val: number) => formatCurrency(val)}
                />
                <Line name={t.dashboard.netLabel} type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Character Breakdown Table */}
      <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-gray-200">{t.dashboard.charTitle}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#121622] text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">{t.dashboard.tableChar}</th>
                <th className="px-6 py-3">{t.dashboard.tableIncome}</th>
                <th className="px-6 py-3">{t.dashboard.tableExpense}</th>
                <th className="px-6 py-3">{t.dashboard.tableNet}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {charData.map((char, i) => (
                <tr key={i} className="hover:bg-[#252b3d] transition-colors">
                  <td className="px-6 py-4 font-medium">{char.name}</td>
                  <td className="px-6 py-4 text-green-400">{formatCurrency(char.totalIncome)}</td>
                  <td className="px-6 py-4 text-red-400">{formatCurrency(char.totalExpense)}</td>
                  <td className={`px-6 py-4 font-semibold ${char.net >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                    {formatCurrency(char.net)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
