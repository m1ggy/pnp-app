import React from 'react';

import { Pagination as PaginationBS } from 'react-bootstrap';
const Pagination = (props) => {
  const { onPageChange, totalCount, currentPage, pageSize } = props;

  const totalPageCount = Math.ceil(totalCount / pageSize);

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  return (
    totalCount > pageSize && (
      <PaginationBS size='sm'>
        {/* Left navigation arrow */}
        {currentPage !== 1 && (
          <PaginationBS.Item onClick={onPrevious}>Prev</PaginationBS.Item>
        )}
        {
          <div
            style={{
              minWidth: '50px',
              minHeight: '15px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <PaginationBS.Item
              style={{ marginLeft: '5px', marginRight: '5px' }}
            >
              <span style={{ fontWeight: 'bold' }}>
                {currentPage} of {totalPageCount}
              </span>
            </PaginationBS.Item>
          </div>
        }
        {/*  Right Navigation arrow */}
        {currentPage !== totalPageCount && (
          <PaginationBS.Item className={'page-item'} onClick={onNext}>
            Next
          </PaginationBS.Item>
        )}
      </PaginationBS>
    )
  );
};

export default Pagination;
