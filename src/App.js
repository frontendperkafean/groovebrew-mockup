// App.js

import './App.css';
import './components/Loading.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import socket from './services/socketService';

import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import Invoice from './pages/Invoice';
import Footer from './components/Footer';
import { checkToken } from './helpers/userHelpers.js';
import { calculateTotals } from './helpers/cartHelpers';

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [shopId, setShopId] = useState("");
  const [totalItemsCount, setTotalItemsCount] = useState(0);

  useEffect(() => {
    // Function to calculate totals from localStorage
    const calculateTotalsFromLocalStorage = () => {
      const { totalCount } = calculateTotals(shopId);
      setTotalItemsCount(totalCount);
    };

    // Initial calculation on component mount
    calculateTotalsFromLocalStorage();

    // Function to handle localStorage change event
    const handleStorageChange = () => {
      calculateTotalsFromLocalStorage();
    };

    // Subscribe to custom localStorage change event
    window.addEventListener('localStorageUpdated', handleStorageChange);

    return () => {
      // Clean up: Remove event listener on component unmount
      window.removeEventListener('localStorageUpdated', handleStorageChange);
    };
  }, [shopId != '']);

  // Function to handle setting parameters from Dashboard
  const handleSetParam = (param) => {
    setShopId(param);
  };

  useEffect(() => {
    const validateToken = async () => {
      const checkedtoken = await checkToken();
      if (checkedtoken.ok) {
        setUser(checkedtoken.user.user);
        console.log(checkedtoken.user.user);
        if (checkedtoken.user.user.cafeId != null) {
          navigate('/' + checkedtoken.user.user.cafeId);
        }
        console.log(user);
      }
    };
    validateToken();
  }, [navigate]);

  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/:shopId" element={<>
            <Dashboard sendParam={handleSetParam} socket={socket} user={user} />
            <Footer shopId={shopId} cartItemsLength={totalItemsCount} />
          </>} />
          <Route path="/:shopId/cart" element={<>
            <Cart sendParam={handleSetParam} totalItemsCount={totalItemsCount} />
            <Footer shopId={shopId} cartItemsLength={totalItemsCount} />
          </>} />
          <Route path="/:shopId/invoice" element={<>
            <Invoice sendParam={handleSetParam} />
            <Footer shopId={shopId} cartItemsLength={totalItemsCount} />
          </>} />
        </Routes>
      </header>
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
