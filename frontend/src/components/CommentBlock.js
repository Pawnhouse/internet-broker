import { useContext, useState, useEffect } from 'react';
import { Col, Container, Row, FormControl, Button } from 'react-bootstrap';
import standardPicture from '../img/standard.jpg';
import { Context } from '../index';
import { ReactComponent as Cross } from '../img/cross.svg';

import { createComment, deleteComment, editComment, getComments } from '../http/commentAPI';
import { getNotifications } from '../http/notififcationAPI';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { PROFILE_PATH } from '../utils/paths';
import { ReactComponent as Info } from '../img/info.svg';
import { editArticleText } from '../http/descriptionAPI';


function CommentItem({ comment, isBlue, onDelete, edit }) {
  const { userInfo } = useContext(Context);
  const user = userInfo.user;

  const author = comment.author;
  let name = author.name || author.firstName + ' ' + author.surname;
  let role = author.role;
  if (author.role === 'user') {
    role = '';
  }
  if (author.role === 'user' && author.isVip) {
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
              <button className='svg ms-3' onClick={onDelete}>
                <Cross />
              </button>
            }
            {
              user.role === 'administrator' &&
              <NavLink className='svg ms-3' to={PROFILE_PATH + '/' + author.id}>
                <Info />
              </NavLink>
            }
          </Col>
        </Row>
        {
          user.role !== 'moderator' &&
          user.role !== 'administrator' &&
          <Row>
            {comment.text}
          </Row>
        }
        {
          (user.role === 'moderator' ||
            user.role === 'administrator') &&
          <Row onClick={() => edit(comment.id)}>
            {comment.text}
          </Row>
        }
      </Container>
    </div>
  )
}


export default function CommentBlock( {changeParagraph, onSuccess }) {
  const { stockInfo, notificationInfo } = useContext(Context);
  const stock = stockInfo.currentStock;
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [editId, setEditId] = useState(null);
  const params = useParams();
  let sectionId = +params.id;
  if (!sectionId) {
    sectionId = stock.sectionId;
  }

  useEffect(() => {
    getComments().then(
      comments => setCommentList(
        comments.filter(comment => comment.sectionId === sectionId)
          .sort((a, b) => b.date - a.date)
          .sort((a, b) => +b.author.isVip - +a.author.isVip)
      )
    ).catch(() => { });
  }, [stock, sectionId]);
  useEffect(() => {
    if (changeParagraph) {
      setComment(changeParagraph.text);
    }
  }, [changeParagraph]);

  function addComment() {
    if (changeParagraph) {
      changeArticleParagraph();
      return;
    }
    if (editId != null) {
      editComment(editId, comment).then(() => {
        const initial = commentList.find(comment => comment.id === editId);
        const other = commentList.filter(comment => comment.id !== editId);
        setCommentList([{ ...initial, text: comment }, ...other]);
        setComment('');
        setEditId(null);
      }).catch(() => { });
      return;
    }
    createComment(comment, sectionId).then(
      comment => {
        setCommentList([comment, ...commentList]);
        setComment('');
      }
    ).catch(() => { });
  }

  function edit(id) {
    setEditId(id);
    setComment(commentList.find(comment => comment.id === id).text);
  }

  function removeComment(id) {
    deleteComment(id).then(() => {
      setCommentList(commentList.filter(comment => comment.id !== id));
      getNotifications().then(notifications =>
        notificationInfo.notifications = notifications
      ).catch(() => { });
    }).catch(() => { });
  }
  function changeArticleParagraph() {
    editArticleText(changeParagraph.id, comment).then(() => {
      onSuccess(comment);
      setComment('');
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
            edit={edit}
          />
        })
      }
    </>
  )
}
