import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { Context } from '../index'
import MainContainer from '../components/main/MainContainer';
import { useParams } from 'react-router-dom'
import { getDescription } from '../http/descriptionAPI';
import { NavLink } from 'react-router-dom';
import { PANEL_PATH } from '../utils/paths';

function Info() {
  const { stockInfo } = useContext(Context);
  const [description, setDescription] = useState('');
  const params = useParams();
  useEffect(() => {
    getDescription(params.id).then((description) => {
      setDescription(description);
    }).catch(() => { });
  })
  let current;

  const all = stockInfo.allStock.concat(stockInfo.allShares);
  for (let i in all) {
    if (all[i].sectionId === +params.id) {
      current = all[i];
    }
  }
  if (!current) {
    return <div className='blur'>404 error</div>
  }
  const name = current.sharesName || current.code;

  let headingClass = 'simple-link';
  if (current.code) {
    headingClass += ' stock'
  }
  return (
    <MainContainer pageName={'Info'}>
      <NavLink className={headingClass} to={PANEL_PATH} >{name}</NavLink>
      <div className='first-letter-margin my-3'>{description}</div>

    </MainContainer>
  )
}

export default Info;