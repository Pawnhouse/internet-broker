import { ReactComponent as Hamburger } from '../../img/hamburger.svg';
import { ReactComponent as Notification } from '../../img/notification.svg';
import { useContext } from 'react';
import { Context } from '../../index';
import { getNotifications } from '../../http/notififcationAPI';


function Buttons(props) {
   const { notificationInfo } = useContext(Context);
  function openNotifications() {
    document.querySelector('.blur').style.filter = 'blur(2px)';
    const block = document.querySelector('.notifications-block');
    block.style.display = 'block';
    const notifications = document.querySelector('.notifications');
    notifications.scrollTo(0, notifications.scrollHeight); 
    getNotifications().then( notifications => notificationInfo.notifications = notifications).catch(() => { });
  }

  return (
    <div className='top-buttons'>
      <button className='svg' onClick={openNotifications}><Notification/></button>
      <button className='svg' onClick={props.onRequestOpen}><Hamburger/></button>
    </div>
  )
}

export default Buttons;