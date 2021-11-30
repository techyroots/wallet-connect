import { useCallback } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { NoBscProviderError, BscConnector } from '@binance-chain/bsc-connector'
import {
  NoEthereumProviderError, InjectedConnector,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector'
import { ConnectorNames, connectorLocalStorageKey } from '@pancakeswap/uikit'

import useToast from 'useToast'



import { ChainId } from '@pancakeswap/sdk'

 
const BASE_BSC_SCAN_URLS = {
   [ChainId.MAINNET]: 'https://bscscan.com',
   [ChainId.TESTNET]: 'https://testnet.bscscan.com',
}
const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[ChainId.MAINNET]

const setupNetwork = async () => {
  const provider = window.ethereum
  if (provider) {
    const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: 'Binance Smart Chain Mainnet',
            nativeCurrency: {
              name: 'BNB',
              symbol: 'bnb',
              decimals: 18,
            },
            rpcUrls:  process.env.REACT_APP_NODE_1,
            blockExplorerUrls: [`${BASE_BSC_SCAN_URL}/`],
          },
        ],
      })
      return true
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error)
      return false
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
    return false
  }
}

const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)
const bscConnector = new BscConnector({ supportedChainIds: [chainId] })
const injected = new InjectedConnector({ supportedChainIds: [chainId] })
const POLLING_INTERVAL = 12000
const rpcUrl =  process.env.REACT_APP_NODE_1
const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: rpcUrl },
  qrcode: true,
  // pollingInterval: POLLING_INTERVAL,
})
const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: bscConnector,
}



const useAuth = () => {
  const { activate, deactivate } = useWeb3React()
  const { toastError } = useToast()

  const login = useCallback(
    (connectorID: ConnectorNames) => {
      const connector = connectorsByName[connectorID]
      if (connector) {
        activate(connector, async (error: Error) => {
          if (error instanceof UnsupportedChainIdError) {
            const hasSetup = await setupNetwork()
            if (hasSetup) {
              activate(connector)
            }
          } else {
            window.localStorage.removeItem(connectorLocalStorageKey)
            if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
              toastError(('Provider Error'), ('No provider was found'))
            } else if (
              error instanceof UserRejectedRequestErrorInjected ||
              error instanceof UserRejectedRequestErrorWalletConnect
            ) {
              if (connector instanceof WalletConnectConnector) {
                const walletConnector = connector as WalletConnectConnector
                walletConnector.walletConnectProvider = null
              }
              toastError(('Authorization Error'), ('Please authorize to access your account'))
            } else {
              toastError(error.name, error.message)
            }
          }
        })
      } else {
        toastError(('Unable to find connector'), ('The connector config is wrong'))
      }
    },
    [activate, toastError],
  )

  const logout = useCallback(() => {    
    deactivate()
    if (window.localStorage.getItem('walletconnect')) {
      connectorsByName.walletconnect.close()
      connectorsByName.walletconnect.walletConnectProvider = null
    }
    window.localStorage.removeItem(connectorLocalStorageKey)
  }, [deactivate])

  return { login, logout }
}

export default useAuth
