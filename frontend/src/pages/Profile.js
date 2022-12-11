import { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useContext } from 'react';
import { Context } from '../index'
import standardPicture from '../img/standard.jpg';
import LabeledInput from '../components/LabeledInput';
import { controlIds, names, types } from '../utils/formData';
import '../css/profile.css';
import MainContainer from '../components/main/MainContainer';
import { createRequest, getPersonRequests } from '../http/notififcationAPI';
import { hideMessage, showError, showResult } from '../utils/formMessage';
import { check, getCompany, newPicture, updateCompany, updateUser } from '../http/userAPI';


function LabelsGroup({ labelArray, values, setters }) {
  return (
    <Form className='center vertical' as='div'>
      {
        labelArray.map((i) => (
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
    </Form>
  )
}


function Profile() {
  const { userInfo } = useContext(Context);
  const user = userInfo.user;
  let picture = standardPicture;
  if (user.picture) {
    picture = process.env.REACT_APP_API_URL + '/' + user.picture;
  }

  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [firstName, setFirstName] = useState(user.firstName);
  const [middleName, setMiddleName] = useState(user.middleName);
  const [surname, setSurname] = useState(user.surname);

  const [file, setFile] = useState(null);
  const [role, setRole] = useState(user.role);
  const [canRequest, setCanRequest] = useState(false);
  const [company, setCompany] = useState('');

  const initialValues = [user.email, '', '', user.firstName, user.middleName, user.surname];
  const values = [email, password, password2, firstName, middleName, surname];
  const setters = [setEmail, setPassword, setPassword2, setFirstName, setMiddleName, setSurname];

  useEffect(() => {
    if (user.role !== 'administrator') {
      getPersonRequests(user).then(result => {
        if (result.length === 0) {
          setCanRequest(true);
        }
      }).catch(() => { });
    }
    if (user.role === 'analyst') {
      getCompany().then(company => setCompany(company ?? '')).catch(() => { });
    }
  }, [user]);

  async function pictureUpdate() {
    const formData = new FormData();
    formData.append('filetoupload', file);
    formData.append('id', `${user.id}`);
    await newPicture(formData);
    const updatedUser = await check();
    userInfo.user = updatedUser;
  }

  async function requestUpdate() {
    let isChanged = false;
    for (let i = 0; i < values.length; i++) {
      if (values[i] !== initialValues[i]) {
        isChanged = true;
      }
    }

    if (isChanged) {
      const newUser = { id: user.id }
      if (user.email !== values[0]) {
        newUser.email = values[0];
      }
      if (values[1] !== '') {
        newUser.password = values[1];
      }
      [newUser.firstName, newUser.middleName, newUser.surname] = values.slice(3);
      await updateUser(newUser);
      Object.keys(newUser).forEach(key => user[key] = newUser[key]);
    }

  }

  async function updateProfile(e) {
    e.preventDefault();
    hideMessage();
    let message = '';
    if (file) {
      try {
        await pictureUpdate();
        message = 'File updated';
        showResult(message, '.profile-form');
      } catch {
        message = e.response?.data?.message ?? 'Server error';
        showError(undefined, message, '.profile-form');
      }
      return;
    }

    let i;
    [5, 3, 0].forEach(index => {
      if (!values[index]) {
        i = index;
      }
    });
    if (i !== undefined) {
      message = 'Fill in all the fields';
      showError(i, message, '.profile-form');
      return;
    }
    if (values[1] !== '' && values[1] !== values[2]) {
      message = 'The passwords don\'t match';
      showError(undefined, message, '.profile-form');
      return;
    }

    try {
      if (role !== user.role) {
        await createRequest(user.id, role);
        message = 'Request sended.';
        setRole(user.role);
        setCanRequest(false);
      }
      else {
        await requestUpdate();
        if (user.role === 'analyst') {
          updateCompany(company);
        }

        message = 'User data updated.';
      }

    } catch (e) {
      message = e.response?.data?.message ?? 'Server error';
      showError(undefined, message, '.profile-form');
      return;
    }
    showResult(message, '.profile-form');
  }

  return (
    <MainContainer pageName='Profile'>
      <Form onSubmit={updateProfile} className='profile-form'>
        <Row className='mb-5'>
          <Col>
            <img src={picture} width={200} height={200} alt='Profile pic' />
          </Col>
          <Col>
            <LabelsGroup labelArray={[3, 4, 5]} values={values} setters={setters} />
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Profile picture</Form.Label>
              <Form.Control type="file" onChange={e => setFile(e.target.files[0])} />
            </Form.Group>

            <Form.Select
              className='g-0'
              tyle={{ width: '200px' }}
              onChange={e => setRole(e.target.value)}
              value={role}
              disabled={!canRequest}
            >
              <option value='user'>User</option>
              <option value='vip'>VIP</option>
              <option value="analyst">Analyst</option>
              <option value="moderator">Moderator</option>
              <option value="administrator">Administrator</option>
            </Form.Select>
            {
              role === 'analyst' &&
              <Form.Group controlId="company" className="my-3">
                <Form.Label>Company</Form.Label>
                <Form.Control onChange={e => setCompany(e.target.value)} value={company} />
              </Form.Group>
            }
          </Col>
          <Col>
            <LabelsGroup labelArray={[0, 1, 2]} values={values} setters={setters} />
          </Col>
        </Row>

        <div>
          <Button variant="primary m-3 rounded-button" type="submit">Save</Button>
          <span className='success-message form-message' ></span>
          <span className='error-message form-message' ></span>
        </div>
      </Form>
    </MainContainer>
  )
}

export default Profile;