const API_URL = import.meta.env.VITE_API_URL;
const GOOGLE_AUTH_URL = import.meta.env.VITE_GOOGLE_AUTH_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

const config = {
    API_URL: process.env.REACT_APP_API_URL || 'https://assessmate-j21k.onrender.com',
    // Add other configuration variables as needed
};

export default config;