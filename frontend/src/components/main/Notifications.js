import { useContext, useEffect } from 'react';
import { Context } from '../../index';
import '../../css/notifications.css';
import { observer } from 'mobx-react-lite';
import { getNotifications } from '../../http/notififcationAPI';

function Notifications() {
  const { userInfo, notificationInfo } = useContext(Context);
  useEffect(() => {
    getNotifications().then((notifications) => notificationInfo.notifications = notifications).catch(() => { })
  }, [notificationInfo, userInfo.user]);
  const notifications = notificationInfo.getNotifications(userInfo.user.id);

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
          notifications.map((notification, index) =>
            <div className='p-2' style={{ background: index % 2 ? '#edf4f6' : 'white' }} key={notification.id}>
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

export default observer(Notifications);