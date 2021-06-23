import React from 'react';
import { Spinner } from 'react-bootstrap';
export default function SpinnerPlaceholder() {
  return (
    <div
      style={{
        minHeight: '300px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spinner animation='border' variant='primary' />
    </div>
  );
}
