// App.js

import './App.css';
import './components/Loading.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Dashboard from './Dashboard';
import Cart from './components/Cart';
import Invoice from './components/Invoice';
import Footer from './components/Footer';
import { calculateTotals } from './components/cartHelpers'; // Import calculateTotals from cartHelpers

function App() {
  // State to hold total items count and total price
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
  }, [shopId!='']);

  // Function to handle setting parameters from Dashboard
  const handleSetParam = (param) => {
    setShopId(param);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/:shopId" element={<>
            <Dashboard sendParam={handleSetParam} />
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
