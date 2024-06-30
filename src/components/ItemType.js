import React from 'react';
import './ItemType.css';

export default function ItemType({ name, imageUrl }) {
  return (
    <div className="item-type">
      <div className="item-type-rect">
        <img src={imageUrl} alt={name} className="item-type-image" />
      </div>
      <div className="item-type-name">{name}</div>
    </div>
  );
}
