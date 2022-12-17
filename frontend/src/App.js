import './css/App.css';
import { useContext, useEffect, useState } from 'react';
import { Context } from '.';
import { BrowserRouter } from 'react-router-dom';
import Menu from './components/main/Menu';
import Buttons from './components/main/Buttons';
import Notifications from './components/main/Notifications';
import AppRouter from './components/AppRouter';
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { observer } from 'mobx-react-lite';
import { check } from './http/userAPI';
import Header from './components/main/Header';

function App() {
  const { userInfo } = useContext(Context);
  const [loading, isLoading] = useState(true);
  const [state, setState] = useState({
    isPaneOpen: false,
  });

  useEffect(() => {
    check().then(data => {
      userInfo.user = data;
      userInfo.isAuthenticated = true;
    }).catch(() => userInfo.isAuthenticated = false).finally(() => isLoading(false));
  });
  if (loading) {
    return <div></div>
  }

  function closeMenu() {
    setState({ isPaneOpen: false });
    document.querySelector('.blur').style.filter = null;
    setTimeout(() => {
      const topButtons = document.querySelector('.top-buttons');
      if (topButtons) {
        topButtons.style.zIndex = 1;
      }
    }, 500);
  };
  function openMenu() {
    setState({ isPaneOpen: true });
    document.querySelector('.blur').style.filter = 'blur(2px)';
    document.querySelector('.top-buttons').style.zIndex = 0;
  };

  return (
    <BrowserRouter>
      {
        userInfo.isAuthenticated &&
        <>
          <Header /> 
          <Buttons onRequestOpen={openMenu} />
          <Notifications />
          <SlidingPane
            className='show-on-top'
            isOpen={state.isPaneOpen}
            onRequestClose={closeMenu}
            width='23rem'
            hideHeader={true}
          >
            <Menu onRequestClose={closeMenu} />
          </SlidingPane>
        </>
      }

      <AppRouter />
    </BrowserRouter>
  );
}

export default observer(App);
