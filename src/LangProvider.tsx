import React, { createContext, useCallback, useState, ReactText } from 'react'
import { Language } from '@pancakeswap/uikit'
import { EN } from 'languages'
import translations from './translations.json'

const initialState: ProviderState = {
  isFetching: true,
  currentLanguage: EN,
}

export type ContextData = {
  [key: string]: ReactText
}

export interface ProviderState {
  isFetching: boolean
  currentLanguage: Language
}

export interface ContextApi extends ProviderState {
  
  t: (key: string) => string
}

// Export the translations directly
export const languageMap = new Map<Language['locale'], Record<string, string>>()
languageMap.set(EN.locale, translations)

export const LanguageContext = createContext<ContextApi>(undefined)

export const LanguageProvider: React.FC = ({ children }) => {
  const [state] = useState<ProviderState>(() => {
  

    return {
      ...initialState,
      
    }
  })
  const { currentLanguage } = state



  const translate = useCallback(
    (key: string, data?: ContextData) => {
      const translationSet = languageMap.has(currentLanguage.locale)
        ? languageMap.get(currentLanguage.locale)
        : languageMap.get(EN.locale)
      const translatedText = translationSet[key] || key

      // Check the existence of at least one combination of %%, separated by 1 or more non space characters
      const includesVariable = translatedText.match(/%\S+?%/gm)

      if (includesVariable && data) {
        let interpolatedText = translatedText
        Object.keys(data).forEach((dataKey) => {
          const templateKey = new RegExp(`%${dataKey}%`, 'g')
          interpolatedText = interpolatedText.replace(templateKey, data[dataKey].toString())
        })

        return interpolatedText
      }

      return translatedText
    },
    [currentLanguage],
  )

  return <LanguageContext.Provider value={{ ...state,  t: translate }}>{children}</LanguageContext.Provider>
}
