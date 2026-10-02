import { useCallback, useMemo, useState } from 'react';
import { parseEther } from 'viem';
import { useConnection, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { REQUIRED_CHAIN_ID, REQUIRED_NETWORK } from '@/lib/constants';
import { getFriendlyWalletError } from '@/lib/walletErrors';
import type { TxStatus } from '@/lib/types';

export function useSendFundsTransaction(recipient: string) {
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [localErrorMessage, setLocalErrorMessage] = useState<string | null>(null);
  const { chainId } = useConnection();

  const {
    mutateAsync: sendTransactionAsync,
    reset: resetSendTransaction,
    isPending: isAwaitingWalletSignature,
    error: sendError,
  } = useSendTransaction();

  const {
    isLoading: isAwaitingConfirmation,
    isSuccess: isConfirmed,
    isError: isConfirmationFailed,
    error: confirmationError,
  } = useWaitForTransactionReceipt({
    hash: txHash ?? undefined,
    query: {
      enabled: Boolean(txHash),
    },
  });

  const status: TxStatus | null = useMemo(() => {
    if (isConfirmationFailed || sendError || localErrorMessage) return 'failed';
    if (isConfirmed) return 'confirmed';
    if (txHash) return 'submitted';
    return null;
  }, [isConfirmationFailed, sendError, localErrorMessage, isConfirmed, txHash]);

  const errorMessage = useMemo(() => {
    if (localErrorMessage) return localErrorMessage;
    if (sendError) return getFriendlyWalletError(sendError, 'send');
    if (isConfirmationFailed) return getFriendlyWalletError(confirmationError, 'confirm');
    return null;
  }, [localErrorMessage, sendError, isConfirmationFailed, confirmationError]);

  const submit = useCallback(
    async (amount: string) => {
      setLocalErrorMessage(null);
      setTxHash(null);

      try {
        if (chainId !== REQUIRED_CHAIN_ID) {
          setLocalErrorMessage(
            `Wrong network. Please switch to ${REQUIRED_NETWORK} and try again.`
          );
          return;
        }

        const hash = await sendTransactionAsync({
          chainId: REQUIRED_CHAIN_ID,
          to: recipient as `0x${string}`,
          value: parseEther(amount),
        });
        setTxHash(hash);
      } catch (error) {
        setLocalErrorMessage(getFriendlyWalletError(error, 'send'));
      }
    },
    [chainId, recipient, sendTransactionAsync]
  );

  const reset = useCallback(() => {
    setTxHash(null);
    setLocalErrorMessage(null);
    resetSendTransaction();
  }, [resetSendTransaction]);

  return {
    txHash,
    status,
    errorMessage,
    submit,
    reset,
    isSubmitting: isAwaitingWalletSignature || isAwaitingConfirmation,
  };
}
