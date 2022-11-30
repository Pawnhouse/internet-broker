import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DEPOSIT_PATH } from '../utils/paths';
import { Context } from '../index';
import MainContainer from '../components/main/MainContainer';
import { Button, Form } from 'react-bootstrap';
import LabeledInput from '../components/LabeledInput';
import { observer } from 'mobx-react-lite';
import { getBalance, makeTransaction } from '../http/userAPI';
import { hideMessage, showError } from '../utils/formMessage';


function Balance() {
  const isDeposit = useLocation().pathname === DEPOSIT_PATH;
  const { userInfo } = useContext(Context);
  const [balance, setBalance] = useState(0);
  const [sum, setSum] = useState('');
  useEffect(() => { 
    getBalance().then(balance => setBalance(balance)).catch(() => { console.error('balance not load')});

  }, [userInfo]);

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
    if (+sum >= 10000 || (+sum >= balance && !isDeposit)) {
      showError(undefined, 'Sum is too big', '.balance-form');
      return;
    }
    makeTransaction(Math.round(+sum), isDeposit).then(balance => {
      setBalance(balance);
      setSum('');
    }).catch(e => {
      let message = e.response?.data?.message ?? 'Server error';
      showError(undefined, message, '.balance-form');
    });
  }

  return (
    <MainContainer pageName={pageName}>
      <Form className='balance-form' onSubmit={updateBalance}>
        <Form.Group className="my-form-line">
          <Form.Label>Balance: </Form.Label>
          <Form.Control className="same-width-input" plaintext readOnly value={balance + '$'} />
        </Form.Group>
        <LabeledInput name='Sum:' controlId='sum' type='number' value={sum} onChange={e => setSum(e.target.value)} />
        <Button variant="primary m-3 rounded-button" type="submit">{buttonName}</Button>
        <span className='error-message form-message' ></span>
      </Form>
    </MainContainer>
  )
}

export default observer(Balance);