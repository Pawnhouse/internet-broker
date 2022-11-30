import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import { Container, Row, Col, Button } from 'react-bootstrap';
import MainContainer from '../components/main/MainContainer';
import { PANEL_PATH, STOCK_PATH } from '../utils/paths';


function Article() {
  const { articleInfo, stockInfo } = useContext(Context);
  const sectionId = 2;
  let article;
  const navigate = useNavigate();
  
  const all = articleInfo.allArticles;
  for (let i in all) {
    if (all[i].sectionId === sectionId) {
      article = all[i];
    }
  }

  let label = 'World Market';
  let route = STOCK_PATH;
  if (article.about){
    route = PANEL_PATH;
    stockInfo.currentStock = article.about;
    if (article.about.type === 'stock') {
      label = '$' + article.about.code;
    } else {
      label = article.about.name;
    }
  }

  return (
    <MainContainer pageName={article.heading}>
      <div className='w-100 p-3 d-flex'>
        <img src={article.author.picture} width={150} height={150} alt='Profile pic' />
        <Container className='ms-3'>
          <Row className='justify-content-evenly'>
          <div className='vertical w-75 justify-content-between' style={{ height: 150}}>
            <div>
              <b>{article.author.company}<br/></b>
              <span style={{ marginLeft: '10px' }}>
                {article.author.firstName}.
              </span>
            </div>
            <Button variant='secondary' onClick={() => navigate(route)} className='rounded-button'>{label}</Button>
          </div>
            <Col>
              {article.date.toLocaleDateString()}
            </Col>
          </Row>
        </Container>
      </div>     
      <Row>
        {article.text}
      </Row>
    </MainContainer>
  )
}

export default observer(Article)
