import React from 'react';
import { Table } from 'react-bootstrap';

export default function RenderReports({ data }) {
  if (data)
    if (data.length === 0) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <p>No reports on record.</p>
        </div>
      );
    }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Table bordered hover>
        <thead>
          <tr>
            <td>Report ID</td>
            <td>Name</td>
            <td>Violation</td>
            <td>Status</td>
            <td>Action Taken</td>
            <td>Remarks</td>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((report) => {
              return (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.profile.first + ' ' + report.profile.last}</td>
                  <td>{report.description.violation}</td>
                  <td>{report.description.status.label}</td>
                  <td>{report.description.actionTaken}</td>
                  <td>{report.description.remarks}</td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </div>
  );
}
