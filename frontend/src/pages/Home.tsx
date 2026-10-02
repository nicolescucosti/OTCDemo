import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CurrencyForm } from '@/components/CurrencyForm';
import { RateResult } from '@/components/RateResult';
import { SendFundsDialog } from '@/components/SendFundsDialog';
import { MarketContextPanel, TradingActivityPanel } from '@/components/TradingDashboard';
import { useWallet } from '@/hooks/useWallet';
import { useExchangeRateQuery } from '@/api/server/queries/useExchangeRateQuery';
import {
  DEFAULT_FROM_CURRENCY,
  DEFAULT_TO_CURRENCY,
  isFiatCurrency,
  MAX_QUOTE_AMOUNT,
} from '@/lib/constants';
import type { CurrencyFormValues } from '@/lib/types';

const initialForm: CurrencyFormValues = {
  from: DEFAULT_FROM_CURRENCY,
  to: DEFAULT_TO_CURRENCY,
  amount: '',
};

function validateForm(
  values: CurrencyFormValues
): Partial<Record<keyof CurrencyFormValues, string>> {
  const errors: Partial<Record<keyof CurrencyFormValues, string>> = {};
  const num = Number(values.amount);
  if (!values.amount.trim() || isNaN(num) || num <= 0) {
    errors.amount = 'Amount must be greater than 0';
  } else if (num > MAX_QUOTE_AMOUNT) {
    errors.amount = `Amount must be less than or equal to ${MAX_QUOTE_AMOUNT}`;
  }
  return errors;
}

export function Home() {
  const wallet = useWallet();
  const [form, setForm] = useState<CurrencyFormValues>(initialForm);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [didAttemptAction, setDidAttemptAction] = useState(false);
  const [touched, setTouched] = useState({ pair: false, amount: false });

  const formErrors = useMemo(() => validateForm(form), [form]);
  const visibleFormErrors = useMemo<Partial<Record<keyof CurrencyFormValues, string>>>(() => {
    const nextErrors: Partial<Record<keyof CurrencyFormValues, string>> = {};
    if ((touched.amount || didAttemptAction) && formErrors.amount) {
      nextErrors.amount = formErrors.amount;
    }
    return nextErrors;
  }, [didAttemptAction, formErrors, touched.amount]);
  const isSameCurrencyPair = form.from === form.to;
  const isFiatToFiatPair = isFiatCurrency(form.from) && isFiatCurrency(form.to);
  const pairErrorMessage = isSameCurrencyPair
    ? 'From and To currencies must be different'
    : isFiatToFiatPair
      ? 'Transfers between FIAT currencies are not allowed. Select at least one crypto currency.'
      : null;
  const visiblePairErrorMessage =
    touched.pair || didAttemptAction ? pairErrorMessage : null;
  const hasVisibleError =
    Object.keys(visibleFormErrors).length > 0 || Boolean(visiblePairErrorMessage);
  const amountNum = Number(form.amount) || 0;
  const hasFormError = Object.keys(formErrors).length > 0 || Boolean(pairErrorMessage);

  const {
    rate,
    isLoading: isRateLoading,
    error: rateError,
    fetchExchangeRate,
  } = useExchangeRateQuery(form.from, form.to);

  const convertedAmount = rate !== null && amountNum > 0 ? amountNum * rate : null;
  const transferAmountInEth =
    form.from === 'ETH'
      ? form.amount
      : form.to === 'ETH' && convertedAmount !== null
        ? String(convertedAmount)
        : null;

  const canSend =
    wallet.isConnected &&
    wallet.isCorrectNetwork &&
    transferAmountInEth !== null &&
    rate !== null &&
    !isRateLoading &&
    !hasFormError;

  const handleFormChange = (next: CurrencyFormValues) => {
    setTouched((prev) => ({
      pair: prev.pair || next.from !== form.from || next.to !== form.to,
      amount: prev.amount || next.amount !== form.amount,
    }));
    setForm(next);
  };

  const handleSwapCurrencies = () => {
    setTouched((prev) => ({ ...prev, pair: true }));
    setForm((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const handleGetRate = async () => {
    setDidAttemptAction(true);
    if (hasFormError) return;
    try {
      await fetchExchangeRate();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch rate';
      toast.error(message);
    }
  };

  return (
    <div
      className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-6"
      data-testid="home-page"
    >
      {wallet.isConnected && !wallet.isCorrectNetwork && (
        <div
          role="alert"
          className="rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200"
          data-testid="home-network-warning"
        >
          Wrong network. Please switch to {wallet.requiredNetwork} to use Send Funds.
        </div>
      )}
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(22rem,0.75fr)] lg:items-stretch">
        <section
          className="rounded-lg border border-border bg-card shadow-sm"
          data-testid="home-section"
        >
          <div className="border-b border-border px-4 py-4 sm:px-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Quote and send</h2>
                <p className="text-sm text-muted-foreground">
                  Price an OTC conversion, then confirm the Sepolia transfer.
                </p>
              </div>
              {wallet.isConnected && (
                <span className="hidden text-xs text-muted-foreground sm:inline lg:hidden">
                  {wallet.address} · {wallet.network}
                </span>
              )}
            </div>
          </div>
          <div className="p-4 sm:p-5">
            <CurrencyForm
              values={form}
              onChange={handleFormChange}
              onSwap={handleSwapCurrencies}
              maxAmount={MAX_QUOTE_AMOUNT}
              errors={visibleFormErrors}
            />
            {visiblePairErrorMessage && (
              <p className="mt-3 text-center text-xs text-destructive" data-testid="pair-error">
                {visiblePairErrorMessage}
              </p>
            )}
            <div className="mt-4">
              <RateResult
                rate={rate}
                convertedAmount={convertedAmount}
                isLoading={isRateLoading}
                error={rateError}
              />
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-border/80 pt-4">
              <Button
                variant="outline"
                onClick={() => setSendDialogOpen(true)}
                disabled={!canSend}
                data-testid="open-send-funds-button"
              >
                Send funds
              </Button>
              <Button
                className="text-white hover:text-white"
                onClick={handleGetRate}
                disabled={isRateLoading || hasVisibleError}
                data-testid="get-rate-button"
              >
                {isRateLoading ? 'Loading...' : 'Get rate and calculate'}
              </Button>
            </div>
            <div className="mt-2 space-y-1 text-right text-xs text-muted-foreground">
              <p data-testid="help-text">Get a fresh quote before sending funds.</p>
            </div>
          </div>
        </section>

          <MarketContextPanel />
        </div>

        <TradingActivityPanel />
      </div>

      <SendFundsDialog
        open={sendDialogOpen}
        onOpenChange={setSendDialogOpen}
        amount={form.amount}
        convertedAmount={convertedAmount}
        fromCurrency={form.from}
        toCurrency={form.to}
        transferAmountInEth={transferAmountInEth}
      />
    </div>
  );
}
