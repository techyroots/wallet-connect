import React from 'react'
import { useTranslation } from 'langindex'
import { useWeb3React } from '@web3-react/core'
import {Flex,LogoutIcon,UserMenu as UIKitUserMenu, UserMenuItem,Button, useWalletModal } from '@pancakeswap/uikit'
import useAuth from './useAuth'

const ConnectWalletButton = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout, t)

  return (
    <Button onClick={onPresentConnectModal} {...props}>
      {t('Connect Wallet')}
    </Button>
  )
}

const Menu = (props) => {
  const { account } = useWeb3React()
  const { logout } = useAuth()
  if (!account) {
    return <ConnectWalletButton scale="sm" />
  }

  return (
    <UIKitUserMenu account={account}>
   
      <UserMenuItem as="button" onClick={logout}>
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          Disconnect
          <LogoutIcon />
        </Flex>
      </UserMenuItem>
      
     </UIKitUserMenu>
  )
}



export default Menu
