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
  const sectionId = stockInfo.currentStock?.sectionId;
  const [isVip, setIsVip] = useState();
  const [isAll, setIsAll] = useState({ show: false, sectionId });
  useEffect(() => {
    getArticles().then(articles => {
      articleInfo.allArticles = articles;
    }).catch(() => { });
    getIsVip().then(isVip => setIsVip(isVip)).catch(() => { });
  }, [articleInfo, userInfo.user]);

  if (isAll.sectionId !== sectionId) {
    setIsAll({ show: false, sectionId })
  }
  const stockArticles = articleInfo.allArticles.filter(
    article => article.about === sectionId
      || article.about == null
      || isAll.show
  ).filter(
    article => !article.isClosed || userInfo.user.role !== 'user' || isVip
  ).slice(0, 5);
  return (
    <Container style={{ border: '1.5px solid gray', height: '80%', borderRadius: 5, overflowY: isAll.show ? 'scroll' : 'hidden' }}>
      {
        stockArticles.map((element) => (
          <Row key={element.sectionId}>
            <NavLink
              className="simple-link mb-2"
              to={ARTICLE_PATH + '/' + element.sectionId}
            >
              {element.headline}
            </NavLink>
          </Row>
        ))
      }
      {
        !isAll.show &&
        <span onClick={() => setIsAll({ show: true, sectionId })} style={{ color: 'grey', cursor: 'pointer' }}>More...</span>
      }
    </Container>
  )
}

export default observer(ArticleAside)
