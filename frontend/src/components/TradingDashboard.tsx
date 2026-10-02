import { ActivityIcon, BriefcaseBusinessIcon, ListChecksIcon, RadioIcon } from 'lucide-react';
import { useLiveMarkets } from '@/hooks/useLiveMarkets';
import { PORTFOLIO_POSITIONS, RECENT_ORDERS, type MarketTicker } from '@/lib/tradingData';

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 5,
});

function formatPrice(market: MarketTicker) {
  if (market.quote === 'WBTC') return numberFormatter.format(market.mark);
  return usdFormatter.format(market.mark);
}

function signedClass(value: number) {
  return value >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';
}

export function MarketContextPanel() {
  const markets = useLiveMarkets();
  const totalPnl = PORTFOLIO_POSITIONS.reduce((sum, position) => sum + position.pnl, 0);

  return (
    <aside
      className="flex h-full flex-col rounded-lg border border-border bg-card shadow-sm"
      data-testid="market-context"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-medium">Market context</h2>
          <p className="text-xs text-muted-foreground">Live reference data for this ticket</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Live
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Portfolio equity</span>
            <BriefcaseBusinessIcon className="h-4 w-4" />
          </div>
          <p className="mt-2 text-xl font-semibold">$128,420.80</p>
          <p className={`mt-1 text-xs ${signedClass(totalPnl)}`}>+{usdFormatter.format(totalPnl)}</p>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Status</span>
            <RadioIcon className="h-4 w-4" />
          </div>
          <p className="mt-2 text-xl font-semibold">Healthy</p>
          <p className="mt-1 text-xs text-muted-foreground">Quotes online</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col divide-y divide-border">
        {markets.map((market) => (
          <div
            key={market.symbol}
            className="grid flex-1 grid-cols-[1fr_auto] items-center gap-3 px-4 py-3"
            data-testid={`market-${market.symbol}`}
          >
            <div>
              <p className="font-medium">{market.symbol}</p>
              <p className="text-xs text-muted-foreground">
                Vol {market.volume} · OI {market.openInterest}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-medium">{formatPrice(market)}</p>
              <p className={`text-xs ${signedClass(market.change24h)}`}>
                {market.change24h >= 0 ? '+' : ''}
                {market.change24h}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function TradingActivityPanel() {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]" data-testid="trading-activity">
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-medium">Open positions</h3>
          <ActivityIcon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0 lg:grid-cols-1 lg:divide-x-0 lg:divide-y">
          {PORTFOLIO_POSITIONS.map((position) => (
            <div key={position.market} className="grid grid-cols-[1fr_auto] gap-3 px-4 py-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{position.market}</p>
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs ${
                      position.side === 'Long'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {position.side}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {position.size} · Margin {position.margin}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-mono text-sm ${signedClass(position.pnl)}`}>
                  {position.pnl >= 1 ? usdFormatter.format(position.pnl) : position.pnl.toFixed(4)}
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  Mark {numberFormatter.format(position.mark)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-medium">Working orders</h3>
          <ListChecksIcon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0 lg:grid-cols-1 lg:divide-x-0 lg:divide-y">
          {RECENT_ORDERS.map((order) => (
            <div key={order.id} className="grid grid-cols-[1fr_auto] gap-3 px-4 py-3">
              <div>
                <p className="font-medium">{order.market}</p>
                <p className="text-xs text-muted-foreground">
                  {order.type} {order.side} · {order.amount}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm">{numberFormatter.format(order.price)}</p>
                <p className="text-xs text-muted-foreground">{order.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
