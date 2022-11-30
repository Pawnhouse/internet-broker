import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Button, FormControl } from 'react-bootstrap';
import MainContainer from '../components/main/MainContainer';
import ArticleAside from '../components/ArticleAside';
import { Context } from '../index';
import CommentItem from '../components/CommentItem';
import AddArticle from '../components/modals/AddArticle';
import { getStockNumber } from '../http/stockAPI';
import { getBalance } from '../http/userAPI';

function Panel() {
  const { stockInfo, commentInfo, userInfo } = useContext(Context);
  const [articleVisible, setArticleVisible] = useState(false);
  const [number, setNumber] = useState(0);
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    if (stockInfo.currentStock) { 
      getStockNumber(stockInfo.currentStock).then(total => setNumber(total)).catch(() => { });
    }
    if (userInfo.user.role === 'user') {
      getBalance().then(balance => setBalance(balance)).catch(() => {});
    }
  }, [userInfo, stockInfo]);

  if (!stockInfo.currentStock) {
    stockInfo.currentStock = stockInfo.allStock[0] || stockInfo.allShares[0];
    if (!stockInfo.currentStock) {
      return <div className='blur'>No stock available</div>
    }
    commentInfo.currentSection = {id: stockInfo.currentStock.sectionId, type: 'stock'};
  }

  const stock = stockInfo.currentStock;
  const pageName = stock.code ?? stock.sharesName;
  const price = 450;

  return (
    <MainContainer pageName={pageName}>
      <Row className='d-flex justify-content-between'>
        <Col md={8} style={{ background: 'gray', height: 500 }}></Col>
        <Col md={3}><ArticleAside /></Col>
      </Row>
      <Row className='my-3'>
        <Col md={2}>
          Price: {price + '$'}
        </Col>
        <Col>
          {
            number && userInfo.user.role === 'user' && <span>{'You own: ' + number}</span>
          }
        </Col>
      </Row>
      {
        userInfo.user.role === 'user' &&
        <Row className='align-items-center gy-3'>
          <Col md={2}><Button variant='success' className='rounded-button'>Buy</Button></Col>
          <Col md={2}><Button variant='danger' className='rounded-button'>Sell</Button></Col>
          <Col>{'Balance: ' + balance + '$'}</Col>
        </Row>
      }
      {
        userInfo.user.role === 'analyst' &&
        <>
          <Button className='rounded-button' onClick={() => setArticleVisible(true)}>Write article</Button>
          <AddArticle show={articleVisible} onHide={() => setArticleVisible(false)} sectionName={pageName}/>
        
        </>
      }

      <Row className='align-items-end my-3'>
        <Col md={8}>
          <FormControl as="textarea" rows={3} />
        </Col>
        <Col>
          <Button className='rounded-button'>Post</Button>
        </Col>
      </Row>
      {
        false &&
        commentInfo.currentSectionComments.map((comment, index) =>{
          return <CommentItem comment={comment} key={comment.id} isBlue={index % 2}/>
        })
      }


    </MainContainer>
  )
}

export default Panel;