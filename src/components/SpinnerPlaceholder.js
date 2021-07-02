import React from 'react';
import { Spinner } from 'react-bootstrap';
export default function SpinnerPlaceholder() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spinner animation='border' variant='primary' />
    </div>
  );
}
