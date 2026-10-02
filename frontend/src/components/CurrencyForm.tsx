import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeftRightIcon } from 'lucide-react';
import { CURRENCIES, type Currency } from '@/lib/constants';
import type { CurrencyFormValues } from '@/lib/types';

interface CurrencyFormProps {
  values: CurrencyFormValues;
  onChange: (values: CurrencyFormValues) => void;
  onSwap: () => void;
  maxAmount: number;
  errors?: Partial<Record<keyof CurrencyFormValues, string>>;
}

export function CurrencyForm({ values, onChange, onSwap, maxAmount, errors }: CurrencyFormProps) {
  return (
    <div
      className="space-y-4 rounded-xl border border-border/70 bg-muted/20 p-4"
      data-testid="currency-form"
    >
      <div className="grid gap-x-4 gap-y-2 sm:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)]">
        <div className="space-y-2">
          <Label htmlFor="from">From Currency</Label>
          <Select
            value={values.from}
            onValueChange={(from) => onChange({ ...values, from: from as Currency })}
          >
            <SelectTrigger id="from" className="w-full" data-testid="from-currency-select">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-destructive" data-testid="from-currency-error">
            {errors?.from ?? ''}
          </p>
        </div>
        <div className="flex justify-center py-1 sm:py-0 sm:pt-6">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="rounded-full"
            onClick={onSwap}
            aria-label="Swap from and to currencies"
            data-testid="swap-currencies-button"
          >
            <ArrowLeftRightIcon />
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="to">To Currency</Label>
          <Select
            value={values.to}
            onValueChange={(to) => onChange({ ...values, to: to as Currency })}
          >
            <SelectTrigger id="to" className="w-full" data-testid="to-currency-select">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-destructive" data-testid="to-currency-error">
            {errors?.to ?? ''}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)]">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            max={maxAmount}
            step="any"
            placeholder="0.00"
            value={values.amount}
            onChange={(e) => onChange({ ...values, amount: e.target.value })}
            data-testid="amount-input"
          />
          <p className="min-h-4 text-xs text-destructive" data-testid="amount-error">
            {errors?.amount ?? ''}
          </p>
        </div>
      </div>
    </div>
  );
}
