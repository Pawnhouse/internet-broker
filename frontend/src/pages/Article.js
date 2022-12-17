import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import { Container, Row, Col, Button } from 'react-bootstrap';

import MainContainer from '../components/main/MainContainer';
import { PANEL_PATH, STOCK_PATH } from '../utils/paths';
import stockLoad from '../utils/stockLoad';
import { deleteArticle, getArticles } from '../http/descriptionAPI';
import standardPicture from '../img/standard.jpg';
import CommentBlock from '../components/CommentBlock';
import { ReactComponent as Cross } from '../img/cross.svg';


function Article() {
  const { articleInfo, stockInfo, userInfo } = useContext(Context);
  const [changeParagraph, setChangeParagraph] = useState(null);

  useEffect(() => {
    stockLoad(stockInfo);
  }, [stockInfo]);
  useEffect(() => {
    getArticles().then(articles => {
      articleInfo.allArticles = articles;
    }).catch(() => { });
  }, [articleInfo]);
  const navigate = useNavigate();
  const params = useParams();

  let article = articleInfo.allArticles.find(article => article.sectionId === +params.id);
  if (!article ) {
    return <div className='blur error-not-found'>404 article not found</div>
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

  function onDelete() {
    deleteArticle(article.sectionId).then(() => {
      articleInfo.allArticles = articleInfo.allArticles.filter(a => a.sectionId !== article.sectionId);
    }).catch(() => { });
  }

  function onChange(id) {
    setChangeParagraph({ id, text: article.content.find(p => p.id === id).text });
  }
  function onSuccessChange(newText) { 
    const oldParagraph = article.content.find(p => p.id === changeParagraph.id);
    const newParagraph = {...oldParagraph, text: newText};
    const oldList = article.content.filter(p => p.id !== changeParagraph.id)
    const newContent = [...oldList, newParagraph];
    const newArticle = {...article, content: newContent}; 
    articleInfo.allArticles = [...articleInfo.allArticles.filter(a => a.sectionId !== article.sectionId), newArticle];
    setChangeParagraph(null);
  }
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
              {
                (userInfo.user.role === 'moderator' ||
                  userInfo.user.role === 'administrator') &&
                <button className='svg ms-3' onClick={onDelete}>
                  <Cross />
                </button>
              }
            </Col>
          </Row>
        </Container>
      </div>
      <Row>
        {
          article.content.map((p) => (
            <div key={p.id}>
              {
                !!p.text &&
                  (userInfo.user.role === 'moderator' ||
                    userInfo.user.role === 'administrator') ?
                  <div className='first-letter-margin' onClick={() => onChange(p.id)}>
                    {p.text}
                    {
                      p.picture &&
                      <img src={process.env.REACT_APP_API_URL + '/' + p.picture} alt='article pic' style={{ margin: '5px auto', display: 'block' }} />
                    }
                    <br />
                  </div> :
                  <div className='first-letter-margin'>
                    {p.text}
                    {
                      p.picture &&
                      <img src={process.env.REACT_APP_API_URL + '/' + p.picture} alt='article pic' style={{ margin: '5px auto', display: 'block' }} />
                    }
                    <br />
                  </div>
              }
            </div>
          ))
        }
      </Row>
      <CommentBlock changeParagraph={changeParagraph} onSuccess={onSuccessChange} />
    </MainContainer>
  )
}

export default observer(Article)
