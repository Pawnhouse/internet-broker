import React from 'react';
import { Container } from 'react-bootstrap';


function MainContainer(props) {
  return (
    <div className='blur main-container'>
      <Container className='main-content'>
        <h2 className='page-heading'>{props.pageName}</h2>
        {props.children}
      </Container>
    </div>
  )
}

export default MainContainer;