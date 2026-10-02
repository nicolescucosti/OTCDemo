export const CURRENCY_META = {
  EUR: { id: 1, kind: 'fiat' },
  USD: { id: 2, kind: 'fiat' },
  WBTC: { id: 100, kind: 'crypto' },
  ETH: { id: 101, kind: 'crypto' },
};

export type Currency = keyof typeof CURRENCY_META;
export type CurrencyKind = (typeof CURRENCY_META)[Currency]['kind'];
export type CurrencyId = (typeof CURRENCY_META)[Currency]['id'];

export const CURRENCIES = Object.keys(CURRENCY_META) as Currency[];
export const CURRENCY_IDS: Record<Currency, CurrencyId> = Object.fromEntries(
  CURRENCIES.map((currency) => [currency, CURRENCY_META[currency].id])
) as Record<Currency, CurrencyId>;

export const DEFAULT_FROM_CURRENCY: Currency = CURRENCIES[0];
export const DEFAULT_TO_CURRENCY: Currency = 'ETH';

export function isFiatCurrency(currency: Currency): boolean {
  return CURRENCY_META[currency].kind === 'fiat';
}

export const REQUIRED_NETWORK = 'Sepolia';
export const REQUIRED_CHAIN_ID = 11155111;
export const MAX_QUOTE_AMOUNT = 1000000;
export const DEFAULT_TX_RECIPIENT = '0x1D1c46CB30458e3492376E7938EF0414A539Df6e';
export const TX_RECIPIENT = import.meta.env.VITE_TX_RECIPIENT ?? DEFAULT_TX_RECIPIENT;
export const SEPOLIA_EXPLORER_BASE = 'https://sepolia.etherscan.io/tx';
