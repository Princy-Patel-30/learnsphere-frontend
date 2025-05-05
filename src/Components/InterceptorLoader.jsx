import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { setupInterceptors } from '../utils/api';
import { AuthContext } from '../Context/AuthContext';

const InterceptorLoader = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setupInterceptors(logout, navigate);
  }, [logout, navigate]);

  return null;
};

export default InterceptorLoader;