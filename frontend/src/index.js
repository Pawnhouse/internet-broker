import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import UserInfo from './storage/User';
import stockInfo from './storage/Stock';
import CommentInfo from './storage/Comment';
import ArticleInfo from './storage/Article';
import NotificationInfo from './storage/Notification';


export const Context = React.createContext(null);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Context.Provider value={{
        userInfo: new UserInfo(),
        stockInfo: new stockInfo(),
        commentInfo: new CommentInfo(),
        articleInfo: new ArticleInfo(),
        notificationInfo: new NotificationInfo(),
      }}>
      <App />
    </Context.Provider>
  </React.StrictMode>
);


