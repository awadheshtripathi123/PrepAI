const API_BASE = '';

export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
  window.dispatchEvent(new Event('authChange'));
};

export const removeToken = () => {
  localStorage.removeItem('token');
  window.dispatchEvent(new Event('authChange'));
};

export const isLoggedIn = () => {
  return !!getToken();
};

export const authFetch = async (url, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers
  });

  return response;
};
