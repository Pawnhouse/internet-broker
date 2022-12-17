import { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Context } from '../index';
import { Container, Row } from 'react-bootstrap';
import { ARTICLE_PATH } from '../utils/paths';
import { getArticles } from '../http/descriptionAPI';
import { observer } from 'mobx-react-lite';
import { getIsVip } from '../http/userAPI';


function ArticleAside() {
  const { articleInfo, stockInfo, userInfo } = useContext(Context);
  const [isVip, setIsVip] = useState();
  useEffect(() => {
    getArticles().then(articles => {
      articleInfo.allArticles = articles;
    }).catch(() => { });
    getIsVip().then(isVip => setIsVip(isVip)).catch(() => { });
  }, [articleInfo, userInfo.user]);

  const stockArticles = articleInfo.allArticles.filter(
    article => article.about === stockInfo.currentStock?.sectionId
  ).concat(articleInfo.allArticles.filter(
    article => article.about == null
  )).filter(
    article => !article.isClosed || userInfo.user.role !== 'user' || isVip
  ).slice(0, 5);
  return (
    <Container style={{ border: '1.5px solid gray', height: '80%', borderRadius: 5 }}>
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
