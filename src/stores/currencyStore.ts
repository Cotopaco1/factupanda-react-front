import { create } from 'zustand'
import type { Currency } from '@/types/currency'

type CurrencyStoreState = {
  currencies: Currency[]
  hasLoaded: boolean
  setCurrencies: (currencies: Currency[]) => void
  clearCurrencies: () => void
  setHasLoaded: (loaded: boolean) => void
}

export const useCurrencyStore = create<CurrencyStoreState>((set) => ({
  currencies: [],
  hasLoaded: false,
  setCurrencies: (currencies) => set({ currencies }),
  clearCurrencies: () => set({ currencies: [], hasLoaded: false }),
  setHasLoaded: (loaded) => set({ hasLoaded: loaded }),
}))
