import React from 'react';
import { Table } from 'react-bootstrap';

export default function RenderReports({ data, currentPage, postsPerPage }) {
  let temp;
  if (data) {
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
                <td>
                  {report.dateOccurred.toDate().toLocaleTimeString('en-US')}{' '}
                  {report.dateOccurred.toDate().toDateString()}
                </td>
                <td>{report.description.municipality.label}</td>
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
  );
}
