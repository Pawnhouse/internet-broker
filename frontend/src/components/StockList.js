import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../index';
import { ReactComponent as Info } from '../img/info.svg';
import { ReactComponent as Cross } from '../img/cross.svg';
import { ReactComponent as CheckMark } from '../img/check-mark.svg';
import { observer } from 'mobx-react-lite';
import { Container, Row, Col } from 'react-bootstrap';
import { INFO_PATH, PANEL_PATH } from '../utils/paths';
import { activate, getPortfolio } from '../http/stockAPI';


const StockItem = observer(({ name, sectionId, price, number, isActive }) => {
  const { stockInfo } = useContext(Context);
  const navigate = useNavigate();
  const type = stockInfo.selectedType;
  let priceLabel = '?';
  if (price != null) {
    priceLabel = price + '$';
  }

  function openPanel() {
    let current = null;
    const all = stockInfo.allStock.concat(stockInfo.allShares);
    for (let i in all) {
      if (all[i].sectionId === sectionId) {
        current = all[i];
      }
    }
    stockInfo.currentStock = current;
    navigate(PANEL_PATH);
  }

  async function activateAction(isMakeActive) {
    activate(sectionId, type, isMakeActive).then(() => {
      stockInfo.updateIsActive(sectionId, isMakeActive);
    }).catch(() => { });
  }
  return (
    <Col md={4}>
      <div className='stock-item'>
        <button onClick={isActive ? openPanel : undefined}>
          <div style={{ minWidth: 100, display: 'inline-block', textAlign: 'left' }}>
            {name}
          </div>
          <span style={{ marginLeft: '10px' }}>
            {priceLabel}
          </span>
        </button>
        {
          stockInfo.mode === 'normal' && 
          type !== 'portfolio' &&
          <button className='svg' onClick={() => navigate(INFO_PATH + '/' + sectionId)}><Info /></button>
        }
        {
          stockInfo.mode === 'suspend' &&
          <button className='svg' onClick={() => activateAction(false)}><Cross /></button>
        }
        {
          stockInfo.mode === 'activate' &&
          <button className='svg' onClick={() => activateAction(true)}><CheckMark /></button>
        }
        {
          type === 'portfolio' &&
          number
        }
      </div>
    </Col>
  )

})

function StockList() {
  const { stockInfo, userInfo } = useContext(Context);
  const [portfolio, setPortfolio] = useState([]);
  const selectedType = stockInfo.selectedType;
  const isStock = selectedType === 'stock';
  const isShare = selectedType === 'shares';
  const isPortfolio = selectedType === 'portfolio';

  useEffect(() => {
    if (userInfo.user.role === 'user') {
      getPortfolio().then(portfolio => setPortfolio(portfolio)).catch(() => { });
    }
  }, [userInfo]);

  return (
    <Container className='mt-5'>
      <Row>
        {
          isStock && stockInfo.allActiveStock.map((stock) =>
            <StockItem
              name={stock.code}
              sectionId={stock.sectionId}
              price={stock.price}
              isActive={stock.isActive}
              key={stock.sectionId}
            />
          )
        }
        {
          isShare && stockInfo.allActiveShares.map((share) =>
            <StockItem
              name={share.sharesName}
              sectionId={share.sectionId}
              price={share.price}
              isActive={share.isActive}
              key={share.sectionId}
            />
          )
        }
        {
          isPortfolio && portfolio.map((share) =>
            <StockItem
              name={share.sharesName || share.code}
              sectionId={share.sectionId}
              number={share.number}
              price={share.price}
              isActive={share.isActive}
              key={share.sectionId}
            />
          )
        }

      </Row>
    </Container>
  )
}

export default observer(StockList)
