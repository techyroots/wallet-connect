import React from 'react'
import ReactDOM from 'react-dom'
import { ModalProvider, light} from '@pancakeswap/uikit'
import { Web3ReactProvider } from '@web3-react/core'

import { ethers } from 'ethers'
import { ThemeProvider } from 'styled-components'
import { LanguageProvider } from 'langindex'
// import { RefreshContextProvider } from 'contexts/RefreshContext'
import { ToastsProvider } from 'Provider'

import { Route } from 'react-router-dom'

import Menu from './Menu'


const ThemeProviderWrapper = (props) => {
 
  return <ThemeProvider theme={ light} {...props} />
}
const getLibrary = (provider): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider)
  // library.pollingInterval = 12000
  return library
}
const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
  
        <ToastsProvider>
          {/* <HelmetProvider> */}
            <ThemeProviderWrapper>
              <LanguageProvider>
                {/* <RefreshContextProvider> */}
                  <ModalProvider>{children}</ModalProvider>
                {/* </RefreshContextProvider> */}
              </LanguageProvider>
            </ThemeProviderWrapper>
          {/* </HelmetProvider> */}
        </ToastsProvider>

    </Web3ReactProvider>
  )
}
const App: React.FC = () => {
  return (        
      <Menu>
          
        <Route path="/" exact>
                {/* <Home /> */}
        </Route>       
      </Menu>   
  )
}
ReactDOM.render(
  <React.StrictMode>    
      <Providers>
        
        <App />
      </Providers>
   
  </React.StrictMode>,
  document.getElementById('root'),
)
