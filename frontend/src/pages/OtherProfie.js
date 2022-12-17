import { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import standardPicture from '../img/standard.jpg';
import {  names, types } from '../utils/formData';
import '../css/profile.css';
import MainContainer from '../components/main/MainContainer';
import { hideMessage, showError, showResult } from '../utils/formMessage';
import { getUser, updateRole } from '../http/userAPI';
import { useParams } from 'react-router-dom';


function LabelsGroup({ labelArray, values }) {
  return (
    <Form className='center vertical' as='div'>
      {
        labelArray.map((i) => (
          <Form.Group className="my-form-line" key={i}>
            <Form.Label>{names[i]}</Form.Label>
            <Form.Control
              type={types[i]}
              className="same-width-input"
              defaultValue={values[i]}
              disabled
            />
          </Form.Group>
        ))
      }
    </Form>
  )
}


function OtherProfile() {
  const params = useParams();
  const personId = +params.id;

  const [user, setUser] = useState({});
  let picture = standardPicture;
  if (user.picture) {
    picture = process.env.REACT_APP_API_URL + '/' + user.picture;
  }

  let actualRole = user.role;
  if (actualRole === 'user' && user.isVip) {
    actualRole = 'vip';
  }
  const [role, setRole] = useState(actualRole);
  const initialValues = [user.email, '', '', user.firstName, user.middleName, user.surname];

  useEffect(() => {
    getUser(personId).then((user) => setUser(user));
  }, [personId]);

  if (!user.id) {
    return <div className='blur error-not-found'>404 user not found</div>
  }

  async function updateProfile(e) {
    e.preventDefault();
    hideMessage();
    let message = '';

    try {
      if (role !== actualRole) {
        await updateRole(user.id, role);
        message = 'updated';
        if (role === 'vip') {
          user.role = 'user';
          user.isVip = true;
        } else {
          user.role = role;
        }
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
            <LabelsGroup labelArray={[3, 4, 5]} values={initialValues} />
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Select
              className='g-0'
              tyle={{ width: '200px' }}
              onChange={e => setRole(e.target.value)}
              defaultValue={actualRole}
            >
              <option value='user'>User</option>
              <option value='vip'>VIP</option>
              <option value="analyst">Analyst</option>
              <option value="moderator">Moderator</option>
              <option value="administrator">Administrator</option>
            </Form.Select>
            {
              user.role === 'analyst' &&
              <Form.Group controlId="company" className="my-3">
                <Form.Label>Company</Form.Label>
                <Form.Control disabled value={user.company ?? ''} />
              </Form.Group>
            }
          </Col>
          <Col>
            <LabelsGroup labelArray={[0]} values={initialValues} />
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

export default OtherProfile;