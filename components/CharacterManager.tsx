
import React from 'react';
import { ESICharacter, WalletEntry } from '../types';
import { initiateLogin, fetchWalletJournal } from '../utils/esi';

interface Props {
  characters: ESICharacter[];
  onSync: (entries: WalletEntry[]) => void;
  onRemove: (id: number) => void;
}

const CharacterManager: React.FC<Props> = ({ characters, onSync, onRemove }) => {
  const [loadingId, setLoadingId] = React.useState<number | null>(null);

  const handleSync = async (char: ESICharacter) => {
    setLoadingId(char.characterId);
    try {
      const entries = await fetchWalletJournal(char.characterId, char.accessToken);
      onSync(entries);
    } catch (err) {
      alert('同步失败，请检查登录状态或权限。');
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-[#1a1f2e] p-6 rounded-2xl border border-gray-800 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">ESI 角色集成</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">直接从服务器同步</p>
        </div>
        <button
          onClick={initiateLogin}
          className="w-full sm:w-auto bg-[#F2A900] hover:bg-[#FFB700] text-black font-bold py-2.5 px-5 rounded-lg flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-yellow-900/20 group"
        >
          <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
          </svg>
          <span className="whitespace-nowrap">连接 EVE 角色</span>
        </button>
      </div>

      <div className="space-y-3">
        {characters.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-gray-800 rounded-xl bg-[#0f172a]/50">
            <svg className="w-10 h-10 text-gray-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p className="text-gray-600 text-sm">暂未连接任何角色</p>
          </div>
        ) : (
          characters.map(char => (
            <div key={char.characterId} className="flex items-center justify-between p-4 bg-[#0f172a] rounded-xl border border-gray-800 group hover:border-gray-600 transition-all">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img 
                    src={`https://images.evetech.net/characters/${char.characterId}/portrait?size=64`} 
                    alt={char.name} 
                    className="w-12 h-12 rounded-lg border border-gray-700 bg-black"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.evetech.net/characters/1/portrait?size=64';
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#0f172a] rounded-full"></div>
                </div>
                <div>
                  <div className="text-gray-200 font-bold">{char.name}</div>
                  <div className="text-[10px] text-gray-500 font-mono">ID: {char.characterId}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSync(char)}
                  disabled={loadingId === char.characterId}
                  className="p-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center min-w-[36px]"
                  title="同步钱包"
                >
                  {loadingId === char.characterId ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  )}
                </button>
                <button
                  onClick={() => onRemove(char.characterId)}
                  className="p-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="移除角色"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CharacterManager;
