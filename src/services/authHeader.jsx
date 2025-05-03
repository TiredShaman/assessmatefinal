export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  if (user?.token) {
    headers.Authorization = `Bearer ${user.token}`;
  }

  return headers;
}