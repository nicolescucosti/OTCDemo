# OtcDemo Frontend

React + TypeScript frontend for FX quote and Sepolia transfer flows.

## Prerequisites

- Node.js 20+ (recommended)
- npm
- MetaMask browser extension (Chrome/Edge) to connect a wallet
- Access to Sepolia testnet in MetaMask (for send flow)

## Features

- Connect/disconnect wallet from the header.
- Copy connected wallet address from the header.
- Detect wrong network and prompt switching to Sepolia.
- Select currencies (`EUR`, `USD`, `WBTC`, `ETH`) and enter amount.
- Default pair starts with `From=EUR` and `To=ETH`.
- Fetch a **fresh** exchange rate on each "Get rate and calculate" click.
- Validate allowed currency pairs (no FIAT -> FIAT, no identical pair).
- Validate amount range (`> 0` and `<= 1,000,000`).
- Open send dialog and submit on-chain native ETH transfer on Sepolia.
- View transaction hash, status, and Etherscan link after submit.

## Quick Start

1. Start the mock API from the repository root:

```bash
cd api
npm run dev
```

1. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

1. Create your local env file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

1. Confirm `.env` points to your backend:

```env
VITE_API_BASE_URL=http://127.0.0.1:5001
```

1. Start the frontend:

```bash
npm run dev
```

## Backend Quotes API

This frontend fetches rates from the local mock API in `../api`:

- `GET /api/v1/Quotes?from=<currencyId>&to=<currencyId>`

Base URL comes from `VITE_API_BASE_URL`.

Expected successful payload:

```json
{
  "data": {
    "exchangeRate": 0.0000172830717411
  }
}
```

Currency IDs used by the frontend:

- `EUR = 1`
- `USD = 2`
- `WBTC = 100`
- `ETH = 101`

## Scripts


| Command                | Description                    |
| ---------------------- | ------------------------------ |
| `npm run dev`          | Start dev server               |
| `npm run build`        | Production build               |
| `npm run preview`      | Preview production build       |
| `npm run lint`         | Run ESLint                     |
| `npm run lint:fix`     | Fix lint issues where possible |
| `npm run format`       | Format source files            |
| `npm run format:check` | Validate formatting            |


## App Rules (current)

- Currency pair rules:
  - FIAT -> FIAT is blocked
  - FIAT -> CRYPTO and CRYPTO -> CRYPTO are allowed
- Amount must be greater than 0 and less than or equal to 1,000,000.
- "Get rate and calculate" always requests a fresh backend quote.
- Wallet connect requests Sepolia; send flow is enforced on Sepolia.
- On-chain send uses native Sepolia ETH transaction (`value` transfer).
- Send action requires wallet connected on Sepolia and a valid quote.
- Current limitation: non-ETH currencies are quoted only; transfers are native ETH.

## Architecture Notes

- `src/api/client.ts` - shared HTTP client + API error normalization.
- `src/api/server/queries/useExchangeRateQuery.ts` - TanStack Query hook for exchange rates.
- `src/hooks/useWallet.ts` - wallet/connect/network logic.
- `src/hooks/useSendFundsTransaction.ts` - transaction submit + receipt state.
- `src/pages/Home.tsx` - screen composition, validation and user actions.
- `src/components/*` - presentational UI.

## QA Test IDs

Core user flows expose stable `data-testid` attributes (wallet, form fields, rate state, send dialog and actions) to support reliable automation selectors.
