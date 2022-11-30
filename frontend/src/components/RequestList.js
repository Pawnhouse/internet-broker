import { ReactComponent as Cross } from '../img/cross.svg';
import { ReactComponent as CheckMark } from '../img/check-mark.svg';
import { Col, Container, Row } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import { Context } from '../index';
import { approveRequest, dismissRequest, getRequests } from '../http/notififcationAPI';


function RequestItem({ request }) {
  const {notificationInfo} = useContext(Context);
  const { person, role, date } = request;

  function dismiss() {
    dismissRequest(request).then(() => {
      notificationInfo.deleteRequest(request);
    }).catch(() => {});
  }

  function approve() {
    approveRequest(request).then(() => {
      notificationInfo.deleteRequest(request);
    }).catch(() => {});
  }

  return (
    <Col md={6}>
      <div className='stock-item'>
        <div style={{ minWidth: 100, display: 'inline-block', textAlign: 'left' }}>
          {person.name}
        </div>
        <span style={{ marginLeft: '10px' }}>
          {role}
        </span>
        <span style={{ marginLeft: '10px' }}>
          {date.toLocaleDateString()}
        </span>
        <div className='d-flex justify-content-between' style={{ width: 100 }}>
          <button className='svg' onClick={approve}><CheckMark /></button>

          <button className='svg' onClick={dismiss} ><Cross /></button>

        </div>

      </div>
    </Col>
  )

}
function RequestList() {
  const { notificationInfo } = useContext(Context);
  const requests = notificationInfo.requests;
  useEffect(()=> {
    getRequests().then(requests => {
      notificationInfo.requests = requests;
    });
  }, [notificationInfo]);

  return (
    <Container className='mt-5'>
      <Row>
        {
          requests.map((request) =>
            <RequestItem key={request.id} request={request} />
          )
        }
      </Row>
    </Container>
  )
}

export default observer(RequestList)
