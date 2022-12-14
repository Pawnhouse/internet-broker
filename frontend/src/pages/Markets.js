import React, { useContext, useEffect, useState } from 'react';
import { Nav, Form } from 'react-bootstrap'
import MainContainer from '../components/main/MainContainer';
import '../css/markets.css';
import { ReactComponent as Search } from '../img/search.svg';
import { Context } from '../index';
import StockList from '../components/StockList';
import { observer } from 'mobx-react-lite';
import { getShares, getStock } from '../http/stockAPI';

function Markets() {
  const { stockInfo } = useContext(Context);
  const [searchValue, setSearchValue] = useState('');
  const [navValue, setNavValue] = useState('stock');
  useEffect(() => {
    getStock().then(stock => stockInfo.allStock = stock).catch(() => { });
    getShares().then(shares => stockInfo.allShares = shares).catch(() => { });
  }, [stockInfo]);

  return (
    <MainContainer pageName='Markets'>
      <Nav
        variant="pills"
        activeKey={navValue}
        className='markets-nav-bar'
        onSelect={(selectedKey) => setNavValue(selectedKey)}
      >
        <Nav.Item>
          <Nav.Link eventKey='stock' className='markets-nav center'>Stock</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="shares" className='markets-nav center'>Shares</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="portfolio" className='markets-nav center'>Portfolio</Nav.Link>
        </Nav.Item>
        <div style={{ display: 'flex' }}>
          <Form.Control
            className="same-width-input m-2"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button className='svg search-button'><Search /></button>
        </div>
      </Nav>

      {
        stockInfo.allStock != null &&
        stockInfo.allShares != null &&
        <StockList filterValue={searchValue} type={navValue} mode='normal'/>
      }
    </MainContainer>
  )
}

export default observer(Markets);