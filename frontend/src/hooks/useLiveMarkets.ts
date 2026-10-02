import { useEffect, useState } from 'react';
import { INITIAL_MARKETS, type MarketTicker } from '@/lib/tradingData';

function nextMarketTick(markets: MarketTicker[]): MarketTicker[] {
  return markets.map((market, index) => {
    const timestampWave = Math.sin((Date.now() / 1100 + index * 1.7) % Math.PI);
    const drift = timestampWave * (index === 1 ? 0.0009 : 0.0016);
    const nextMark = market.mark * (1 + drift);
    const nextChange = market.change24h + drift * 120;

    return {
      ...market,
      mark: Number(nextMark.toFixed(market.symbol === 'ETH-WBTC' ? 5 : 2)),
      change24h: Number(nextChange.toFixed(2)),
    };
  });
}

export function useLiveMarkets() {
  const [markets, setMarkets] = useState<MarketTicker[]>(INITIAL_MARKETS);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMarkets((current) => nextMarketTick(current));
    }, 1800);

    return () => window.clearInterval(timer);
  }, []);

  return markets;
}
