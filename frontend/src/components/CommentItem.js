import { Col, Container, Row } from 'react-bootstrap';


function CommentItem({ comment, isBlue }) {
  const user = comment.author;
  let name = (user.firstName ?? '') + ' ' + (user.surname ?? '');
  let role = user.role;
  if (user.isVip) {
    role = 'VIP';
  }
  return (
    <div className='w-100 p-3 d-flex' style={{ background: isBlue ? '#edf4f6' : 'white' }}>
      <img src={comment.author.picture} width={150} height={150} alt='Profile pic' />
      <Container className='ms-3'>
        <Row className='justify-content-evenly'>
          <div className='w-75'>
            <div style={{ minWidth: 150, display: 'inline-block', textAlign: 'left' }}>
              <b>{name}</b>
            </div>
            <span style={{ marginLeft: '10px' }}>
              {role}
            </span>
          </div>
          <Col>
            {comment.date.toLocaleDateString()}
          </Col>
        </Row>
        <Row>
          {comment.text}
        </Row>
      </Container>
    </div>
  )
}

export default CommentItem
