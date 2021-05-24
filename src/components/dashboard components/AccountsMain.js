import { useState, useEffect } from 'react';
import {
  Jumbotron,
  Row,
  Col,
  Spinner,
  Button,
  Table,
  Form,
} from 'react-bootstrap';
import { getDataWhereQuery } from '../../utils/firebaseUtils';
import AccountCreationModal from './AccountCreationModal';
import RenderAccounts from './RenderAccounts';

export default function AccountsMain() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [selector, setSelector] = useState(false);
  async function getData() {
    setLoading(true);
    getDataWhereQuery('users', 'role', '==', 'A', (users) => {
      let temp = [];
      users.forEach((user) => {
        temp.push({ user: user, checked: false });
      });
      setData(temp);
    });
    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, []);

  function handleShow() {
    setShow(!show);
    getData();
  }

  function selectAllHandle(e) {
    let temp = data;
    temp.forEach((account) => {
      account.checked = e.target.checked;
    });
    setData(temp);
    setSelector(e.target.checked);
  }

  function handleCheck(e) {
    let temp = data;

    setData(temp);
  }

  return (
    <Col>
      <Row>
        <Jumbotron className='w-100'>
          <h1>Accounts</h1>
        </Jumbotron>
      </Row>
      <Row>
        <Jumbotron className='w-100'>
          <Col>
            <Row
              style={{
                borderBottom: '1px solid black',
                marginBottom: 15,
              }}
            >
              <Button
                variant='success'
                style={{ marginBottom: 15 }}
                onClick={handleShow}
              >
                New Account
              </Button>
            </Row>
            <Row
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {loading && <Spinner animation='border' />}
              {data.length > 0 ? (
                <>
                  <Table bordered hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>
                          <Form.Check
                            onChange={selectAllHandle}
                            checked={selector}
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <RenderAccounts data={data} handle={handleCheck} />
                    </tbody>
                  </Table>
                </>
              ) : (
                <>No active Accounts.</>
              )}
            </Row>
          </Col>
        </Jumbotron>
      </Row>
      <AccountCreationModal show={show} handler={handleShow} />
    </Col>
  );
}
