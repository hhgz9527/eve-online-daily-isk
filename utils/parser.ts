
import { WalletEntry } from '../types';

export const parseWalletLogs = (rawText: string, t: any): WalletEntry[] => {
  const lines = rawText.split('\n').filter(line => line.trim().length > 0);
  const entries: WalletEntry[] = [];

  const regex = /^(\d{4}\.\d{2}\.\d{2})\s+(\d{2}:\d{2})\s+([^\t]+)\s+([-]?[\d,]+)\s+(?:星币|ISK)\s+([\d,]+)\s+(?:星币|ISK)\s*(.*)$/i;

  lines.forEach((line, index) => {
    const match = line.trim().match(regex);
    if (match) {
      const [_, date, time, type, amountStr, balanceStr, description] = match;
      
      const amount = parseInt(amountStr.replace(/,/g, ''), 10);
      const balance = parseInt(balanceStr.replace(/,/g, ''), 10);
      
      let character = t.common.unknownChar;
      const charPatterns = [
        /(?:给|由|到)\s*([a-zA-Z0-9\u4e00-\u9fa5\s]+?)(?:\s|支付|转移|的|$)/,
        /(?:To|By|From)\s*([a-zA-Z0-9\s]+?)(?:\s|$)/i
      ];

      for (const pattern of charPatterns) {
        const charMatch = description.match(pattern);
        if (charMatch && charMatch[1] && charMatch[1].trim().length > 1) {
          character = charMatch[1].trim();
          break;
        }
      }

      entries.push({
        id: `${date}-${time}-${index}-${amount}`,
        date,
        time,
        type,
        amount,
        balance,
        description,
        character
      });
    }
  });

  return entries;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' ISK';
};
