import { Loader2Icon } from "lucide-react"
import { cn } from "@/lib/utils"

interface RateResultProps {
  rate: number | null
  convertedAmount: number | null
  isLoading: boolean
  error: Error | null
  className?: string
}

export function RateResult({
  rate,
  convertedAmount,
  isLoading,
  error,
  className,
}: RateResultProps) {
  if (isLoading) {
    return (
      <div
        data-testid="rate-loading"
        className={cn(
          "flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3",
          className
        )}
      >
        <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Fetching rate…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div
        data-testid="rate-error"
        className={cn(
          "rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive",
          className
        )}
      >
        {error.message}
      </div>
    )
  }

  if (rate === null || convertedAmount === null) {
    return null
  }

  return (
    <div
      data-testid="rate-success"
      className={cn(
        "rounded-lg border border-border bg-muted/30 px-4 py-3 space-y-1",
        className
      )}
    >
      <p className="text-sm text-muted-foreground" data-testid="rate-value">
        Exchange rate: <span className="font-medium text-foreground">{rate}</span>
      </p>
      <p className="text-sm text-muted-foreground" data-testid="converted-amount-value">
        Converted amount:{" "}
        <span className="font-medium text-foreground">{convertedAmount}</span>
      </p>
    </div>
  )
}
