import { useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { PANEL_PATH } from '../../utils/paths';
import { useNavigate } from 'react-router-dom';
import { controlIds, names, types } from '../../utils/formData';
import LabeledInput from '../LabeledInput';
import { register } from '../../http/userAPI';
import { Context } from '../../index';
import { showError, hideMessage } from '../../utils/formMessage';


export default function Registration2Phase({ values, setters }) {
  const { userInfo } = useContext(Context);
  const navigate = useNavigate();

  async function signUp() {
    hideMessage();
    let i, message;
    if (!values[3] || !values[5]) {
      if (!values[3]) {
        i = 3;
        message = 'Enter first name';
      } else {
        i = 5;
        message = 'Enter surname';
      }
      showError(i, message, '.register-second-phase');
      return;
    }

    try {
      const user = await register(values[0], values[1], values[3], values[4], values[5]);
      userInfo.user = user;
      userInfo.isAuthenticated = true;
      navigate(PANEL_PATH);

    } catch (e) {
      message = e.response?.data?.message ?? 'Server error';
      showError(undefined, message, '.register-second-phase');
    }
  }
  return (
    <Form className='center vertical register-second-phase' style={{ display: 'none' }}>
      <h2 className='page-heading'>Registration</h2>
      {
        [3, 4, 5].map((i) => (
          <LabeledInput
            controlId={controlIds[i]}
            name={names[i]}
            type={types[i]}
            key={i}
            value={values[i]}
            onChange={e => setters[i](e.target.value)}
          />
        ))
      }
      <Button variant="primary m-3 rounded-button" onClick={signUp}>Sign up</Button>
      <span className='error-message form-message' ></span>
    </Form>
  )
}