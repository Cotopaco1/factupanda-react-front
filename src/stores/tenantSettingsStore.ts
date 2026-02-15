import { create } from 'zustand'
import type { TenantSettings } from '@/types/tenantSettings'

type TenantSettingsStoreState = {
  settings: TenantSettings | null
  hasLoaded: boolean
  setSettings: (settings: TenantSettings | null) => void
  clearSettings: () => void
  setHasLoaded: (loaded: boolean) => void
}

export const useTenantSettingsStore = create<TenantSettingsStoreState>((set) => ({
  settings: null,
  hasLoaded: false,
  setSettings: (settings) => set({ settings }),
  clearSettings: () => set({ settings: null, hasLoaded: false }),
  setHasLoaded: (loaded) => set({ hasLoaded: loaded }),
}))
