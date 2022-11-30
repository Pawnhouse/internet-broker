import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import { Container, Row } from 'react-bootstrap';
import { ARTICLE_PATH } from '../utils/paths';


function ArticleAside() {
  const { articleInfo } = useContext(Context);

  return (
    <Container style={{border: '1px solid black', height: '100%', borderRadius: 5}}>
      {
        articleInfo.allArticles.slice(0, 5).map((element) => (
          <Row key={element.sectionId}>
            <NavLink
              className="simple-link"
              to={ARTICLE_PATH + '/' + element.sectionId}
            >
              {element.heading}
            </NavLink>
          </Row>
        ))
      }


    </Container>
  )
}

export default observer(ArticleAside)
