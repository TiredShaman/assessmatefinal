import authHeader from './authHeader';

// Example API service
const ApiService = {
  fetchProtectedData: async () => {
    try {
      const response = await fetch('http://localhost:8080/api/protected-endpoint', {
        method: 'GET',
        headers: authHeader()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  }
};

export default ApiService;