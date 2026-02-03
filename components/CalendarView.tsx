
import React, { useMemo, useState } from 'react';
import { WalletEntry } from '../types';

interface CalendarViewProps {
  entries: WalletEntry[];
  t: any;
}

const CalendarView: React.FC<CalendarViewProps> = ({ entries, t }) => {
  const dailyNets = useMemo(() => {
    const map = new Map<string, number>();
    entries.forEach(entry => {
      map.set(entry.date, (map.get(entry.date) || 0) + entry.amount);
    });
    return map;
  }, [entries]);

  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    entries.forEach(entry => {
      const [year, month] = entry.date.split('.');
      monthsSet.add(`${year}-${month}`);
    });
    return Array.from(monthsSet).sort();
  }, [entries]);

  const [currentMonthStr, setCurrentMonthStr] = useState(
    availableMonths.length > 0 ? availableMonths[availableMonths.length - 1] : new Date().toISOString().slice(0, 7)
  );

  const [viewYear, viewMonth] = useMemo(() => {
    const [y, m] = currentMonthStr.split('-').map(Number);
    return [y, m];
  }, [currentMonthStr]);

  const daysInMonth = useMemo(() => {
    const lastDay = new Date(viewYear, viewMonth, 0).getDate();
    const firstDayOfWeek = new Date(viewYear, viewMonth - 1, 1).getDay();
    
    const days = [];
    const padding = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    for (let i = 0; i < padding; i++) {
      days.push(null);
    }
    for (let i = 1; i <= lastDay; i++) {
      days.push(i);
    }
    return days;
  }, [viewYear, viewMonth]);

  const formatAmount = (amt: number) => {
    const abs = Math.abs(amt);
    if (abs >= 1_000_000_000) return (amt / 1_000_000_000).toFixed(1) + 'B';
    if (abs >= 1_000_000) return (amt / 1_000_000).toFixed(1) + 'M';
    if (abs >= 1_000) return (amt / 1_000).toFixed(1) + 'K';
    return amt.toString();
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonthStr(e.target.value);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex justify-between items-center bg-[#1a1f2e] p-4 rounded-xl border border-gray-800 shadow-lg">
        <h2 className="text-xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          {t.calendar.title}
        </h2>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-500">{t.calendar.selectMonth}:</label>
          <select 
            value={currentMonthStr} 
            onChange={handleMonthChange}
            className="bg-[#0f172a] border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none"
          >
            {availableMonths.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-[#1a1f2e] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-800 bg-[#121622]">
          {t.calendar.weekdays.map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-widest border-r border-gray-800 last:border-0">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 border-r border-gray-800">
          {daysInMonth.map((day, idx) => {
            const dateStr = day ? `${viewYear}.${String(viewMonth).padStart(2, '0')}.${String(day).padStart(2, '0')}` : null;
            const net = dateStr ? dailyNets.get(dateStr) : null;
            
            return (
              <div 
                key={idx} 
                className={`min-h-[120px] p-2 border-b border-l border-gray-800 relative group transition-colors ${day ? 'hover:bg-[#252b3d]/50' : 'bg-[#0f172a]/20'}`}
              >
                {day && (
                  <>
                    <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-300">{day}</span>
                    {net !== undefined && net !== null && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-1">
                        <div className={`text-sm font-bold truncate w-full text-center ${net >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {net > 0 ? '+' : ''}{formatAmount(net)}
                        </div>
                        <div className="text-[10px] text-gray-600 uppercase font-mono mt-1">
                          ISK
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-blue-900/10 border border-blue-900/20 p-4 rounded-xl">
        <p className="text-xs text-blue-400 leading-relaxed">
          <strong>{t.calendar.tipTitle}</strong> {t.calendar.tipDesc}
        </p>
      </div>
    </div>
  );
};

export default CalendarView;
