import type { Currency } from "./constants"

export interface RateResponse {
  rate: number
}

export interface RateParams {
  from: Currency
  to: Currency
}

export interface QuotesApiResponse {
  data?: {
    exchangeRate?: number
  }
}

export type TxStatus = "submitted" | "confirmed" | "failed"

export interface TxState {
  hash: string | null
  status: TxStatus | null
}

export interface CurrencyFormValues {
  from: Currency
  to: Currency
  amount: string
}
