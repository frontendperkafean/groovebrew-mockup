import React, { useEffect, useState } from 'react';
import styles from './Invoice.module.css';
import { useParams } from 'react-router-dom';

import ItemLister from './ItemLister';

import { getCartDetails } from './itemHelper.js';

export default function Invoice({ sendParam }) {
  const { shopId } = useParams();
  sendParam(shopId);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await getCartDetails(shopId);
        setCartItems(items);

        // Calculate total price based on fetched cart items
        const totalPrice = items.reduce((total, itemType) => {
          return total + itemType.itemList.reduce((subtotal, item) => {
            return subtotal + (item.qty * item.price);
          }, 0);
        }, 0);
        setTotalPrice(totalPrice);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        // Handle error if needed
      }
    };

    fetchCartItems();
  }, [shopId]); // Dependency on shopId to refetch cart items if shopId changes

  return (
    <div className={styles.Invoice}>
      <div style={{ marginTop: '30px' }}></div>
      <h2 className={styles['Invoice-title']}>Invoice</h2>
      <div style={{ marginTop: '30px' }}></div>
      <div className={styles.RoundedRectangle}>
        {cartItems.map(itemType => (
          <ItemLister shopId={shopId} forInvoice={true} key={itemType.id} typeName={itemType.typeName} itemList={itemType.itemList} />
        ))}
        <div className={styles.TotalContainer}>
          <span>Total:</span>
          <span>Rp {totalPrice}</span>
        </div>
      </div>
      <div className={styles.PaymentOption}>
        <div className={styles.TotalContainer}>
          <span>Payment Option</span>
          <span></span>
        </div>
        <button className={styles.PayButton}>Cashless</button>
        <div className={styles.Pay2Button}>Cash</div>
      </div>
      <div className={styles.PaymentOptionMargin}></div>
    </div>
  );
}
