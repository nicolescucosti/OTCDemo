export interface MarketTicker {
  symbol: string;
  base: string;
  quote: string;
  mark: number;
  change24h: number;
  volume: string;
  openInterest: string;
}

export interface PositionRow {
  market: string;
  side: 'Long' | 'Short';
  size: string;
  entry: number;
  mark: number;
  pnl: number;
  margin: string;
}

export interface OrderRow {
  id: string;
  market: string;
  type: 'Limit' | 'Stop';
  side: 'Buy' | 'Sell';
  price: number;
  amount: string;
  status: 'Open' | 'Partially filled';
}

export const INITIAL_MARKETS: MarketTicker[] = [
  {
    symbol: 'ETH-USD',
    base: 'ETH',
    quote: 'USD',
    mark: 4328.42,
    change24h: 2.18,
    volume: '$842.7M',
    openInterest: '$314.2M',
  },
  {
    symbol: 'WBTC-USD',
    base: 'WBTC',
    quote: 'USD',
    mark: 118420.16,
    change24h: -0.64,
    volume: '$516.9M',
    openInterest: '$228.8M',
  },
  {
    symbol: 'ETH-WBTC',
    base: 'ETH',
    quote: 'WBTC',
    mark: 0.03656,
    change24h: 1.32,
    volume: '2.4K ETH',
    openInterest: '918 ETH',
  },
];

export const PORTFOLIO_POSITIONS: PositionRow[] = [
  {
    market: 'ETH-USD',
    side: 'Long',
    size: '12.4 ETH',
    entry: 4210.5,
    mark: 4328.42,
    pnl: 1462.21,
    margin: '$8,420',
  },
  {
    market: 'WBTC-USD',
    side: 'Short',
    size: '0.84 WBTC',
    entry: 119860.0,
    mark: 118420.16,
    pnl: 1209.47,
    margin: '$14,800',
  },
  {
    market: 'ETH-WBTC',
    side: 'Long',
    size: '38.0 ETH',
    entry: 0.0359,
    mark: 0.03656,
    pnl: 0.0251,
    margin: '0.18 WBTC',
  },
];

export const RECENT_ORDERS: OrderRow[] = [
  {
    id: 'LMT-4829',
    market: 'ETH-USD',
    type: 'Limit',
    side: 'Buy',
    price: 4290,
    amount: '5.0 ETH',
    status: 'Open',
  },
  {
    id: 'STP-1184',
    market: 'WBTC-USD',
    type: 'Stop',
    side: 'Sell',
    price: 116500,
    amount: '0.40 WBTC',
    status: 'Open',
  },
  {
    id: 'LMT-7712',
    market: 'ETH-WBTC',
    type: 'Limit',
    side: 'Buy',
    price: 0.0361,
    amount: '16.0 ETH',
    status: 'Partially filled',
  },
];
