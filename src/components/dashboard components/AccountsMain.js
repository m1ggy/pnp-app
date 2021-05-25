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
import AccountDeletionModal from './AccountDeletionModal';

export default function AccountsMain() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selector, setSelector] = useState(false);
  const [checkArray, setCheckArray] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  async function getData() {
    setLoading(true);
    getDataWhereQuery('users', 'role', '==', 'A', (users) => {
      let temp = [];
      users.forEach(() => {
        temp.push(false);
      });
      setCheckArray(temp);
      setData(users);
    });
    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);

  function handleShow() {
    setShow(!show);
    getData();
  }

  function selectAllHandle(e) {
    let temp = [...checkArray];

    for (let i = 0; i < temp.length; i++) {
      temp[i] = e.target.checked;
      setCheckArray(temp);

      if (e.target.checked) {
        let arr = [];
        data.forEach((user) => {
          arr.push(user.id);
        });
        setSelectedItems(arr);
      } else if (e.target.checked === false) {
        setSelectedItems([]);
      }
    }
    console.log(temp);
    setSelector(e.target.checked);
  }

  function handleCheck(e) {
    let temp = [...checkArray];
    temp[e.target.value] = e.target.checked;
    if (e.target.checked === true) {
      setSelectedItems([...selectedItems, data[e.target.value].id]);
    } else {
      let arr = [...selectedItems];
      for (let i = 0; i < selectedItems.length; i++) {
        if (arr[i] === e.target.id) {
          arr.splice(i, 1);
          setSelectedItems(arr);
        }
      }
    }

    setCheckArray(temp);
    console.log(temp);
  }

  const handleShowDelete = () => {
    setShowDelete(!showDelete);
    getData();
  };

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
              <Button
                variant='danger'
                style={{ marginBottom: 15, marginLeft: 15 }}
                onClick={handleShowDelete}
              >
                Delete Account
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
                            id={'selector'}
                            checked={selector}
                            onChange={selectAllHandle}
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <RenderAccounts
                        data={data}
                        handle={handleCheck}
                        check={checkArray}
                      />
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
      <AccountDeletionModal
        show={showDelete}
        handle={handleShowDelete}
        data={selectedItems}
        setData={setSelectedItems}
      />
    </Col>
  );
}
