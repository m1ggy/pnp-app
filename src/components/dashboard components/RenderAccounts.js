import React from 'react';
import { Form } from 'react-bootstrap';

export default function RenderAccounts({ data, handle }) {
  return data.map((account) => {
    return (
      <tr key={account.user.id}>
        <td>
          {account.user.name.first} {account.user.name.last}
        </td>
        <td>{account.user.email}</td>
        <td>{account.user.role === 'A' ? 'Administrator' : null}</td>
        <td>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Form.Check
              id={account.user.id}
              checked={account.checked}
              onChange={handle}
            />
          </div>
        </td>
      </tr>
    );
  });
}
