import React, { useEffect, useState } from 'react';
import { Col, Row, Jumbotron, Pagination } from 'react-bootstrap';
import { getDataFromCollection } from '../../utils/firebaseUtils';
import RenderReports from '../RenderReports';
export default function ReportsMain() {
  const [data, setData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(7);
  const [pageNumbers, setPageNumbers] = useState();

  useEffect(() => {
    getDataFromCollection('reports', (res) => {
      paginateNumbers(res);
      setData(res);
    });

    function paginateNumbers(arr) {
      let temp = [];
      let totalPosts = arr.length;

      for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        temp.push(i);
      }
      setPageNumbers(temp);
    }
  }, []);

  function paginate(num) {
    setCurrentPage(num);
  }

  return (
    <Col>
      <Row>
        <Jumbotron className='w-100'>
          <h1>Reports</h1>
        </Jumbotron>
      </Row>
      <Row>
        <Jumbotron className='w-100'>
          {data && <h6>{data.length} reports</h6>}
          <RenderReports
            data={data}
            currentPage={currentPage}
            postsPerPage={postsPerPage}
          />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {pageNumbers && (
              <Pagination
                size='md'
                style={{ marginTop: 20 }}
                variant='secondary'
              >
                {pageNumbers.map((num, index) => {
                  return (
                    <Pagination.Item
                      onClick={() => {
                        paginate(num);
                      }}
                      key={index}
                    >
                      {num}
                    </Pagination.Item>
                  );
                })}
              </Pagination>
            )}
          </div>
        </Jumbotron>
      </Row>
    </Col>
  );
}
