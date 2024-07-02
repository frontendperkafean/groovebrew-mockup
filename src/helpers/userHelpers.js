import { getLocalStorage, updateLocalStorage } from './localStorageHelpers';
import API_BASE_URL from '../config.js';

export async function checkToken() {
  const token = getLocalStorage('auth');
  if (token) {
    try {
      const response = await fetch(API_BASE_URL + '/user/check-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        const responseData = await response.json();
        
        return {ok: true, user: responseData};
      } else {
        updateLocalStorage('auth', '');
        return {ok: false};
      }
    } catch (error) {
      console.error('Error occurred while verifying token:', error.message);
      return {ok: false};
    }
  }
  return {ok: false};
};

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(API_BASE_URL + `/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const responseData = await response.json();

    if (response.ok) {
      return { success: true, token: responseData.token, cafeId: responseData.cafeId };
    } else {
      return { success: false, token: null };
    }
  } catch (error) {
    console.error('Error occurred while logging in:', error.message);
    return { success: false, token: null };
  }
};