import React, { useEffect } from 'react'
import { Jumbotron, Col, Row, Spinner } from 'react-bootstrap'
import { BetaAnalyticsDataClient } from '@google-analytics/data'


export default function DashboardMain() {

    const propertyId = 'G-2MRNV52H3Q'
    const analyticsDataClient = new BetaAnalyticsDataClient();

    useEffect(()=>{

        async function runReport() {
            const [response] = await analyticsDataClient.runReport({
              property: `properties/${propertyId}`,
              dateRanges: [
                {
                  startDate: '2020-03-31',
                  endDate: 'today',
                },
              ],
              dimensions: [
                {
                  name: 'country',
                },
              ],
              metrics: [
                {
                  name: 'activeUsers',
                },
              ],
            });
          
            console.log('Report result:');
            response.rows.forEach(row => {
              console.log(row.dimensionValues[0], row.metricValues[0]);
            });
          }
          
          runReport();

    }, [])

    return (
        <>
        <Row>
           <Jumbotron className="w-100"><h1>Dashboard</h1></Jumbotron>  
        </Row>
        <Row>

        </Row>
        </>
    )
}
