import { ReactComponent as Notification } from '../../img/notification.svg';
import { useContext, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Context } from '../../index';
import standardPicture from '../../img/standard.jpg';
import { observer } from 'mobx-react-lite';
import { ADMIN_PATH, DEPOSIT_PATH, PANEL_PATH, PROFILE_PATH, STOCK_PATH } from '../../utils/paths';
import { Container } from 'react-bootstrap';
import { getNotifications } from '../../http/notififcationAPI';


function Header() {
  const { userInfo, notificationInfo } = useContext(Context);
  const ref = useRef(null);
  const user = userInfo.user;
  let name = user.firstName + ' ' + user.surname;
  let picture = standardPicture;
  if (user.picture) {
    picture = process.env.REACT_APP_API_URL + '/' + user.picture;
  }

  const logOutAction = () => {
    userInfo.user = null;
    userInfo.isAuthenticated = false;
    localStorage.removeItem('token');
  }

  function openNotifications() {
    document.querySelector('.blur').style.filter = 'blur(2px)';
    const block = document.querySelector('.notifications-block');
    block.style.display = 'block'; 
    const notifications = document.querySelector('.notifications');
    notifications.style.right = (window.innerWidth - ref.current.offsetWidth) / 2 + 'px';
    notifications.scrollTo(0, notifications.scrollHeight);
    getNotifications().then( items => notificationInfo.notifications = items).catch(() => { });

  }

  const MyNavLink = ({ to, children }) => (
    <NavLink className='simple-link mx-3' to={to}>{children}</NavLink>
  )

  return (
    <Container className='desktop' fluid='md' as='header' ref={ref}>
      <nav className='d-flex flex-row align-items-center'>
        <img src='/img/logo.png' alt='logo' height={40} className='mx-3'/>
        {
          user.role === 'administrator' &&
          <MyNavLink to={ADMIN_PATH}>Admin panel</MyNavLink>
        }
        <MyNavLink to={PANEL_PATH}>Work panel</MyNavLink>
        {
          user.role === 'user' &&
          <MyNavLink to={DEPOSIT_PATH}>Balance</MyNavLink>
        }
        <MyNavLink to={STOCK_PATH} >Markets</MyNavLink>
        <NavLink className='simple-link mx-3' to={'/'} onClick={logOutAction}>Log out</NavLink>
      </nav>
      <div className='profile'>
        <NavLink to={PROFILE_PATH} >
          <img src={picture} width={40} height={40} alt='Profile pic' />
        </NavLink>
        <MyNavLink to={PROFILE_PATH}>{name}</MyNavLink>
        <button className='svg' onClick={openNotifications}><Notification/></button>
      </div>
    </Container>
  )
}

export default observer(Header);