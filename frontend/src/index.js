import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import UserInfo from './storage/User';
import StockInfo from './storage/Stock';
import ArticleInfo from './storage/Article';
import NotificationInfo from './storage/Notification';


export const Context = React.createContext(null);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Context.Provider value={{
        userInfo: new UserInfo(),
        stockInfo: new StockInfo(),
        articleInfo: new ArticleInfo(),
        notificationInfo: new NotificationInfo(),
      }}>
      <App />
    </Context.Provider>
  </React.StrictMode>
);


