export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));

  const headers = {
    'Content-Type': 'application/json',
  };

  if (user?.token) {
    headers.Authorization = `Bearer ${user.token}`;
    // Add additional security headers
    headers['X-Requested-With'] = 'XMLHttpRequest';
    headers['Cache-Control'] = 'no-cache';
  }

  return headers;
}