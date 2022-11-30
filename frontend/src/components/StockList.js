import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../index';
import { ReactComponent as Info } from '../img/info.svg';
import { ReactComponent as Cross } from '../img/cross.svg';
import { ReactComponent as CheckMark } from '../img/check-mark.svg';
import { observer } from 'mobx-react-lite';
import { Container, Row, Col } from 'react-bootstrap';
import { INFO_PATH, PANEL_PATH } from '../utils/paths';
import { activate } from '../http/stockAPI';


const StockItem = observer(({ name, sectionId }) => {
  const { stockInfo } = useContext(Context);
  const navigate = useNavigate();
  const type = stockInfo.selectedType;

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

  async function activateAction(isActive) {
    activate(sectionId, type, isActive).then(() => {
      stockInfo.updateIsActive(sectionId, isActive);
    }).catch(() => { });
  }
  return (
    <Col md={4}>
      <div className='stock-item'>
        <button onClick={stockInfo.isActive ? openPanel : undefined}>
          <div style={{ minWidth: 100, display: 'inline-block', textAlign: 'left' }}>
            {name}
          </div>
          <span style={{ marginLeft: '10px' }}>
            {450 + '$'}
          </span>
        </button>
        {
          stockInfo.mode === 'normal' &&
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
      </div>
    </Col>
  )

})

function StockList() {
  const { stockInfo } = useContext(Context);
  const selectedType = stockInfo.selectedType;
  const isStock = selectedType === 'stock';
  const isShare = selectedType === 'shares';
  const isPortfolio = selectedType === 'portfolio';
  let portfolio = []
  if (isPortfolio) {
    portfolio = [
      { sectionId: 1, code: 'aapl', isActive: true },
      { sectionId: 2, code: 'f', isActive: true },
    ]
  }

  return (
    <Container className='mt-5'>
      <Row>
        {
          isStock && stockInfo.allActiveStock.map((stock) =>
            <StockItem name={stock.code} sectionId={stock.sectionId} key={stock.sectionId} />
          )
        }
        {
          isShare && stockInfo.allActiveShares.map((share) =>
            <StockItem name={share.sharesName} sectionId={share.sectionId} key={share.sectionId} />
          )
        }
        {
          isPortfolio && portfolio.map((share) =>
            <StockItem name={share.sharesName} sectionId={share.sectionId} key={share.sectionId} />
          )
        }

      </Row>
    </Container>
  )
}

export default observer(StockList)
