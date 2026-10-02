import { createServer } from 'node:http';

const PORT = Number(process.env.PORT ?? 5001);
const HOST = process.env.HOST ?? '127.0.0.1';

const currencies = {
  1: { code: 'EUR', kind: 'fiat' },
  2: { code: 'USD', kind: 'fiat' },
  100: { code: 'WBTC', kind: 'crypto' },
  101: { code: 'ETH', kind: 'crypto' },
};

const rates = {
  '1-100': 0.000025,
  '1-101': 0.00027,
  '2-100': 0.000027,
  '2-101': 0.00029,
  '100-1': 40000,
  '100-2': 37000,
  '100-101': 10.8,
  '101-1': 3700,
  '101-2': 3450,
  '101-100': 0.0925,
};

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'OTC Demo Mock API',
    version: '0.1.0',
    description: 'Small local mock API used by the frontend portfolio demo.',
  },
  paths: {
    '/api/v1/Quotes': {
      get: {
        summary: 'Get a deterministic exchange rate',
        parameters: [
          {
            name: 'from',
            in: 'query',
            required: true,
            schema: { type: 'integer', enum: [1, 2, 100, 101] },
          },
          {
            name: 'to',
            in: 'query',
            required: true,
            schema: { type: 'integer', enum: [1, 2, 100, 101] },
          },
        ],
        responses: {
          200: {
            description: 'Quote response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        exchangeRate: { type: 'number' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: 'Invalid currency pair' },
        },
      },
    },
  },
};

function sendJson(res, status, body) {
  const payload = JSON.stringify(body, null, 2);
  res.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

function sendHtml(res, status, body) {
  res.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function sendOptions(res) {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end();
}

function getQuote(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const from = Number(url.searchParams.get('from'));
  const to = Number(url.searchParams.get('to'));
  const fromCurrency = currencies[from];
  const toCurrency = currencies[to];

  if (!fromCurrency || !toCurrency) {
    sendJson(res, 400, {
      message: 'Unknown currency id. Supported ids are 1, 2, 100 and 101.',
    });
    return;
  }

  if (from === to) {
    sendJson(res, 400, {
      message: 'From and to currencies must be different.',
    });
    return;
  }

  if (fromCurrency.kind === 'fiat' && toCurrency.kind === 'fiat') {
    sendJson(res, 400, {
      message: 'FIAT to FIAT quotes are not supported in this demo.',
    });
    return;
  }

  const exchangeRate = rates[`${from}-${to}`];
  if (!exchangeRate) {
    sendJson(res, 404, {
      message: `No quote configured for ${fromCurrency.code} to ${toCurrency.code}.`,
    });
    return;
  }

  sendJson(res, 200, {
    data: {
      exchangeRate,
      from: fromCurrency.code,
      to: toCurrency.code,
    },
  });
}

function getSwaggerPage(req, res) {
  const origin = `http://${req.headers.host}`;
  sendHtml(
    res,
    200,
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>OTC Demo Mock API</title>
    <style>
      body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 2rem; line-height: 1.5; color: #172033; }
      code, pre { background: #f3f5f7; border-radius: 6px; }
      code { padding: 0.125rem 0.25rem; }
      pre { padding: 1rem; overflow: auto; }
      a { color: #2563eb; }
    </style>
  </head>
  <body>
    <h1>OTC Demo Mock API</h1>
    <p>Local deterministic quote service for the frontend demo.</p>
    <h2>Endpoint</h2>
    <pre>GET /api/v1/Quotes?from=&lt;currencyId&gt;&amp;to=&lt;currencyId&gt;</pre>
    <h2>Try it</h2>
    <ul>
      <li><a href="${origin}/api/v1/Quotes?from=1&to=101">EUR to ETH</a></li>
      <li><a href="${origin}/api/v1/Quotes?from=2&to=100">USD to WBTC</a></li>
      <li><a href="${origin}/api/v1/Quotes?from=101&to=1">ETH to EUR</a></li>
    </ul>
    <h2>OpenAPI JSON</h2>
    <p><a href="${origin}/swagger.json">/swagger.json</a></p>
  </body>
</html>`
  );
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    sendOptions(res);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/v1/Quotes') {
    getQuote(req, res);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/swagger') {
    getSwaggerPage(req, res);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/swagger.json') {
    sendJson(res, 200, swaggerDocument);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    sendJson(res, 200, { status: 'ok' });
    return;
  }

  sendJson(res, 404, { message: 'Not found.' });
});

server.listen(PORT, HOST, () => {
  console.log(`OTC demo mock API running at http://${HOST}:${PORT}`);
  console.log(`Swagger docs: http://${HOST}:${PORT}/swagger`);
});
