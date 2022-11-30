import { useContext } from 'react';
import { Context } from '../../index';
import '../../css/notifications.css';

function Notifications() {
  const context = useContext(Context)
  const user = context.userInfo.user;
  const notivations = context.notificationInfo.getNotifications(user.id);
  function onClose() {
    document.querySelector('.blur').style.filter = null;
    const block = document.querySelector('.notifications-block');
    block.style.display = 'none';
  }

  return (
    <div className='notifications-block'>
      <div className='dark-background ' onClick={onClose}></div>
      <div className='notifications'>
        {
          notivations.map((notification, index) =>
            <div className='p-2' style={{ background: index % 2 ? '#edf4f6' : 'white' }} key={index}>
              <div className='d-flex justify-content-around pe-2'>
                <b>{notification.sender?.name ?? 'System'}</b>
                {
                  notification.date.toLocaleDateString()
                }
              </div>
              {
                notification.text
              }
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Notifications;