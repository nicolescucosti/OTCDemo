import { CopyIcon, MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useWallet } from '@/hooks/useWallet';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const {
    isConnected,
    isCorrectNetwork,
    address,
    fullAddress,
    network,
    connect,
    disconnect,
    switchToRequiredNetwork,
    requiredNetwork,
    isConnecting,
    isSwitching,
    walletError,
  } = useWallet();

  useEffect(() => {
    if (walletError) {
      toast.error(walletError);
    }
  }, [walletError]);

  const handleCopyAddress = async () => {
    if (!fullAddress) return;
    try {
      await navigator.clipboard.writeText(fullAddress);
      toast.success('Wallet address copied');
    } catch {
      toast.error('Failed to copy wallet address');
    }
  };

  return (
    <header className="border-b border-border/80 bg-background/95" data-testid="header-root">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-3 py-3 sm:px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold tracking-tight" data-testid="header-title">
            FX Mini-Quote
          </h1>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            data-testid="theme-toggle-button"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <span
                className="hidden text-sm text-muted-foreground md:inline"
                data-testid="wallet-info"
              >
                {address} · {network ?? 'Unknown network'}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleCopyAddress}
                aria-label="Copy wallet address"
                data-testid="copy-wallet-address-button"
              >
                <CopyIcon />
              </Button>
              {!isCorrectNetwork && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={switchToRequiredNetwork}
                  disabled={isSwitching}
                  data-testid="switch-network-button"
                >
                  Switch to {requiredNetwork}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => disconnect()}
                data-testid="disconnect-wallet-button"
              >
                Disconnect
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={connect}
              disabled={isConnecting}
              data-testid="connect-wallet-button"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
