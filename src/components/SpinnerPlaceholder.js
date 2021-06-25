import React from 'react';
import { Spinner } from 'react-bootstrap';
export default function SpinnerPlaceholder() {
  return (
    <div
      style={{
        height: '100%',
        minHeight: '250px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spinner animation='border' variant='primary' />
    </div>
  );
}
