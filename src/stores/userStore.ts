import type { UserType } from '@/types/users';
import { create } from 'zustand'
import { useTenantSettingsStore } from '@/stores/tenantSettingsStore'

type UserStoreState = {
  user: UserType | undefined;
  setUser: (user: UserType | undefined) => void;
  isLogin : boolean;
  setIsLogin : (login : boolean) => void;
  /**
   * Si ya intentamos resolver la sesion. Sin esto, isLogin arranca en false y
   * las pantallas privadas parpadearian un "inicia sesion" mientras se valida
   * el token guardado.
   */
  sessionChecked : boolean;
  setSessionChecked : (checked : boolean) => void;
  token : string|undefined;
  setToken : (token : string) => void;
  logoutUser : () => void;
  loginUser : (token : string, user : UserType) => void;
}


export const useUserStore = create<UserStoreState>((set) => ({
    user : undefined,
    setUser : (user) => set({user : user}),
    isLogin : false,
    setIsLogin : (login) => set({isLogin : login}),
    sessionChecked : false,
    setSessionChecked : (checked) => set({sessionChecked : checked}),
    token :  undefined,
    setToken : (token) => set({token : token}),
    logoutUser : () => {
      set({token : '', user : undefined, isLogin : false, sessionChecked : true});
      useTenantSettingsStore.getState().clearSettings();
      localStorage.removeItem('tkn');
    },
    loginUser : (token , user ) => {
      set({token : token, user : user, isLogin : true, sessionChecked : true});
      localStorage.setItem('tkn', token);
    }
}));
