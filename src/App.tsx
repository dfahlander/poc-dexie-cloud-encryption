import React from 'react';
import logo from './logo.svg';
import './App.css';
import { AddFriendForm } from './AddFriendForm';
import { FriendList } from './FriendList';
import { db } from './db';

function App() {
  return (<>
    <h1>My simple Dexie app</h1>

    <h2>Add Friend</h2>
  <AddFriendForm defaultAge={21} />

  <h2>Friend List</h2>
  <FriendList  />
  <button onClick={()=>db.cloud.login()}>Login</button>
  </>);
}

export default App;
