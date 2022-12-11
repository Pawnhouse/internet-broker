import { useContext, useState, useEffect } from 'react';
import { Col, Container, Row, FormControl, Button } from 'react-bootstrap';
import standardPicture from '../img/standard.jpg';
import { Context } from '../index';
import { ReactComponent as Cross } from '../img/cross.svg';
import { createComment, deleteComment, getComments } from '../http/commentAPI';
import { getNotifications } from '../http/notififcationAPI';


function CommentItem({ comment, isBlue, onDelete }) {
  const { userInfo } = useContext(Context);
  const user = userInfo.user;

  const author = comment.author;
  let name = author.name || author.firstName + ' ' + author.surname;
  let role = author.role;
  if (author.role === 'user') {
    role = '';
  }
  if (author.isVip) {
    role = 'VIP';
  }
  let picture = standardPicture;
  if (author.picture) {
    picture = process.env.REACT_APP_API_URL + '/' + author.picture;
  }

  return (
    <div className='w-100 p-3 d-flex' style={{ background: isBlue ? '#edf4f6' : 'white' }}>
      <img src={picture} width={120} height={120} alt='Profile pic' />
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
            {
              (user.role === 'moderator' ||
                user.role === 'administrator') &&
              <button className='svg close-menu ms-3' onClick={onDelete}>
                <Cross />
              </button>
            }
          </Col>
        </Row>
        <Row>
          {comment.text}
        </Row>
      </Container>
    </div>
  )
}


export default function CommentBlock() {
  const { stockInfo, notificationInfo } = useContext(Context);
  const stock = stockInfo.currentStock;
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    getComments().then(
      comments => setCommentList(
        comments.filter(comment => comment.sectionId === stock.sectionId).sort((a, b) => b.date - a.date)
      )
    ).catch(() => { });
  }, [stock]);

  function addComment() {
    createComment(comment, stock.sectionId).then(
      comment => {
        setCommentList([comment, ...commentList]);
        setComment('');
      }
    ).catch(() => { })
  }

  function removeComment(id) {
    deleteComment(id).then(() => {
      setCommentList(commentList.filter(comment => comment.id !== id));
      getNotifications().then(notifications =>
        notificationInfo.notifications = notifications
      ).catch(() => { });
    }).catch(() => { });
  }

  return (
    <>
      <Row className='align-items-end my-3'>
        <Col md={8}>
          <FormControl as="textarea" rows={3} value={comment} onChange={e => setComment(e.target.value)} />
        </Col>
        <Col>
          <Button className='rounded-button' onClick={addComment}>Post</Button>
        </Col>
      </Row>
      {
        commentList.map((comment, index) => {
          return <CommentItem
            comment={comment}
            key={comment.id}
            isBlue={index % 2}
            onDelete={() => removeComment(comment.id)}
          />
        })
      }
    </>
  )
}
