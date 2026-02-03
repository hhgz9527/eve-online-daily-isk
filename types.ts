
export interface WalletEntry {
  id: string;
  date: string;
  time: string;
  type: string;
  amount: number;
  balance: number;
  description: string;
  character: string;
}

export interface DailySummary {
  date: string;
  income: number;
  expense: number;
  net: number;
}

export interface CharacterSummary {
  name: string;
  totalIncome: number;
  totalExpense: number;
  net: number;
}

// Added ESICharacter interface to support ESI-based character management and wallet synchronization
export interface ESICharacter {
  characterId: number;
  name: string;
  accessToken: string;
}
