import type { UserType } from '@/types/users';
import { create } from 'zustand'

type UserStoreState = {
  user: UserType | undefined;
  setUser: (user: UserType | undefined) => void;
  isLogin : boolean;
  setIsLogin : (login : boolean) => void;
  token : string|undefined;
  setToken : (token : string) => void;
}


export const useUserStore = create<UserStoreState>((set) => ({
    user : undefined,
    setUser : (user) => set({user : user}),
    isLogin : false,
    setIsLogin : (login) => set({isLogin : login}),
    token :  undefined,
    setToken : (token) => set({token : token}),
}));