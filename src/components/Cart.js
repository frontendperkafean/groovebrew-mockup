import React, { useRef, useEffect, useState } from 'react';
import styles from './Cart.module.css';

import ItemLister from './ItemLister';
import {ThreeDots} from 'react-loader-spinner';

import { useParams } from 'react-router-dom';
import { useNavigationHelpers } from './navigationHelpers';

import { getCartDetails } from './itemHelper.js';
import { getItemsByCafeId } from './cartHelpers'; // Import getItemsByCafeId

export default function Cart({ sendParam, totalItemsCount }) {
  const { shopId } = useParams();
  sendParam(shopId);

  const { goToShop, goToInvoice } = useNavigationHelpers(shopId);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); // State to hold total price

  const textareaRef = useRef(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await getCartDetails(shopId);
        
        if(items) setCartItems(items);

        // Calculate total price based on fetched cart items
        const initialTotalPrice = items.reduce((total, itemType) => {
          return total + itemType.itemList.reduce((subtotal, item) => {
            return subtotal + (item.qty * item.price);
          }, 0);
        }, 0);
        setTotalPrice(initialTotalPrice);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        // Handle error if needed
      }
    };

    fetchCartItems();

    const textarea = textareaRef.current;
    if (textarea) {
      const handleResize = () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      };
      textarea.addEventListener('input', handleResize);
      handleResize(); // Call it initially to adjust the height if there's already content
      return () => textarea.removeEventListener('input', handleResize);
    }
  }, [shopId]); // Add shopId as dependency

  const refreshTotal = async () => {
    try {
      const items = await getItemsByCafeId(shopId); // Get items from localStorage
      const updatedTotalPrice = items.reduce((total, localItem) => {
        const cartItem = cartItems.find(itemType =>
          itemType.itemList.some(item => item.itemId === localItem.itemId)
        );

        if (cartItem) {
          const itemDetails = cartItem.itemList.find(item => item.itemId === localItem.itemId);
          return total + (localItem.qty * itemDetails.price);
        }
        return total;
      }, 0);

      setTotalPrice(updatedTotalPrice);
    } catch (error) {
      console.error('Error refreshing total price:', error);
    }
  };

  if (cartItems && cartItems.length < 1)
    return (
      <div className='Loader'>
        <div className='LoaderChild'>
          <ThreeDots />
        </div>
      </div>
    );
  else
    return (
      <div className={styles.Cart}>
        <div style={{ marginTop: '30px' }}></div>
        <h2 className={styles['Cart-title']}>{totalItemsCount} {totalItemsCount !== 1 ? 'items' : 'item'} in Cart</h2>
        <div style={{ marginTop: '-55px' }}></div>
        {cartItems.map(itemType => (
          <ItemLister
            key={itemType.itemTypeId} // Use a unique key based on itemType
            refreshTotal={refreshTotal} // Pass refreshTotal function to ItemLister
            shopId={shopId}
            forCart={true}
            typeName={itemType.typeName}
            itemList={itemType.itemList}
          />
        ))}

        <div className={styles.NoteContainer}>
          <span>Note</span>
          <span></span>
        </div>

        <textarea
          ref={textareaRef}
          className={styles.NoteInput}
          placeholder="Add a note..."
        />

        <div className={styles.TotalContainer}>
          <span>Total:</span>
          <span>Rp {totalPrice}</span>
        </div>
        <button onClick={goToInvoice} className={styles.CheckoutButton}>Checkout</button>
        <div onClick={goToShop} className={styles.BackToMenu}>Back to menu</div>
      </div>
    );
}
