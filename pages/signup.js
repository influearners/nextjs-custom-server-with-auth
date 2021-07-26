import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserProvider';

export default function Login() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState(null);
  const [user, setUser] = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [router, user]);

  async function handleLogin() {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    if (!username || !password) {
      return setError('Username and Password are required!');
    }

    try {
      let res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      res = await res.json();
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
          Signup
        </button>
        {error ? <div style={{ color: 'red' }}>{error}</div> : null}
      </form>
    </div>
  ) : (
    <p>Loading...</p>
  );
}
