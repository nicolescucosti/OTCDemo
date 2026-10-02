import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiClientError, apiFetch } from '@/api/client';
import { CURRENCY_IDS, type Currency } from '@/lib/constants';
import type { QuotesApiResponse, RateResponse } from '@/lib/types';

const RATE_QUERY_STALE_TIME_MS = 1000;

function rateQueryKey(from: Currency, to: Currency) {
  return ['exchange-rate', { from, to }] as const;
}

async function fetchRate(from: Currency, to: Currency): Promise<RateResponse> {
  const params = new URLSearchParams({
    from: String(CURRENCY_IDS[from]),
    to: String(CURRENCY_IDS[to]),
  });
  const response = await apiFetch<QuotesApiResponse>(`/api/v1/Quotes?${params}`);
  const exchangeRate = response.data?.exchangeRate;
  if (typeof exchangeRate !== 'number' || Number.isNaN(exchangeRate)) {
    throw new ApiClientError('Invalid quote response: exchangeRate is missing.');
  }
  return { rate: exchangeRate };
}

export function useExchangeRateQuery(from: Currency, to: Currency) {
  const queryClient = useQueryClient();
  const queryKey = rateQueryKey(from, to);

  const rateQuery = useQuery({
    queryKey,
    queryFn: () => fetchRate(from, to),
    enabled: false,
    retry: false,
    staleTime: RATE_QUERY_STALE_TIME_MS,
  });

  const fetchExchangeRate = useCallback(async () => {
    await queryClient.fetchQuery({
      queryKey,
      queryFn: () => fetchRate(from, to),
      staleTime: RATE_QUERY_STALE_TIME_MS,
      retry: false,
    });
  }, [from, queryClient, queryKey, to]);

  const resetExchangeRate = useCallback(() => {
    void queryClient.resetQueries({
      queryKey,
      exact: true,
    });
  }, [queryClient, queryKey]);

  return {
    rate: rateQuery.data?.rate ?? null,
    isLoading: rateQuery.isFetching,
    error: rateQuery.error ?? null,
    fetchExchangeRate,
    resetExchangeRate,
  };
}
