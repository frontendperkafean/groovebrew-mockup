import React, { useState } from 'react';
import styles from './ItemLister.module.css';
import Item from './Item';
import { getItemQtyFromCart, updateItemQtyInCart, removeItemFromCart } from './cartHelpers.js';
import { getItemImageUrl } from './itemHelper.js';

const ItemLister = ({ refreshTotal, shopId, typeName, itemList, forCart, forInvoice }) => {
  // State to manage item quantities
  const [items, setItems] = useState(itemList.map(item => ({
    ...item,
    qty: getItemQtyFromCart(shopId, item.itemId)
  })));

  // Function to handle increasing item quantity
  const handlePlusClick = (itemId) => {
    const updatedItems = items.map(item => {
      if (item.itemId === itemId) {
        const newQty = item.qty + 1;
        updateItemQtyInCart(shopId, itemId, newQty); // Update localStorage

        if (forCart) refreshTotal();

        return { ...item, qty: newQty };
      }
      return item;
    });
    setItems(updatedItems);
    console.log(items)
  };

  const handleNegativeClick = (itemId) => {
    const updatedItems = items.map(item => {
      if (item.itemId === itemId && item.qty > 0) {
        const newQty = item.qty - 1;
        updateItemQtyInCart(shopId, itemId, newQty); // Update localStorage

        if (forCart){
          refreshTotal(); // Refresh total if forCart
          // Return item with updated quantity only if newQty is greater than 0
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        else return { ...item, qty: newQty };
      }
      return item;
    }).filter(item => item !== null); // Filter out items with null (qty <= 0)

    setItems(updatedItems);
    console.log(updatedItems);
  };


  // Function to handle removing item from localStorage and state
  const handleRemoveClick = (itemId) => {
    removeItemFromCart(shopId, itemId); // Remove from localStorage
    const updatedItems = items.filter(item => item.itemId !== itemId);
    setItems(updatedItems);

    if (!forCart) return;
    refreshTotal();
  };

  return (
    <>
      {items.length > 0 &&
        <div className={`${styles['item-lister']}`}>
          <h2 className={styles['title']}>{typeName}</h2>
          <div className={styles['item-list']}>
            {items.map(item => {
              return !forCart || (forCart && item.qty > 0) ? (
                <Item
                  key={item.itemId}
                  forCart={forCart}
                  forInvoice={forInvoice}
                  name={item.name}
                  price={item.price}
                  qty={item.qty} // Pass updated qty to Item
                  imageUrl={getItemImageUrl(item.image)}
                  onPlusClick={() => handlePlusClick(item.itemId)}
                  onNegativeClick={() => handleNegativeClick(item.itemId)}
                  onRemoveClick={() => handleRemoveClick(item.itemId)}
                />
              ) : null;
            })}
          </div>
        </div>
      }
    </>
  );
};

export default ItemLister;
