import { useContext, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { PANEL_PATH } from '../../utils/paths';
import { useNavigate } from 'react-router-dom';
import LabeledInput from '../LabeledInput';
import { loginOneTimePassword } from '../../http/userAPI';
import { Context } from '../../index';
import { showError, hideMessage } from '../../utils/formMessage';

export default function OneTime() {
  const { userInfo } = useContext(Context);
  const navigate = useNavigate();
  const [oneTimePassword, setOneTimePassword] = useState('');

  async function signIn(e) {
    e.preventDefault();
    hideMessage();
    let message;
    if (oneTimePassword === '') {
      message = 'Fill in all the fields';
      showError(undefined, message, '.sign-in-form');
      return;
    }

    try {
      const user = await loginOneTimePassword(userInfo.email, +oneTimePassword);
      userInfo.user = user;
      userInfo.isAuthenticated = true;
      navigate(PANEL_PATH);
    } catch (e) {
      message = e.response?.data?.message ?? 'Server error';
      showError(undefined, message, '.sign-in-form');
    }
  }
  return (
    <Form className='center vertical sign-in-form' onSubmit={signIn}>
      <h2 className='page-heading'>Enter one-time password from email</h2>
          <LabeledInput
            controlId='one-time'
            name='One-time password'
            type='number'
            onChange={e => setOneTimePassword(e.target.value)}
          />
      <Button variant="primary m-3 rounded-button" type="submit">Continue</Button>
      <span className='error-message form-message' ></span>
    </Form>
  )
}
