import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getCurrencyPairError, validateQuoteForm } from './quoteValidation.ts';

describe('quote validation', () => {
  it('rejects empty, zero, and negative amounts', () => {
    assert.equal(validateQuoteForm({ from: 'EUR', to: 'ETH', amount: '' }).amount, 'Amount must be greater than 0');
    assert.equal(validateQuoteForm({ from: 'EUR', to: 'ETH', amount: '0' }).amount, 'Amount must be greater than 0');
    assert.equal(validateQuoteForm({ from: 'EUR', to: 'ETH', amount: '-1' }).amount, 'Amount must be greater than 0');
  });

  it('rejects amounts over the configured maximum', () => {
    assert.equal(
      validateQuoteForm({ from: 'EUR', to: 'ETH', amount: '1000001' }).amount,
      'Amount must be less than or equal to 1000000'
    );
  });

  it('allows a valid fiat to crypto quote amount', () => {
    assert.deepEqual(validateQuoteForm({ from: 'EUR', to: 'ETH', amount: '2500' }), {});
  });

  it('rejects unsupported currency pairs', () => {
    assert.equal(
      getCurrencyPairError({ from: 'EUR', to: 'EUR', amount: '100' }),
      'From and To currencies must be different'
    );
    assert.equal(
      getCurrencyPairError({ from: 'EUR', to: 'USD', amount: '100' }),
      'Transfers between FIAT currencies are not allowed. Select at least one crypto currency.'
    );
  });

  it('allows fiat to crypto and crypto to crypto pairs', () => {
    assert.equal(getCurrencyPairError({ from: 'EUR', to: 'ETH', amount: '100' }), null);
    assert.equal(getCurrencyPairError({ from: 'ETH', to: 'WBTC', amount: '1' }), null);
  });
});
