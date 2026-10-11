import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'userName';

const UserContext = createContext({ name: '', ready: false, saveName: () => {} });

export function UserProvider({ children }) {
  const [name, setName] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((v) => {
        if (v) setName(v);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const saveName = (value) => {
    const clean = (value || '').trim().slice(0, 20);
    setName(clean);
    if (clean) {
      AsyncStorage.setItem(KEY, clean).catch(() => {});
    } else {
      AsyncStorage.removeItem(KEY).catch(() => {});
    }
  };

  return (
    <UserContext.Provider value={{ name, ready, saveName }}>{children}</UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);