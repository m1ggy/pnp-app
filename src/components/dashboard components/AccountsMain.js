import { useState, useEffect } from 'react';
import { Jumbotron, Row, Col, Spinner, Button, Table } from 'react-bootstrap';
import { getDataWhereQuery } from '../../utils/firebaseUtils';
import AccountCreationModal from './AccountCreationModal';
import RenderAccounts from './RenderAccounts';
import { useAuth } from '../../contexts/AuthContext';
export default function AccountsMain() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const { currentUser } = useAuth();
  async function getData() {
    console.log(currentUser);
    setLoading(true);
    getDataWhereQuery('users', 'role', '==', 'A', (users) => {
      console.log(users);
      setData(users);
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
                        <th>✔</th>
                      </tr>
                    </thead>
                    <tbody>
                      {' '}
                      <RenderAccounts data={data} />
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
