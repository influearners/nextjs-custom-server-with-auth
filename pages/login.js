import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { login } from '../lib/api';
import { useUser } from '../context/UserProvider';

export default function Login() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState(null);
  const router = useRouter();
  const [user, setUser] = useUser();

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  async function handleLogin() {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    if (!username || !password) {
      return setError('Username and Password are required!');
    }

    try {
      const res = await login(username, password);
      if (res.status === 'success') {
        setUser(res.user);
        router.replace('/');
      } else {
        console.log(res);
        setError(res.message);
      }
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  }

  return !user ? (
    <div>
      <form>
        <div>
          <input type="text" ref={usernameRef} placeholder="Username" />
        </div>
        <div>
          <input type="password" ref={passwordRef} placeholder="Password" />
        </div>
        <button type="button" onClick={handleLogin}>
          Login
        </button>
        {error ? <div style={{ color: 'red' }}>{error}</div> : null}
      </form>
    </div>
  ) : (
    <p>Loading...</p>
  );
}
