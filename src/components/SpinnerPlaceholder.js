import React from 'react';
import { Spinner } from 'react-bootstrap';
export default function SpinnerPlaceholder({ size, centered, ...props }) {
  return (
    <div
      style={
        centered
          ? {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }
          : null
      }
      {...props}
    >
      <Spinner animation='border' variant='primary' size={size ? size : 'lg'} />
    </div>
  );
}
