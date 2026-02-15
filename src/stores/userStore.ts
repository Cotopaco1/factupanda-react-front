import type { UserType } from '@/types/users';
import { create } from 'zustand'
import { useTenantSettingsStore } from '@/stores/tenantSettingsStore'

type UserStoreState = {
  user: UserType | undefined;
  setUser: (user: UserType | undefined) => void;
  isLogin : boolean;
  setIsLogin : (login : boolean) => void;
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
    token :  undefined,
    setToken : (token) => set({token : token}),
    logoutUser : () => {
      set({token : '', user : undefined, isLogin : false});
      useTenantSettingsStore.getState().clearSettings();
      localStorage.removeItem('tkn');
    },
    loginUser : (token , user ) => {
      set({token : token, user : user, isLogin : true});
      localStorage.setItem('tkn', token);
    }
}));
