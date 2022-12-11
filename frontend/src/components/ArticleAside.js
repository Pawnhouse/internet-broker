import { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Context } from '../index';
import { Container, Row } from 'react-bootstrap';
import { ARTICLE_PATH } from '../utils/paths';
import { getArticles } from '../http/descriptionAPI';
import { observer } from 'mobx-react-lite';


function ArticleAside() {
  const { articleInfo, stockInfo } = useContext(Context);
  useEffect(() => {
    getArticles().then(articles =>{ 
      articleInfo.allArticles = articles;
    }).catch(() => { });
  }, [articleInfo]);

  const stockArticles = articleInfo.allArticles.filter(
    article => article.about === stockInfo.currentStock?.sectionId
    ).slice(0, 5);
  return (
    <Container style={{ border: '1.5px solid gray', height: '100%', borderRadius: 5 }}>
      {
        stockArticles.map((element) => (
          <Row key={element.sectionId}>
            <NavLink
              className="simple-link"
              to={ARTICLE_PATH + '/' + element.sectionId}
            >
              {element.headline}
            </NavLink>
          </Row>
        ))
      }
    </Container>
  )
}

export default observer(ArticleAside)
