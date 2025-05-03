import config from '../config/config';

class AuthService {
  // ...existing code...
  
  async login(username, password) {
    const response = await fetch(`${config.API_URL}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    // ...existing code...
  }
  
  // ...existing code...
}

export default new AuthService();