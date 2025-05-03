export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://assessmatefinal-6cog.vercel.app',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  };

  if (user?.token) {
    headers.Authorization = `Bearer ${user.token}`;
    headers['X-Requested-With'] = 'XMLHttpRequest';
    headers['Cache-Control'] = 'no-cache';
  }

  return headers;
}