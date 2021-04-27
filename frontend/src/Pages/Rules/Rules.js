import React, { useState, useEffect } from 'react';
import Title from '../Title/Title';
import { Container, Row , Col, Card } from 'react-bootstrap';
const Rules = () => {
  return (
    
      <div>
          <Title title="Competition rules"></Title>
          <Container className="fluid" style={{ border: 'solid 1px black' }} >
              <Row>
                  <Col>
                  <h3>Competition rules</h3>
                  </Col>
              </Row>
              <Row>
                  <Col md={{ size: 9, offset: -1 }}
                      lg={{ size: 9, offset: -1 }}
                      style={{ border: 'solid 1px black' }}>
                      <Card style={{ width: '100%' }} >
                          <Card.Body>
                              <Card.Title >One proposal for each category</Card.Title>
                                <Card.Text>
                                      There are three competition categories. You can submit maximum three proposals for each category.
                                </Card.Text>
                          </Card.Body>
                      </Card>
                  </Col>
              </Row>
              <Row>
                  <Col md={{ size: 9, offset: -1 }}
                      lg={{ size: 9, offset: -1 }}
                      style={{ border: 'solid 1px black' }}>
                      <Card style={{ width: '100%' }} >
                          <Card.Body>
                              <Card.Title >Forming teams</Card.Title>
                                <Card.Text>
                                      Four members per team. You can only be a member in one team. To join another team, the leader need to remove you from the team first. If you are a team leader, you will need to disband the team. All proposals which has been will not be taken into considerations for judging. 
                                </Card.Text>
                          </Card.Body>
                      </Card>
                  </Col>
              </Row>
              <Row>
                  <Col md={{ size: 9, offset: -1 }}
                      lg={{ size: 9, offset: -1 }}
                      style={{ border: 'solid 1px black' }}>
                      <Card style={{ width: '100%' }} >
                          <Card.Body>
                              <Card.Title >Submitting proposals</Card.Title>
                                <Card.Text>
                                      There are three competition categories. You can submit maximum three proposals for each category.
                                </Card.Text>
                          </Card.Body>
                      </Card>
                  </Col>
              </Row>
          </Container>
      </div>
  );
} //End of Rules functional component

export default Rules;