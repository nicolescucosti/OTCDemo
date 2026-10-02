import { useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SEPOLIA_EXPLORER_BASE, TX_RECIPIENT } from "@/lib/constants"
import type { Currency } from "@/lib/constants"
import { useSendFundsTransaction } from "@/hooks/useSendFundsTransaction"

interface SendFundsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  amount: string
  convertedAmount: number | null
  fromCurrency: Currency
  toCurrency: Currency
  transferAmountInEth: string | null
}

export function SendFundsDialog({
  open,
  onOpenChange,
  amount,
  convertedAmount,
  fromCurrency,
  toCurrency,
  transferAmountInEth,
}: SendFundsDialogProps) {
  const { txHash, status, errorMessage, isSubmitting, submit, reset } =
    useSendFundsTransaction(TX_RECIPIENT)

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        reset()
      }
      onOpenChange(next)
    },
    [onOpenChange, reset]
  )

  const displayAmount = amount || "0"
  const displayConverted = convertedAmount ?? 0
  const displayTransferAmountInEth = transferAmountInEth ?? "N/A"

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={!isSubmitting} data-testid="send-funds-dialog">
        <DialogHeader>
          <DialogTitle data-testid="send-funds-dialog-title">Send funds</DialogTitle>
          <DialogDescription>
            Review and confirm the transfer details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2 text-sm" data-testid="send-funds-dialog-details">
          <div className="flex justify-between" data-testid="send-funds-recipient-row">
            <span className="text-muted-foreground">Recipient</span>
            <span className="font-mono text-xs sm:text-sm">{TX_RECIPIENT}</span>
          </div>
          <div className="flex justify-between" data-testid="send-funds-amount-row">
            <span className="text-muted-foreground">Amount</span>
            <span>{displayAmount} {fromCurrency}</span>
          </div>
          <div className="flex justify-between" data-testid="send-funds-converted-amount-row">
            <span className="text-muted-foreground">Converted amount</span>
            <span>{displayConverted} {toCurrency}</span>
          </div>
          <div className="flex justify-between" data-testid="send-funds-onchain-amount-row">
            <span className="text-muted-foreground">On-chain transfer amount</span>
            <span>{displayTransferAmountInEth} ETH</span>
          </div>
          {txHash && (
            <>
              <div className="flex justify-between gap-2" data-testid="send-funds-tx-hash-row">
                <span className="text-muted-foreground">Transaction</span>
                <span className="break-all font-mono text-xs">{txHash}</span>
              </div>
              <div className="flex justify-between" data-testid="send-funds-explorer-row">
                <span className="text-muted-foreground">Explorer</span>
                <a
                  href={`${SEPOLIA_EXPLORER_BASE}/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                  data-testid="send-funds-explorer-link"
                >
                  View on Etherscan
                </a>
              </div>
              <div className="flex justify-between" data-testid="send-funds-status-row">
                <span className="text-muted-foreground">Status</span>
                <span
                  data-testid="send-funds-status-value"
                  className={
                    status === "failed"
                      ? "text-destructive"
                      : status === "confirmed"
                        ? "text-green-600 dark:text-green-400"
                        : ""
                  }
                >
                  {status}
                </span>
              </div>
            </>
          )}
          {errorMessage && (
            <p
              className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
              data-testid="send-funds-error"
            >
              {errorMessage}
            </p>
          )}
        </div>
        <DialogFooter>
          {!txHash ? (
            <>
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
                data-testid="send-funds-cancel-button"
              >
                Cancel
              </Button>
              <Button
                onClick={() => submit(displayTransferAmountInEth)}
                disabled={isSubmitting || !transferAmountInEth}
                data-testid="send-funds-confirm-button"
              >
                {isSubmitting ? "Sending…" : "Confirm"}
              </Button>
            </>
          ) : (
            <Button onClick={() => handleOpenChange(false)} data-testid="send-funds-close-button">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
