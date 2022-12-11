import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Context } from '../../index';
import { ReactComponent as Cross } from '../../img/cross.svg';
import standardPicture from '../../img/standard.jpg';
import { observer } from 'mobx-react-lite';
import { ADMIN_PATH, DEPOSIT_PATH, PANEL_PATH, PROFILE_PATH, STOCK_PATH, WITHDRAWAL_PATH } from '../../utils/paths';


function Menu(props) {
  const { userInfo } = useContext(Context);
  const user = userInfo.user;
  let name = user.firstName + ' ' + user.surname;
  let picture = standardPicture;
  if (user.picture) {
    picture = process.env.REACT_APP_API_URL + '/' + user.picture;
  }

  const logOutAction = () => {
    props.onRequestClose();
    userInfo.user = null;
    userInfo.isAuthenticated = false;
    localStorage.removeItem('token');
  }

  const MyNavLink = ({ to, children }) => (
    <NavLink className="simple-link" to={to} onClick={props.onRequestClose}>{children}</NavLink>
  )
  return (
    <div className='menu'>
      <div className='right'>
        <button className='svg close-menu' onClick={props.onRequestClose}><Cross /></button>
      </div>
      <div className='profile'>
        <MyNavLink to={PROFILE_PATH}>{name}</MyNavLink>
        <NavLink to={PROFILE_PATH} onClick={props.onRequestClose}>
          <img src={picture} width={100} height={100} alt='Profile pic' />
        </NavLink>
      </div>
      <nav className="list">
        {
          user.role === 'administrator' &&
          <MyNavLink to={ADMIN_PATH}>Admin panel</MyNavLink>
        }
        <MyNavLink to={PANEL_PATH}>Work panel</MyNavLink>
        {
          user.role === 'user' &&
          <>
            <MyNavLink to={WITHDRAWAL_PATH}>Withdraw money</MyNavLink>
            <MyNavLink to={DEPOSIT_PATH}>Make a deposite</MyNavLink>
          </>
        }
        <MyNavLink to={STOCK_PATH} >Markets</MyNavLink>
      </nav>
      <nav className="list">
        <NavLink className="simple-link" to={'/'} onClick={logOutAction}>Log out</NavLink>
      </nav>
    </div>
  )
}

export default observer(Menu)