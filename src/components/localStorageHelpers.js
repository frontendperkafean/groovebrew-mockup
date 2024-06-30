// localStorageHelpers.js

// Get cart items from localStorage
export const getLocalStorage = (storageName) => {
    return JSON.parse(localStorage.getItem(storageName)) || [];
};

export const updateLocalStorage = (storageName, array) => {
    localStorage.setItem(storageName, JSON.stringify(array));
    
    const event = new Event('localStorageUpdated');
    window.dispatchEvent(event);
}
