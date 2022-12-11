import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import { Container, Row, Col, Button } from 'react-bootstrap';
import MainContainer from '../components/main/MainContainer';
import { PANEL_PATH, STOCK_PATH } from '../utils/paths';
import stockLoad from '../utils/stockLoad';
import { getArticles } from '../http/descriptionAPI';
import standardPicture from '../img/standard.jpg';


function Article() {
  const { articleInfo, stockInfo } = useContext(Context);
  useEffect(() => {
    stockLoad(stockInfo);
    getArticles().then(articles => {
      articleInfo.allArticles = articles;
      if (!articleInfo.currentArticle) {
        articleInfo.currentArticle = articleInfo.allArticles[0];
      }
    }).catch(() => { });
  }, [articleInfo, stockInfo]);
  const navigate = useNavigate();
  const params = useParams();

  let article = articleInfo.allArticles.find(article => article.sectionId === +params.id);
  if (!article) {
    return <div className='blur'>404 article not found</div>
  }

  let label = 'World Market';
  let route = STOCK_PATH;
  let relatedSection;
  if (stockInfo.isLoaded) {
    stockInfo.allStock.concat(stockInfo.allShares).forEach((section) => {
      if (section.sectionId === article.about) {
        relatedSection = section;
      }
    });
  }
  if (relatedSection != null) {
    route = PANEL_PATH;
    if (relatedSection.isActive) {
      stockInfo.currentStock = relatedSection;
    }
    if (relatedSection.code != null) {
      label = '$' + relatedSection.code;
    } else {
      label = relatedSection.name;
    }
  }

  let [first, second] = [article.author.company ?? '', article.author.firstName];
  if (first === '') {
    [first, second] = [second, first];
  }
  let picture = standardPicture;
  if (article.author.picture) {
    picture = process.env.REACT_APP_API_URL + '/' + article.author.picture;
  }
  const paragraphs = article.text.split('\n').map((p, id) => ({text: p, id})); 
  return (
    <MainContainer pageName={article.headline}>
      <div className='w-100 p-3 d-flex'>
        <img src={picture} width={150} height={150} alt='Profile pic' />
        <Container className='ms-3'>
          <Row className='justify-content-evenly'>
            <div className='vertical w-75 justify-content-between' style={{ height: 150 }}>
              <div>
                <b>{first}<br /></b>
                <span style={{ marginLeft: '10px' }}>
                  {second}
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
      {
          paragraphs.map((p) => (
            <div className='first-letter-margin' key={p.id}>
              {p.text}
              <br />
            </div>
          ))
        }
      </Row>
    </MainContainer>
  )
}

export default observer(Article)
