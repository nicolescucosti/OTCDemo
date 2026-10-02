import { useCallback } from 'react';
import { useConnection, useConnect, useConnectors, useDisconnect, useSwitchChain } from 'wagmi';
import { REQUIRED_CHAIN_ID, REQUIRED_NETWORK } from '@/lib/constants';
import { getFriendlyWalletError } from '@/lib/walletErrors';
import { SUPPORTED_CHAINS } from '@/lib/wagmi';

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function useWallet() {
  const { address, isConnected, chainId } = useConnection();
  const fullAddress = address ?? null;
  const connectors = useConnectors();
  const { mutate: connectMutation, isPending: isConnecting, error: connectError } = useConnect();
  const { mutate: disconnectMutation } = useDisconnect();
  const {
    mutate: switchChainMutation,
    isPending: isSwitching,
    error: switchError,
  } = useSwitchChain();

  const activeChain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId);
  const network = activeChain?.name ?? null;
  const displayAddress = address ? shortenAddress(address) : null;
  const isCorrectNetwork = chainId === REQUIRED_CHAIN_ID;

  const connectWallet = useCallback(() => {
    const metaMaskConnector =
      connectors.find((connector) => connector.id === 'metaMask') ??
      connectors.find((connector) => connector.name.toLowerCase().includes('metamask')) ??
      connectors[0];

    if (metaMaskConnector) {
      connectMutation({ connector: metaMaskConnector, chainId: REQUIRED_CHAIN_ID });
    }
  }, [connectMutation, connectors]);

  const switchToRequiredNetwork = useCallback(() => {
    switchChainMutation({ chainId: REQUIRED_CHAIN_ID });
  }, [switchChainMutation]);

  return {
    isConnected,
    isCorrectNetwork,
    address: displayAddress,
    fullAddress,
    network,
    connect: connectWallet,
    disconnect: disconnectMutation,
    switchToRequiredNetwork,
    requiredNetwork: REQUIRED_NETWORK,
    isConnecting,
    isSwitching,
    walletError: connectError
      ? getFriendlyWalletError(connectError, 'connect')
      : switchError
        ? getFriendlyWalletError(switchError, 'switch')
        : null,
  };
}
