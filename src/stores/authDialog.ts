import { create } from 'zustand'

type DialogStoreType = {
    isOpen : boolean;
    setIsOpen : (bool : boolean) => void;
}

export const useAuthDialogStore = create<DialogStoreType>((set) => ({
    isOpen : false,
    setIsOpen : (bool) => set({isOpen : bool})
}));