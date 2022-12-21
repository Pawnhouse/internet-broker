import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DEPOSIT_PATH, WITHDRAWAL_PATH } from '../utils/paths';
import { Context } from '../index';
import MainContainer from '../components/main/MainContainer';
import { Button, Form, Tab, Tabs } from 'react-bootstrap';
import LabeledInput from '../components/LabeledInput';
import { observer } from 'mobx-react-lite';
import { checkDeposit, getBalance, makeTransaction } from '../http/userAPI';
import { hideMessage, showError, showResult } from '../utils/formMessage';
import depositBg from '../img/deposit-bg.png';
import withdrawalBg from '../img/withdrawal-bg.png';
import { getNotifications } from '../http/notififcationAPI';


function Balance() {
  const isDeposit = useLocation().pathname === DEPOSIT_PATH;
  const navigate = useNavigate();
  const { userInfo, notificationInfo } = useContext(Context);
  const [balance, setBalance] = useState(0);
  const [sum, setSum] = useState('');
  const [backgroundImage, setBackgroundImage] = useState();

  useEffect(() => {
    getBalance().then(balance => setBalance(balance)).catch(() => { console.error('balance not load') });

  }, [userInfo]);

  useEffect(() => {
    hideMessage();
    if (window.innerHeight < 800 || window.innerWidth < 1000) {
      setBackgroundImage(null);
    } else if (isDeposit) {
      setBackgroundImage(`url(${depositBg})`);
    } else {
      setBackgroundImage(`url(${withdrawalBg})`);
    }
    setSum('');
    checkDeposit().then(status => {
      if (status != null && status !== 'processing') {
        getBalance().then(balance => setBalance(balance)).catch(() => { });
        getNotifications().then(notifications => notificationInfo.notifications = notifications).catch(() => { });

      }
    }).catch(() => { });
  }, [isDeposit, notificationInfo]);

  const pageName = isDeposit ? 'Make a deposit' : 'Withdraw money';
  const buttonName = isDeposit ? 'Pay' : 'Withdraw';

  async function updateBalance(e) {
    e.preventDefault();
    hideMessage();
    if (sum === '') {
      showError(undefined, 'Input value', '.balance-form');
      return;
    }
    if (+sum <= 0) {
      showError(undefined, 'Sum should be positive', '.balance-form');
      return;
    }
    if (+sum >= 10000 || (+sum > balance && !isDeposit)) {
      showError(undefined, 'Sum is too big', '.balance-form');
      return;
    }
    makeTransaction(Math.round(+sum * 100) / 100, isDeposit).then(redirect_url => {
      if (isDeposit) {
        window.location.replace(redirect_url);
      } else {
        getBalance().then(balance => setBalance(balance)).catch(() => { });
        showResult('You will see result in notifications', '.balance-form');
      }
    }).catch(e => {
      console.log(e);
      let message = e.response?.data?.message ?? 'Server error';
      showError(undefined, message, '.balance-form');
    });
  }
  let location = useLocation().pathname;
  if (location[-1] === '/') {
    location = location.slice(0, -1);
  }
  return (
    <MainContainer pageName={pageName} backgroundImage={backgroundImage}>
      <Tabs
        defaultActiveKey={location}
        id='uncontrolled-tab-example'
        className='mb-3'
        onSelect={(selectedKey) => navigate(selectedKey)}
      >
        <Tab eventKey={DEPOSIT_PATH} title='Deposit' />
        <Tab eventKey={WITHDRAWAL_PATH} title='Withdrawal' />
      </Tabs>
      <Form className='balance-form' onSubmit={updateBalance}>
        <Form.Group className="my-form-line">
          <Form.Label>Balance: </Form.Label>
          <Form.Control className="same-width-input" plaintext readOnly value={balance + '$'} />
        </Form.Group>
        <LabeledInput name='Sum:' controlId='sum' type='number' value={sum} onChange={e => setSum(e.target.value)} />
        <Button variant="primary m-3 rounded-button" type="submit">{buttonName}</Button>
        <span className='success-message form-message' ></span>
        <span className='error-message form-message' ></span>
      </Form>
    </MainContainer>
  )
}

export default observer(Balance);