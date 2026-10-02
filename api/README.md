# OTC Demo Mock API

Minimal local API used by the frontend portfolio demo. It intentionally uses
hardcoded deterministic rates so the frontend can run without private services
or third-party API keys.

## Run

```bash
npm run dev
```

The API starts on:

```text
http://127.0.0.1:5001
```

Change the port if needed:

```bash
PORT=5002 npm run dev
```

## Endpoints

- `GET /api/v1/Quotes?from=<currencyId>&to=<currencyId>`
- `GET /swagger`
- `GET /swagger.json`
- `GET /health`

## Currency IDs

- `EUR = 1`
- `USD = 2`
- `WBTC = 100`
- `ETH = 101`

Example:

```bash
curl "http://127.0.0.1:5001/api/v1/Quotes?from=1&to=101"
```

Response:

```json
{
  "data": {
    "exchangeRate": 0.00027,
    "from": "EUR",
    "to": "ETH"
  }
}
```
