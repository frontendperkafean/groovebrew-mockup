// src/Dashboard.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import '../App.css';
import SearchInput from '../components/SearchInput';
import ItemTypeLister from '../components/ItemTypeLister';
import { MusicPlayer } from '../components/MusicPlayer';
import ItemLister from '../components/ItemLister';

import {ThreeDots} from 'react-loader-spinner';

import { getItemTypesWithItems } from '../helpers/itemHelper.js';
import { getLocalStorage } from '../helpers/localStorageHelpers';

function Dashboard({ sendParam, socket, user }) {
  const { shopId } = useParams();
  const [ loading, setLoading ] = useState(true);
  const [ screenMessage, setScreenMessage ] = useState('');
  sendParam(shopId);

  const [shopItems, setShopItems] = useState([]);

  useEffect(() => {
    async function fetchData() {
        try {
            setLoading(true);
            const { response, data } = await getItemTypesWithItems(shopId);
            console.log(response)
            if (response.status === 200) {
                setShopItems(data);
                setLoading(false);
                socket.emit('join-room', { token: getLocalStorage('auth'), shopId });
            } else {
                setScreenMessage('Kafe tidak tersedia');
            }
        } catch (error) {
            console.error('Error fetching shop items:', error);
            setLoading(false); // Ensure loading state is turned off on error
        }
    }

    fetchData();
}, [shopId]);

  if (loading)
    return (
      <div className='Loader'>
        <div className='LoaderChild'>
          <ThreeDots />
          <h1>{screenMessage}</h1>
        </div>
      </div>
    );
  else
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
          <MusicPlayer socket={socket} shopId={shopId} />
          <div style={{ marginTop: '-15px' }}></div>
          {shopItems.map(itemType => (
            <ItemLister shopId={shopId} user={user} key={itemType.itemTypeId} itemTypeId={itemType.itemTypeId} typeName={itemType.name} itemList={itemType.itemList} />
          ))}
        </body>
      </div>
    );
  }

  export default Dashboard;
