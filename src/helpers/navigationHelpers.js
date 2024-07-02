import { useNavigate } from 'react-router-dom';

/**
 * Custom hook to provide navigation functions.
 * @param {string} params - The shop ID for constructing URLs.
 * @returns {Object} - Navigation functions.
 */
export const useNavigationHelpers = (params) => {
  const navigate = useNavigate();

  const goToShop = () => {
    navigate(`/${params}/`);
  };

  const goToCart = () => {
    navigate(`/${params}/cart`);
  };

  const goToInvoice = () => {
    navigate(`/${params}/invoice`);
  };

  return {
    goToShop,
    goToCart,
    goToInvoice,
  };
};
