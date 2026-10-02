# OTC Demo

Small portfolio project showing a React + TypeScript quote flow with a local
mock API and a Sepolia MetaMask send flow.

## Structure

```text
api/       Minimal local Quotes API mock
frontend/  React + TypeScript frontend
```

## Run Locally

Start the mock API:

```bash
cd api
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

The frontend expects:

```env
VITE_API_BASE_URL=http://127.0.0.1:5001
```

## API

- `GET /api/v1/Quotes?from=<currencyId>&to=<currencyId>`
- `GET /swagger`
- `GET /swagger.json`

Currency IDs:

- `EUR = 1`
- `USD = 2`
- `WBTC = 100`
- `ETH = 101`

## Frontend Highlights

- React 19 + TypeScript + Vite
- TanStack Query for quote fetching
- Wagmi/Viem + MetaMask integration
- Sepolia network enforcement for send flow
- Theme switching
- API and wallet error normalization
- Stable `data-testid` attributes for automation-friendly flows

## Demo Limitations

- Quote rates are deterministic mock values.
- On-chain sends use native Sepolia ETH only.
