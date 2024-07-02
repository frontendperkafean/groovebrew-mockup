import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './LoginPage.css';
import RouletteWheel from './RouletteWheel';
import { loginUser } from '../components/userHelper'; // Import from userHelper.js

const LoginPage = () => {
  const navigate = useNavigate();
  const { shopId } = useParams();

  const handleLogin = async (username, password) => {
    try {
      const response = await loginUser(username, password);

      if (response.success) {
        localStorage.setItem("auth", response.token);
        
        if (response.cafeId === null) {
          if (shopId) navigate(`/shop/${shopId}`);
          else navigate('/');
        } else {
          navigate(`/shop/${response.cafeId}`);
        }
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error occurred while logging in:', error.message);
    }
  };

  return (
    <div className="login-container">
      <RouletteWheel onSign={handleLogin} />
    </div>
  );
};

export default LoginPage;
