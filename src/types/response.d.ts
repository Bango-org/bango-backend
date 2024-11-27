export interface TokenResponse {
  token: string;
  expires: Date;
}

export interface AuthTokensResponse {
  access: TokenResponse;
  refresh?: TokenResponse;
}


export type TimePeriod = '1h' | '1d' | '1m' | '1y' | 'all';


export interface TradeGraphData {
  timestamp: Date;
  avgPrice: number;
  totalVolume: number;
  totalAmount: number;
  buyCount: number;
  sellCount: number;
  totalTrades: number;
}
