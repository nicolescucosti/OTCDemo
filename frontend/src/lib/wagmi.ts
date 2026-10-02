import { createConfig, http } from "wagmi"
import { injected, metaMask } from "wagmi/connectors"
import { mainnet, sepolia } from "wagmi/chains"

export const SUPPORTED_CHAINS = [sepolia, mainnet] as const

export const wagmiConfig = createConfig({
  chains: SUPPORTED_CHAINS,
  connectors: [
    metaMask(),
    injected({
      target: "metaMask",
    }),
    injected(),
  ],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
})
