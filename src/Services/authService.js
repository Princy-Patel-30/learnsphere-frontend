import api from '../utils/api';

export const registerUser = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const login = async (data) => {
  const response = await api.post('/auth/login', data, { withCredentials: true });
  return response.data;
};

export const logout = async () => {
  await api.post('/auth/logout', {}, { withCredentials: true });
};

export const updateUserRole = async (role) => {
    const response = await api.put('/auth/update-role', { role }); 
    return response.data;
  };

export const fetchUser = async () => {
  const res = await api.get('/auth/refresh-token', { withCredentials: true });
  return res.data;
};