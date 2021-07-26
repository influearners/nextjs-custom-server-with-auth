import { useEffect, createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const userContext = createContext(null);

export const useUser = () => {
  return useContext(userContext);
};

export default function UserProvider({ children }) {
  const [user, setUser] = useLocalStorage('user', null);

  useEffect(() => {
    async function asyncFunc() {
      try {
        let res = await fetch('/api/me', {
          method: 'GET',
        });
        res = await res.json();
        if (res.status === 'success') {
          setUser(res.user);
        } else {
          setUser(user);
        }
      } catch (err) {
        setUser(null);
        console.log(err);
      }
    }
    asyncFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <userContext.Provider value={[user, setUser]}>
      {children}
    </userContext.Provider>
  );
}
