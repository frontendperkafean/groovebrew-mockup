import API_BASE_URL from '../config.js';
import { getItemsByCafeId } from './cartHelpers.js';

export async function getItemTypesWithItems(shopId) {
  try {
      const response = await fetch(`${API_BASE_URL}/item/get-cafe-items/` + shopId);
      
      const data = await response.json();
      return { response, data: data.data }; // Return an object with response and data
  } catch (error) {
      console.error('Failed to fetch item types with items:', error);
      throw error;
  }
}

export async function getCartDetails(shopId) {
    try {
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

function getAuthToken() {
  return localStorage.getItem('auth');
}

export async function updateItemType(shopId, itemTypeId, newName) {
  try {
      const response = await fetch(`${API_BASE_URL}/item/updateType/` + shopId + "/" + itemTypeId, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({ newName })
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Failed to update item type:', error);
      throw error;
  }
}

export async function deleteItemType(shopId, itemTypeId) {
  try {
      const response = await fetch(`${API_BASE_URL}/item/deleteType/` + shopId + "/" + itemTypeId, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${getAuthToken()}`
          }
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }

      return true;
  } catch (error) {
      console.error('Failed to delete item type:', error);
      throw error;
  }
}