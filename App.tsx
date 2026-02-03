
import React, { useState, useCallback, useMemo } from 'react';
import { WalletEntry } from './types';
import { parseWalletLogs } from './utils/parser';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import { translations, getInitialLanguage, Language } from './utils/i18n';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(getInitialLanguage());
  const t = useMemo(() => translations[lang], [lang]);

  const [inputText, setInputText] = useState('');
  const [entries, setEntries] = useState<WalletEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'input' | 'dashboard' | 'calendar' | 'logs'>('input');

  const handleProcessLogs = useCallback(() => {
    if (!inputText.trim()) return;
    const parsed = parseWalletLogs(inputText, t);
    setEntries(prev => {
      const combined = [...prev, ...parsed];
      const seenIds = new Set();
      const unique = combined.filter(item => {
        const duplicate = seenIds.has(item.id);
        seenIds.add(item.id);
        return !duplicate;
      });
      return unique.sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
    });
    setActiveTab('dashboard');
  }, [inputText, t]);

  const handleClear = () => {
    setInputText('');
    setEntries([]);
    setActiveTab('input');
  };

  const toggleLang = () => {
    const next = lang === 'zh' ? 'en' : 'zh';
    setLang(next);
    localStorage.setItem('eve_ledger_lang', next);
  };

  return (
    <div className="min-h-screen pb-12 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0b0e14]/80 backdrop-blur-md border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7"/><path d="M16 19h6"/><path d="M19 16v6"/><path d="M7 10h1v1H7z"/><path d="M11 10h1v1h-1z"/><path d="M15 10h1v1h-1z"/><path d="M7 14h1v1H7z"/><path d="M11 14h1v1h-1z"/><path d="M15 14h1v1h-1z"/></svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight text-white">{t.title}</h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex bg-[#1a1f2e] p-1 rounded-lg border border-gray-700">
              {[
                { id: 'input', label: t.tabs.input },
                { id: 'dashboard', label: t.tabs.dashboard },
                { id: 'calendar', label: t.tabs.calendar },
                { id: 'logs', label: t.tabs.logs }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => (entries.length > 0 || tab.id === 'input') && setActiveTab(tab.id as any)}
                  disabled={entries.length === 0 && tab.id !== 'input'}
                  className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={toggleLang}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-gray-700 bg-[#1a1f2e] hover:bg-gray-800 text-gray-400 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span>{t.langName}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8">
        {activeTab === 'input' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-[#1a1f2e] p-8 rounded-2xl border border-gray-800 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">{t.input.title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {t.input.desc}
                </p>
              </div>
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.input.placeholder}
                className="w-full h-96 bg-[#0f172a] border border-gray-700 rounded-xl p-4 text-sm font-mono focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none placeholder:text-gray-600 text-gray-300"
              />

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleProcessLogs}
                  disabled={!inputText.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg active:scale-[0.98]"
                >
                  {t.input.processBtn}
                </button>
                <button
                  onClick={handleClear}
                  className="px-6 py-3 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-200 rounded-xl transition-all"
                >
                  {t.input.clearBtn}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">{t.input.localTip}</h4>
                <p className="text-xs text-gray-500">{t.input.localDesc}</p>
              </div>
              <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">{t.input.multiCharTip}</h4>
                <p className="text-xs text-gray-500">{t.input.multiCharDesc}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && <Dashboard entries={entries} t={t} />}
        {activeTab === 'calendar' && <CalendarView entries={entries} t={t} />}

        {activeTab === 'logs' && (
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4">
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-200">{t.logs.title}</h3>
              <span className="text-sm text-gray-500">{entries.length} {t.logs.count}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#121622] text-gray-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">{t.logs.time}</th>
                    <th className="px-6 py-3">{t.logs.type}</th>
                    <th className="px-6 py-3">{t.logs.character}</th>
                    <th className="px-6 py-3 text-right">{t.logs.amount}</th>
                    <th className="px-6 py-3">{t.logs.description}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-[#252b3d] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-300 font-medium">{entry.date}</div>
                        <div className="text-gray-500 text-xs">{entry.time}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-800 px-2 py-0.5 rounded text-[10px] font-bold text-gray-400 uppercase tracking-tight">{entry.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-400">{entry.character}</span>
                      </td>
                      <td className={`px-6 py-4 text-right font-mono font-bold ${entry.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {entry.amount > 0 ? '+' : ''}{entry.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{entry.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto border-t border-gray-800 py-6 px-6 text-center text-gray-600 text-[10px] uppercase tracking-widest font-bold">
        <p>© 2026 EVE Online Financial Intelligence Tool</p>
      </footer>
    </div>
  );
};

export default App;
