import { useContext, useEffect, useState } from 'react';
import { Button, Nav } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import MainContainer from '../components/main/MainContainer';
import AddShare from '../components/modals/AddShare';
import AddStock from '../components/modals/AddStock';
import RequestList from '../components/RequestList';
import StockList from '../components/StockList';
import { getShares, getStock } from '../http/stockAPI';
import { Context } from '../index'



function AdminPanel() {
  const [stockVisible, setStockVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const { stockInfo } = useContext(Context);
  useEffect(() => {
    getStock().then(stock => stockInfo.allStock = stock).catch(() => { });
    getShares().then(shares => stockInfo.allShares = shares).catch(() => { });
  }, [stockInfo]);
  const stockNav = (mode) => (
    <Nav
      variant="pills" 
      defaultActiveKey={stockInfo.getSelectedTypeByMode(mode)}
      className='markets-nav-bar w-25'
      onSelect={(selectedKey) => { stockInfo.selectedType = selectedKey; }}
    >
      <Nav.Item>
        <Nav.Link eventKey='stock' className='markets-nav center'>Stock</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="shares" className='markets-nav center'>Shares</Nav.Link>
      </Nav.Item>
    </Nav>
  )

  return (
    <MainContainer pageName='Admin panel'>

      <Tabs
        defaultActiveKey="add"
        id="uncontrolled-tab-example"
        className="mb-3"
        onSelect={(k) => { stockInfo.mode = k; }}
      >
        <Tab eventKey="add" title="Add">
          <Button onClick={() => setStockVisible(true)} className='me-3'>Add stock</Button>
          <Button onClick={() => setShareVisible(true)}>Add share</Button>
          <AddStock show={stockVisible} onHide={() => setStockVisible(false)} />
          <AddShare show={shareVisible} onHide={() => setShareVisible(false)} />
        </Tab>
        <Tab eventKey="suspend" title="Suspend">
          {stockNav(1)}
          <StockList />
        </Tab>
        <Tab eventKey="activate" title="Restore">
          {stockNav(2)}
          <StockList />

        </Tab>
        <Tab eventKey="requests" title="Requests">
          <RequestList />
        </Tab>
      </Tabs>

    </MainContainer>
  );
}

export default AdminPanel;