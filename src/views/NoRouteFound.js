import React from 'react';
import { Image } from 'react-bootstrap';
import NoRouteImage from '../images/NoRouteImage.png';
console.log(NoRouteImage);
export default function NoRouteFound() {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid black',
      }}
    >
      <Image src={NoRouteImage} alt='404 Error' style={{ width: '150px' }} />

      <p>
        Whoops. This page does not exist. <br></br>
        <div style={{ textAlign: 'center' }}>
          <a href='/'>Go back.</a>
        </div>
      </p>
    </div>
  );
}
