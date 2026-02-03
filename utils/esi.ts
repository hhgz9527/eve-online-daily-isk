
import { WalletEntry } from '../types';

const CLIENT_ID = 'f3aee1c2190e4bf5a05b49e214f43de2'; // 实际部署时需替换为开发者平台申请的 ClientID
const REDIRECT_URI = window.location.origin + window.location.pathname;
const SCOPES = 'esi-wallet.read_character_wallet.v1';

// PKCE Helpers
const generateRandomString = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
};

const base64urlencode = (a: ArrayBuffer) => {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(a) as any))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export const initiateLogin = async () => {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = base64urlencode(await sha256(codeVerifier));
  
  localStorage.setItem('eve_code_verifier', codeVerifier);
  
  const authUrl = new URL('https://login.eveonline.com/v2/oauth/authorize/');
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('client_id', CLIENT_ID);
  authUrl.searchParams.append('scope', SCOPES);
  authUrl.searchParams.append('code_challenge', codeChallenge);
  authUrl.searchParams.append('code_challenge_method', 'S256');
  authUrl.searchParams.append('state', generateRandomString(16));
  
  window.location.href = authUrl.toString();
};

export const fetchWalletJournal = async (characterId: number, token: string): Promise<WalletEntry[]> => {
  const response = await fetch(`https://esi.evetech.net/latest/characters/${characterId}/wallet/journal/`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) throw new Error('ESI request failed');
  
  const data = await response.json();
  
  return data.map((item: any) => {
    const d = new Date(item.date);
    return {
      id: item.id.toString(),
      date: d.toISOString().split('T')[0].replace(/-/g, '.'),
      time: d.toTimeString().slice(0, 5),
      type: item.ref_type.replace(/_/g, ' '),
      amount: item.amount || 0,
      balance: item.balance || 0,
      description: item.description || '',
      character: `Character_${characterId}` // 实际可通过 info 接口获取
    };
  });
};
