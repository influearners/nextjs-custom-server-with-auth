export async function login(username, password) {
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const resJson = await res.json();
    return resJson;
  } catch (error) {
    console.log('util start');
    console.log(error);
    console.log('util end');
    throw error;
  }
}
