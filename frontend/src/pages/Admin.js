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
import adminBg from '../img/admin-bg.png';


function AdminPanel() {
  const [stockVisible, setStockVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [suspendNavValue, setSuspendNavValue] = useState('stock');
  const [restoreNavValue, setRestoreNavValue] = useState('stock');
  const [tabValue, setTabValue] = useState('add');
  const [backgroundImage, setBackgroundImage] = useState();

  const { stockInfo } = useContext(Context);
  useEffect(() => {
    getStock().then(stock => stockInfo.allStock = stock).catch(() => { });
    getShares().then(shares => stockInfo.allShares = shares).catch(() => { });
  }, [stockInfo]);
  useEffect(() => {
    if (window.innerHeight > 800 && window.innerWidth > 1000 
      && (tabValue === 'add') ) {
      setBackgroundImage(`url(${adminBg})`);
    } else {
      setBackgroundImage(null);
    }
    }, [tabValue, backgroundImage]);

  const stockNav = (navValue, setNavValue) =>  (
    <Nav
      variant='pills' 
      activeKey={navValue}
      className='markets-nav-bar w-25'
      onSelect={(selectedKey) => setNavValue(selectedKey)}
    >
      <Nav.Item>
        <Nav.Link eventKey='stock' className='markets-nav center'>Stock</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey='shares' className='markets-nav center'>Shares</Nav.Link>
      </Nav.Item>
    </Nav>
  )

  return (
    <MainContainer pageName='Admin panel' backgroundImage={backgroundImage}>
      <Tabs
        activeKey={tabValue}
        id='uncontrolled-tab-example'
        className='mb-3'
        onSelect={(selectedKey) => setTabValue(selectedKey)}
      >
        <Tab eventKey='add' title='Add'>
          <Button onClick={() => setStockVisible(true)} className='me-3'>Add stock</Button>
          <Button onClick={() => setShareVisible(true)}>Add share</Button>
          <AddStock show={stockVisible} onHide={() => setStockVisible(false)} />
          <AddShare show={shareVisible} onHide={() => setShareVisible(false)} />
        </Tab>

        <Tab eventKey='suspend' title='Suspend'>
          {stockNav(suspendNavValue, setSuspendNavValue)}
          <StockList mode='suspend' type={suspendNavValue} />
        </Tab>

        <Tab eventKey='activate' title='Restore'>
          {stockNav(restoreNavValue, setRestoreNavValue)}
          <StockList mode='activate' type={restoreNavValue} />
        </Tab>

        <Tab eventKey='requests' title='Requests'>
          <RequestList />
        </Tab>
      </Tabs>
    </MainContainer>
  );
}

export default AdminPanel;