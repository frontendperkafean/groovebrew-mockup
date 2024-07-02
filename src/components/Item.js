import React, { useState, useRef } from 'react';
import styles from './Item.module.css';

const Item = ({ blank, forCart, forInvoice, name, price, qty, imageUrl, id, onPlusClick, onNegativeClick, onRemoveClick }) => {
  const [selectedImage, setSelectedImage] = useState(imageUrl);
  const fileInputRef = useRef(null);

  const handlePlusClick = () => {
    onPlusClick(id);
  };

  const handleNegativeClick = () => {
    if (qty > 0) {
      onNegativeClick(id);
    }
  };

  const handleRemoveClick = () => {
    onRemoveClick(id);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      // Optionally update the localStorage or other state here
    }
  };

  return (
    <div className={`${styles.item} ${forInvoice ? styles.itemInvoice : ''}`}>
      {!forInvoice && (
        <div className={styles.imageContainer}>
          <img src={selectedImage} alt={name} className={styles.itemImage} />
          {blank && (
            <div className={styles.overlay} onClick={handleImageClick}>
              <span>Click To Add Image</span>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className={styles.fileInput}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
      )}
      <div className={styles.itemDetails}>
        <input className={`${forInvoice ? styles.itemInvoiceName : styles.itemName} ${blank ? styles.blank : styles.notblank}`} value={name} />

        {forInvoice && <>
          <p className={styles.multiplySymbol}>x</p>
          <p className={styles.qtyInvoice}>{qty}</p>
        </>}
        {!forInvoice && <input className={`${styles.itemPrice} ${blank ? styles.blank : styles.notblank}`} value={"Rp." + price} />}

        {!blank && !forInvoice && (
          <div className={styles.itemQty}>
            <svg className={styles.plusNegative} onClick={handleNegativeClick} clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm4.253 7.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z" fill-rule="nonzero" /></svg>
            <p className={styles.itemQtyValue}>{qty}</p>
            <svg className={styles.plusNegative} onClick={handlePlusClick} clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12.002 2c5.518 0 9.998 4.48 9.998 9.998 0 5.517-4.48 9.997-9.998 9.997-5.517 0-9.997-4.48-9.997-9.997 0-5.518 4.48-9.998 9.997-9.998zm0 1.5c-4.69 0-8.497 3.808-8.497 8.498s3.807 8.497 8.497 8.497 8.498-3.807 8.498-8.497-3.808-8.498-8.498-8.498zm-.747 7.75h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z" fill-rule="nonzero" /></svg>
          </div>
        )}

        {blank &&
          <div className={styles.itemQty}>
            <input  className={styles.itemQtyInput} />
          </div>
        }

        {forInvoice && <p className={styles.itemPrice}>Rp {qty * price}</p>}
      </div>
      {forCart && (
        <div className={styles.remove} onClick={handleRemoveClick}>ⓧ</div>
      )}
    </div>
  );
};

export default Item;
