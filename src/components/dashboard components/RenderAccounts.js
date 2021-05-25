import React from 'react';
import { Form } from 'react-bootstrap';

export default function RenderAccounts({ data, handle, check }) {
  return data.map((account, index) => {
    return (
      <tr key={account.id}>
        <td>
          {account.name.first} {account.name.last}
        </td>
        <td>{account.email}</td>
        <td>{account.role === 'A' ? 'Administrator' : null}</td>
        <td>
          <Form.Check
            id={account.id}
            onChange={handle}
            checked={check[index]}
            value={index}
          />
        </td>
      </tr>
    );
  });
}
