// store/permanentClientStore.ts
import { create } from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';

export interface PermanentClientInfo {
  email: string;
  name?: string;
  phone?: string;
  isValidated: boolean;
}

interface PermanentClientStore {
  // Стан вибору постійного клієнта
  isPermanentClientSelected: boolean;

  // Інформація про постійного клієнта
  clientInfo: PermanentClientInfo | null;

  // Чи знаходимося на сторінці checkout
  isOnCheckoutPage: boolean;

  // Дії
  setPermanentClientSelected: (selected: boolean) => void;
  setClientInfo: (info: PermanentClientInfo | null) => void;
  setIsOnCheckoutPage: (isOnCheckout: boolean) => void;
  clearPermanentClientState: () => void;

  // Геттер для перевірки чи показувати ім'я постійного клієнта
  shouldShowPermanentClientName: () => boolean;
}

export const usePermanentClientStore = create<PermanentClientStore>()(
  devtools(
    persist(
      (set, get) => ({
        isPermanentClientSelected: false,
        clientInfo: null,
        isOnCheckoutPage: false,

        setPermanentClientSelected: (selected: boolean) =>
          set(() => ({
            isPermanentClientSelected: selected,
          })),

        setClientInfo: (info: PermanentClientInfo | null) =>
          set(() => ({
            clientInfo: info,
          })),

        setIsOnCheckoutPage: (isOnCheckout: boolean) =>
          set(() => ({
            isOnCheckoutPage: isOnCheckout,
          })),

        clearPermanentClientState: () =>
          set(() => ({
            isPermanentClientSelected: false,
            clientInfo: null,
            isOnCheckoutPage: false,
          })),

        shouldShowPermanentClientName: () => {
          const state = get();
          return (
            state.isOnCheckoutPage &&
            state.isPermanentClientSelected &&
            !!state.clientInfo?.isValidated
          );
        },
      }),
      {
        name: 'permanent-client-storage',
        storage: createJSONStorage(() => sessionStorage), // Використовуємо sessionStorage для тимчасового зберігання
        // Очищуємо стан при закритті вкладки
        partialize: state => ({
          isPermanentClientSelected: state.isPermanentClientSelected,
          clientInfo: state.clientInfo,
          isOnCheckoutPage: state.isOnCheckoutPage,
        }),
      }
    ),
    { name: 'Permanent Client Store' }
  )
);
