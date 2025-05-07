import authHeader from './authHeader';
import config from '../config/config';

const handleApiResponse = async (response) => {
  if (response.status === 401) {
    localStorage.clear();
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }
  
  if (!response.ok) {
    const error = await response.text();
    try {
      const parsedError = JSON.parse(error);
      throw new Error(parsedError.message || 'Request failed');
    } catch (e) {
      throw new Error(error || `HTTP error! status: ${response.status}`);
    }
  }
  
  return response.json();
};

const ApiService = {
  makeRequest: async (endpoint, options = {}) => {
    const defaultOptions = {
      method: 'GET',
      headers: authHeader(),
      credentials: 'include',
      mode: 'cors'
    };

    const fetchOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };

    try {
      const response = await fetch(`${config.API_URL}${endpoint}`, fetchOptions);
      return handleApiResponse(response);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
};

export default ApiService;