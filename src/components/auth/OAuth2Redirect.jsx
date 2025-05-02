import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function OAuth2Redirect() {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      window.opener.postMessage({ type: 'oauth2-success', token }, window.origin);
    } else {
      window.opener.postMessage({ type: 'oauth2-error', error }, window.origin);
    }

    navigate('/login'); // Redirect back to login page
  }, [search, navigate]);

  return (
    <div>
      Redirecting...
    </div>
  );
}

export default OAuth2Redirect;
