import React, { useContext, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { PANEL_PATH, SIGN_IN_PATH, SIGN_UP_PATH } from '../utils/paths';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { controlIds, names, types } from '../utils/formData';
import LabeledInput from '../components/LabeledInput';
import { login, register } from '../http/userAPI';
import { Context } from '../index';
import {showError, hideMessage, clearSetters} from '../utils/formMessage';


function Registration({ values, setters }) {
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

function Registration2Phase({ values, setters }) {
  const { userInfo } = useContext(Context);
  const navigate = useNavigate();

  async function signUp() {
    hideMessage();
    let i, message;
    if (!values[3] || !values[5]) {
      if (!values[3]){
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

function SignInForm({ values, setters }) {
  const { userInfo } = useContext(Context);
  const navigate  = useNavigate();

  async function signIn(e) {
    e.preventDefault();
    hideMessage();
    let i, message;
    if (!values[0] || !values[1]) {
      i = values.slice(0, 2).indexOf('');
      message = 'Fill in all the fields';
      showError(i, message, '.sign-in-form');
      return;
    }

    try {
      const user = await login(values[0], values[1]);
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
      <h2 className='page-heading'>Sign in to continue</h2>
      {
        [0, 1].map((i) => (
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
        {'Dont have an account? '}
        <NavLink to={SIGN_UP_PATH} onClick={clearSetters(setters)}>Sign up</NavLink>
      </span>
      <span className='error-message form-message' ></span>
    </Form>
  )
}

function Auth() {
  const isSignIn = useLocation().pathname === SIGN_IN_PATH;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [surname, setSurname] = useState('');



  const values = [email, password, password2, firstName, middleName, surname];
  const setters = [setEmail, setPassword, setPassword2, setFirstName, setMiddleName, setSurname];
  return (
    <Container className='d-flex blur p-0' fluid>
      <div className='auth-image' style={{ backgroundImage: `url('img/authentication.jpg')` }}></div>
      <Container className='center' style={{ width: '60%' }}>
        {isSignIn ?
          <SignInForm values={values} setters={setters} /> :
          <div>
            <Registration values={values} setters={setters} />
            <Registration2Phase values={values} setters={setters} />
          </div>
        }
      </Container>

    </Container>
  );
}

export default Auth;