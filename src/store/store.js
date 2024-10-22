import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';
import localStorage from 'redux-persist/lib/storage';

import authReducer from '@/store/auth';
import navBarOptionsReducer from '@/store/navBarOptions';
import locationsReducer from '@/store/locations';
import modalStateReducer from '@/store/modalState';
import modalsControlReducer from '@/store/modalsControl';
import { encryptTransform } from '@/utils/crypto';

const modalStatePersistConfig = {
  key: 'modalState',
  storage: localStorage,
  transforms: [encryptTransform],
};

const navBarOptionsPersistConfig = {
  key: 'navBarOptions',
  storage: sessionStorage,
  transforms: [encryptTransform],
};

const authPersistConfig = {
  key: 'auth',
  storage: localStorage,
  transforms: [encryptTransform],
};

const persistedNavBarOptionsReducer = persistReducer(
  navBarOptionsPersistConfig,
  navBarOptionsReducer
);

const persistedModalStateReducer = persistReducer(
  modalStatePersistConfig,
  modalStateReducer
);
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    navBarOptions: persistedNavBarOptionsReducer,
    modalState: persistedModalStateReducer,
    modalsControl: modalsControlReducer,
    locations: locationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { persistor, store };
