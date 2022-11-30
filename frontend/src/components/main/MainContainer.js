import React from 'react';
import { Container } from 'react-bootstrap';


function MainContainer(props) {
  const className = props.className ?? ''; // remove
  return (
    <div className={'blur main-container' + className}>
      <Container className='main-content'>
        <h2 className='page-heading'>{props.pageName}</h2>
        {props.children}
      </Container>
    </div>
  )
}

export default MainContainer;