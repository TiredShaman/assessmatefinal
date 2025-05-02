export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    const headers = {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
    };
    return headers;
  } else {
    return {
      'Content-Type': 'application/json',
    };
  }
}
