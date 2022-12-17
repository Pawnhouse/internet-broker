import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { Context } from '../index';
import MainContainer from '../components/main/MainContainer';
import { useParams } from 'react-router-dom';
import { getDescription } from '../http/descriptionAPI';
import { NavLink } from 'react-router-dom';
import { PANEL_PATH } from '../utils/paths';
import stockLoad from '../utils/stockLoad';

function Info() {
  const { stockInfo } = useContext(Context);
  const [isLoaded, setIsLoaded] = useState(stockInfo.isLoaded);
  const [description, setDescription] = useState('');
  const params = useParams();
  useEffect(() => {
    getDescription(params.id).then((description) => {
      setDescription(description);
    }).catch(() => { });
  }, [params]);
  if (!isLoaded) {
    stockLoad(stockInfo).then(() => setIsLoaded(true));
  }
  
  let current;
  const all = stockInfo.allStock.concat(stockInfo.allShares);
  for (let i in all) {
    if (all[i].sectionId === +params.id) {
      current = all[i];
    }
  }
  if (!current || !isLoaded) {
    return <div className='blur error-not-found'>404 error</div>
  }
  stockInfo.currentStock = current;
  const name = current.sharesName || current.code;

  let headingClass = 'simple-link';
  if (current.code) {
    headingClass += ' stock'
  }
  const paragraphs = description.split('\n').map((p, id) => ({text: p, id})); 
  return (
    <MainContainer pageName={'Info'}>
      <NavLink className={headingClass} to={PANEL_PATH} >{name}</NavLink>
      <div className=' my-3'>
        {
          paragraphs.map((p) => (
            <div className='first-letter-margin' key={p.id}>
              {p.text}
              <br />
            </div>
          ))
        }
      </div>

    </MainContainer>
  )
}

export default Info;