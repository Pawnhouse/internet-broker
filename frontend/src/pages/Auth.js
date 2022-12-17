import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { SIGN_IN_PATH } from '../utils/paths';
import { useLocation } from 'react-router-dom';
import PlaceholderImage from "../img/placeholderAuth.jpg";
import SignInForm from '../components/authentication/signIn';
import Registration from '../components/authentication/registration';
import Registration2Phase from '../components/authentication/registration2Phase';
import OneTime from '../components/authentication/oneTime';


function Auth() {
  const isSignIn = useLocation().pathname === SIGN_IN_PATH;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [surname, setSurname] = useState('');
  const [phase, setPhase] = useState(1);

  const placeholderImage = new Image();
  placeholderImage.src = PlaceholderImage;
  placeholderImage.onload = () =>
    document.querySelector('.auth-image').style.backgroundImage = `url('img/authentication.jpg')`;
  const values = [email, password, password2, firstName, middleName, surname];
  const setters = [setEmail, setPassword, setPassword2, setFirstName, setMiddleName, setSurname];
  return (
    <Container className='d-flex blur p-0' fluid>
      <div className='auth-image-wrapper' style={{ backgroundImage: `url(${PlaceholderImage})` }}>
        <div className='auth-image' ></div>
      </div>
      <Container className='center' style={{ width: '60%' }}>
        {
          isSignIn && phase === 1 &&
          <SignInForm values={values} setters={setters} onSuccess={() => setPhase(2)}/>
        }
        {
          isSignIn && phase === 2 &&
          <OneTime values={values} setters={setters} />
        }

        {
          !isSignIn &&
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