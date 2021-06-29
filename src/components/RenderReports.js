import React from 'react';
import { Table } from 'react-bootstrap';

export default function RenderReports({ data, currentPage, postsPerPage }) {
  let temp = null;
  if (data) {
    console.log(data);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    temp = data.slice(indexOfFirstPost, indexOfLastPost);
  }

  if (data) {
    if (data.length === 0) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <p>No reports on record.</p>
        </div>
      );
    }
  }

  return (
    <Table bordered hover style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>Incident Happened on</th>
          <th>Municipality / City</th>
          <th>Name</th>
          <th>Violation</th>
          <th>Status</th>
          <th>Action Taken</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody>
        {temp &&
          temp.map((report) => {
            return (
              <tr key={report.id}>
                {console.log(report)}
                <td>
                  {report.dateOccurred.toDate().toLocaleTimeString('en-US')}{' '}
                  {report.dateOccurred.toDate().toDateString()}
                </td>
                <td>{report.description.municipality.label}</td>
                <td>{report.profile.first + ' ' + report.profile.last}</td>
                <td>{report.description.violation.label}</td>
                <td
                  style={{
                    color:
                      report.description.status.label === 'Arrested'
                        ? 'blue'
                        : report.description.status.label === 'Detained'
                        ? 'green'
                        : 'red',
                  }}
                >
                  {report.description.status.label}
                </td>
                <td>{report.description.actionTaken}</td>
                <td>{report.description.remarks}</td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
}
