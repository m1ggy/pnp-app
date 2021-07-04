import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Jumbotron,
  Pagination,
  Button,
  Collapse,
  Form,
} from 'react-bootstrap';
import {
  convertDataType,
  getDataType,
  uploadDataset,
  log,
} from '../../dashboard utils/utils';
import { getDataFromCollection } from '../../utils/firebaseUtils';
import RenderReports from '../RenderReports';
import { useDispatch, useSelector } from 'react-redux';
import {
  setToastShow,
  setToastContent,
  setToastHeader,
  setToastType,
} from '../../redux/toastSlice';
import SpinnerPlaceholder from '../SpinnerPlaceholder';

export default function ReportsMain() {
  const [data, setData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [pageNumbers, setPageNumbers] = useState();
  const [openImport, setOpenImport] = useState(false);
  const [file, setFile] = useState();
  const [logs, setLogs] = useState([]);
  const [convertedJSON, setConvertedJSON] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const toastState = useSelector((state) => state.toastReducer);

  function dispatchToast(content, show, header, type) {
    dispatch(setToastContent(content));
    dispatch(setToastHeader(header));
    dispatch(setToastShow(!show));
    dispatch(setToastType(type));
  }

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function paginate(num) {
    setCurrentPage(num);
  }

  function handleImportSubmit(e) {
    e.preventDefault();

    ///if the file state is empty
    if (file == null)
      return dispatchToast(
        'Please select a file. ',
        toastState.show,
        'Failed',
        'warning'
      );
    setLoading(true);
    /// get the file extensions of the file/files
    const filelist = getDataType(file);

    ///return if file extension is not supported
    filelist.forEach((file) => {
      if (file !== ('xlsx' || 'json' || 'csv' || 'xls')) {
        return dispatchToast(
          'Please select files with the extension of JSON, XLXS or XLS',
          toastState.show,
          'Failed',
          'warning'
        );
      }
    });

    convertDataType(file, setLogs, (data, id) => {
      const newjson = data;

      const newFile = new File([newjson], `${id}.json`);
      console.log(newFile);
      setConvertedJSON(newFile);
      uploadDataset(newFile, setLogs, id);
      setLoading(false);
    });
  }

  useEffect(() => {
    if (convertedJSON != null) {
      setLogs(
        (logs) => (logs = [...logs, log('✅ Got the JSON converted file')])
      );
    }
  }, [convertedJSON]);

  return (
    <Col>
      <Row>
        <Jumbotron className='w-100'>
          <h1>Reports</h1>
        </Jumbotron>
      </Row>
      <Row>
        <Jumbotron className='w-100'>
          <Col>
            <Row>
              <Button
                variant='primary'
                onClick={() => {
                  setOpenImport(!openImport);
                }}
                aria-controls='toggle-collapse-import'
                aria-expanded={openImport}
              >
                Import Data
              </Button>
            </Row>
            <hr></hr>
            <Row className='mt-3'>
              <Collapse in={openImport}>
                <div id='toggle-collapse-import' className='w-100'>
                  <Form onSubmit={handleImportSubmit}>
                    <Form.Group>
                      <Form.Label>
                        <span style={{ fontWeight: 'bold' }}>Import Data</span>
                      </Form.Label>

                      <Form.File
                        onChange={(e) => {
                          setFile(e.target.files);
                        }}
                        accept='.json, .xlsx, .xls'
                      />
                      <Form.Label>
                        <span style={{ color: 'red', fontWeight: 'bold' }}>
                          Notes<br></br>
                          If the file is in XLSX or XLS extension, please make
                          sure the data is in the first sheet only.<br></br>
                          Accepted formats are the following:
                        </span>
                        <br></br>
                        <span style={{ color: 'green', fontWeight: 'bold' }}>
                          ➡ JSON<br></br>➡ XLSX<br></br>➡ XLS<br></br>
                        </span>
                      </Form.Label>

                      <br></br>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%',
                        }}
                      >
                        <Button
                          type='submit'
                          variant='success'
                          disabled={loading}
                        >
                          {loading ? <SpinnerPlaceholder /> : 'Submit'}
                        </Button>
                      </div>
                    </Form.Group>
                  </Form>
                  <hr></hr>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                    className='w-100'
                  >
                    <div
                      style={{
                        overFlowX: 'scroll',
                        minHeight: '250px',
                        flexGrow: 1,
                      }}
                    >
                      <br></br>
                      <h4>Logs</h4>
                      <div
                        style={{
                          height: '250px',
                          overflowY: 'auto',
                          width: '100%',
                          overflowX: 'hidden',
                          padding: '10px',
                        }}
                        className='border'
                      >
                        {logs.map((log, index) => {
                          return <div key={log + index}>{log}</div>;
                        })}
                      </div>
                    </div>
                  </div>
                  <hr></hr>
                </div>
              </Collapse>
            </Row>
          </Col>

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
