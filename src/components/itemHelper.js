import API_BASE_URL from './config';
import { getItemsByCafeId } from './cartHelpers';
import { getCartStorage } from './localStorageHelpers';

export async function getItemTypesWithItems(shopId) {
    try {
        const response = await fetch(`${API_BASE_URL}/item/get-cafe-items/` + shopId);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch item types with items:', error);
        throw error;
    }
}

export async function getCartDetails(shopId) {
    try {
        console.log(getItemsByCafeId(shopId));
      const response = await fetch(`${API_BASE_URL}/item/get-cart-details/` + shopId , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(getItemsByCafeId(shopId)),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch cart details');
      }
  
      const cartDetails = await response.json();
      console.log(cartDetails);
      return cartDetails;
    } catch (error) {
      console.error('Error:', error);
    }
}

export function getItemImageUrl(notimageurl) {
    return API_BASE_URL + '/' + notimageurl;
}