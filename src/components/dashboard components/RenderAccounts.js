import React from 'react';
import { Form } from 'react-bootstrap';

export default function RenderAccounts({ data }) {
  return data.map((account) => {
    return (
      <tr key={account.id}>
        <td>
          {account.name.first} {account.name.last}
        </td>
        <td>{account.email}</td>
        <td>{account.role === 'A' ? 'Administrator' : null}</td>
        <td>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Form.Check type='checkbox' />
          </div>
        </td>
      </tr>
    );
  });
}
