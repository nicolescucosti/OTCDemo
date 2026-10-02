import { isFiatCurrency, MAX_QUOTE_AMOUNT } from './constants.ts';
import type { CurrencyFormValues } from './types.ts';

export type QuoteFormErrors = Partial<Record<keyof CurrencyFormValues, string>>;

export function validateQuoteForm(values: CurrencyFormValues): QuoteFormErrors {
  const errors: QuoteFormErrors = {};
  const num = Number(values.amount);

  if (!values.amount.trim() || isNaN(num) || num <= 0) {
    errors.amount = 'Amount must be greater than 0';
  } else if (num > MAX_QUOTE_AMOUNT) {
    errors.amount = `Amount must be less than or equal to ${MAX_QUOTE_AMOUNT}`;
  }

  return errors;
}

export function getCurrencyPairError(values: CurrencyFormValues): string | null {
  if (values.from === values.to) {
    return 'From and To currencies must be different';
  }

  if (isFiatCurrency(values.from) && isFiatCurrency(values.to)) {
    return 'Transfers between FIAT currencies are not allowed. Select at least one crypto currency.';
  }

  return null;
}
