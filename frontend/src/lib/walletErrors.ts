type WalletErrorContext = 'connect' | 'switch' | 'send' | 'confirm'

type ErrorLike = {
  message?: unknown
  shortMessage?: unknown
  details?: unknown
  code?: unknown
  cause?: unknown
}

function sanitizeErrorText(message: string): string {
  const withoutDetails = message.split(/\bRequest Arguments:|\bDetails:/i)[0] ?? message
  return withoutDetails.replace(/\s+/g, ' ').trim()
}

function getErrorCode(error: unknown, depth = 0): number | string | null {
  if (!error || typeof error !== 'object' || depth > 5) return null
  const candidate = (error as ErrorLike).code
  if (typeof candidate === 'number' || typeof candidate === 'string') {
    return candidate
  }
  return getErrorCode((error as ErrorLike).cause, depth + 1)
}

function getRawMessage(error: unknown): string {
  const errorLike = (error && typeof error === 'object' ? error : null) as ErrorLike | null
  return [
    errorLike?.shortMessage,
    errorLike?.message,
    errorLike?.details,
    error instanceof Error ? error.message : null,
  ]
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .join(' ')
}

export function getFriendlyWalletError(
  error: unknown,
  context: WalletErrorContext
): string {
  const code = getErrorCode(error)
  const rawMessage = getRawMessage(error)
  const normalized = rawMessage.toLowerCase()

  const isUserRejected =
    code === 4001 ||
    normalized.includes('user rejected') ||
    normalized.includes('user denied') ||
    normalized.includes('rejected the request') ||
    normalized.includes('denied transaction signature')

  if (isUserRejected) {
    if (context === 'connect') return 'Wallet connection was cancelled in MetaMask.'
    if (context === 'switch') return 'Network switch was cancelled in MetaMask.'
    if (context === 'send') return 'Transaction was cancelled in MetaMask.'
    return 'Wallet action was cancelled in MetaMask.'
  }

  if (
    normalized.includes('connector not found') ||
    normalized.includes('no injected provider') ||
    normalized.includes('provider not found')
  ) {
    return 'No browser wallet found. Install MetaMask (or another injected wallet), then try again.'
  }

  if (normalized.includes('insufficient funds')) {
    return 'Insufficient funds to cover amount and fee.'
  }

  if (normalized.includes('nonce too low')) {
    return 'Transaction nonce is too low. Please retry.'
  }

  if (rawMessage) {
    return sanitizeErrorText(rawMessage)
  }

  if (context === 'connect') return 'Failed to connect wallet.'
  if (context === 'switch') return 'Failed to switch network.'
  if (context === 'send') return 'Failed to send transaction.'
  return 'Wallet operation failed.'
}
