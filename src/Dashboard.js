// src/Dashboard.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import './App.css';
import SearchInput from './components/SearchInput';
import ItemTypeLister from './components/ItemTypeLister';
import { MusicPlayer } from './components/MusicPlayer';
import ItemLister from './components/ItemLister';

import { getItemTypesWithItems } from './components/itemHelper.js';

function Dashboard({sendParam}) {
  const { shopId } = useParams();
  sendParam(shopId);
  
  const [shopItems, setShopItems] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getItemTypesWithItems(shopId);
        setShopItems(data);
      } catch (error) {
        console.error('Error fetching shop items:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="App">
      <body className="App-header">
        <div style={{ marginTop: '30px' }}></div>
        <h2 className='title'>Menu</h2>
        <div style={{ marginTop: '2px' }}></div>
        <SearchInput />
        <div style={{ marginTop: '15px' }}></div>
        <ItemTypeLister itemTypes={shopItems} />
        <div style={{ marginTop: '-5px' }}></div>
        <h2 className='title'>Music Req.</h2>
        <MusicPlayer />
        <div style={{ marginTop: '-15px' }}></div>
        {shopItems.map(itemType => (
          <ItemLister shopId={shopId} key={itemType.itemTypeId} typeName={itemType.name} itemList={itemType.itemList} />
        ))}
      </body>
    </div>
  );
}

export default Dashboard;
