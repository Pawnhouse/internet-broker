import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Context } from '../index';
import { buyStock, getStockCandles, getStockNumber, sellStock } from '../http/stockAPI';
import { getBalance } from '../http/userAPI';
import Select from 'react-select';

import MainContainer from '../components/main/MainContainer';
import ArticleAside from '../components/ArticleAside';
import AddArticle from '../components/modals/AddArticle';
import Chart from '../components/Chart';
import ErrorModal from '../components/modals/ErrorModal';
import standardPicture from '../img/standard.jpg';
import stockLoad from '../utils/stockLoad';
import CommentBlock from '../components/CommentBlock';


function Panel() {
  const { stockInfo, userInfo } = useContext(Context);
  const [stock, setStock] = useState(stockInfo.currentStock);

  const [error, setError] = useState({ show: false, message: 'error' });
  const [isLoading, setIsLoading] = useState(true);
  const [articleVisible, setArticleVisible] = useState(false);

  const [number, setNumber] = useState(0);
  const [balance, setBalance] = useState(0);
  const [price, setPrice] = useState(stockInfo.currentStock?.price);
  const [candles, setCandles] = useState();

  useEffect(() => {
    stockLoad(stockInfo).then(() => {
      setIsLoading(false);
      setStock(stockInfo.currentStock);
    }).catch(() => { });

    if (stock) {
      getStockNumber(stock).then(total => setNumber(total)).catch(() => { });
      getStockCandles(stock)
        .then(({ candles, price }) => {

          if (candles.s === 'ok') {
            const priceAndTimeList = [];
            for (let i = 0; i < candles.o.length; i++) {
              priceAndTimeList.push({ o: candles.o[i], t: (new Date(candles.t[i] * 1000)).toLocaleDateString() });
            }
            setCandles(priceAndTimeList);
          }
          setPrice(price);
        }).catch(() => { });
    }
  }, [stockInfo, stock]);

  useEffect(() => {
    if (userInfo.user.role === 'user') {
      getBalance().then(balance => setBalance(balance)).catch(() => { });
    }
  }, [userInfo.user]);

  if (isLoading && !stock) {
    return <div className='blur error-not-found'></div>
  }
  if (!stock) {
    return <div className='blur error-not-found'>No stock available</div>
  }

  const pageName = stock.code ?? stock.sharesName;
  let picture = standardPicture;
  if (userInfo.user.picture) {
    picture = process.env.REACT_APP_API_URL + '/' + userInfo.user.picture;
  }
  const allActive = stockInfo.allStock
    .concat(stockInfo.allShares)
    .filter(item => item.isActive);
  const names = allActive.map(item => ({
      value: item.sectionId, 
      label: item.code || item.sharesName
    }));

  function buttonAction(action) {
    return () => {
      action(stock).then(({ number, balance }) => {
        setNumber(number);
        setBalance(balance);
      }).catch(err => {
        const message = err.response?.data?.message || 'Server error';
        setError({ show: true, message });
      });
    }
  }

  function changeStock({value}) { 
    const stock = allActive.find(stock => stock.sectionId === value);
    stockInfo.currentStock = stock;
    setStock(stock);
  }
  return (
    <MainContainer pageName={pageName}>
      <Row className='d-flex justify-content-between'>
        <Col md={8} style={{ border: '1.5px solid gray', borderRadius: 10, height: 500 }}>
          <Chart candles={candles} />
        </Col>
        <Col md={3} className='d-flex flex-column justify-content-between'>
          <Select
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                borderColor: 'gray',
              }),
            }}
            defaultValue={names.find(name => name.value === stock.sectionId)}
            isSearchable={true}
            options={names}
            onChange={changeStock}
          />
          <ArticleAside />
        </Col>
      </Row>

      <Row className='my-3'>
        <Col md={2}>
          Price: {price ? price + '$' : '?'}
        </Col>
        <Col>
          {
            !!number && userInfo.user.role === 'user' && <span>{'You own: ' + number}</span>
          }
        </Col>
      </Row>
      {
        userInfo.user.role === 'user' &&
        <Row className='align-items-center gy-3'>
          <Col md={2}>
            <Button variant='success' className='rounded-button' onClick={buttonAction(buyStock)}>Buy</Button>
          </Col>
          <Col md={2}>
            <Button variant='danger' className='rounded-button' onClick={buttonAction(sellStock)}>Sell</Button>
          </Col>
          <Col>{'Balance: ' + balance + '$'}</Col>
          <ErrorModal show={error.show} message={error.message} onHide={() => { setError({ show: false }) }} />
        </Row>
      }
      {
        userInfo.user.role === 'analyst' &&
        <>
          <Button className='rounded-button' onClick={() => setArticleVisible(true)}>Write article</Button>
          <AddArticle show={articleVisible} onHide={() => setArticleVisible(false)} sectionId={stock.sectionId} />
        </>
      }
      <CommentBlock />
      <img src={picture} style={{ display: 'none' }} alt='profile' />
    </MainContainer>
  )
}

export default Panel;