import React from 'react';

import { usePagination, DOTS } from './usePagination';
import { Pagination as PaginationBS } from 'react-bootstrap';
const Pagination = (props) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 4,
    currentPage,
    pageSize,
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  return (
    <PaginationBS size='sm'>
      {/* Left navigation arrow */}
      <PaginationBS.Item onClick={onPrevious}>Prev</PaginationBS.Item>
      {paginationRange.map((pageNumber) => {
        // If the pageItem is a DOT, render the DOTS unicode character
        if (pageNumber === DOTS) {
          return (
            <PaginationBS.Item className='pagination-item dots' disabled={true}>
              &#8230;
            </PaginationBS.Item>
          );
        }

        // Render our Page Pills
        return (
          <PaginationBS.Item
            className={'page-item'}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </PaginationBS.Item>
        );
      })}
      {/*  Right Navigation arrow */}
      <PaginationBS.Item className={'page-item'} onClick={onNext}>
        Next
      </PaginationBS.Item>
    </PaginationBS>
  );
};

export default Pagination;
