import { Form, Button } from 'react-bootstrap';
import { SIGN_IN_PATH } from '../../utils/paths';
import { NavLink } from 'react-router-dom';
import { controlIds, names, types } from '../../utils/formData';
import LabeledInput from '../LabeledInput';
import { showError, hideMessage, clearSetters } from '../../utils/formMessage';



export default function Registration({ values, setters }) {
  function nextPhase(e) {
    e.preventDefault();
    hideMessage();
    let i, message;
    if (!values[0] || !values[1]) {
      i = values.slice(0, 3).indexOf('');
      message = 'Fill in all the fields';
      showError(i, message, '.register-first-phase');
      return;
    }
    if (values[1].length < 8) {
      message = 'Password must be at least 8 characters';
      showError(i, message, '.register-first-phase');
      return;
    }
    if (values[1].search(/[a-zA-Z]/) === -1 || values[1].search(/\d/) === -1) { 
      message = 'Password must contain letter and number';
      showError(i, message, '.register-first-phase');
      return;
    }
    if (values[1] !== values[2]) {
      message = 'The passwords don\'t match';
      showError(i, message, '.register-first-phase');
      return;
    }

    document.querySelector('.register-first-phase').style.display = 'none';
    document.querySelector('.register-second-phase').style.display = null;
  }

  return (
    <Form className='center vertical register-first-phase' onSubmit={nextPhase}>
      <h2 className='page-heading'>Registration</h2>
      {
        [0, 1, 2].map((i) => (
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
      <Button variant="primary m-3 rounded-button" type="submit">Continue</Button>
      <span style={{ alignSelf: 'start' }}>
        {'Already have an account? '}
        <NavLink to={SIGN_IN_PATH} onClick={clearSetters(setters)}>Sign in</NavLink>
      </span>
      <span className='error-message form-message' ></span>
    </Form>
  )
}
