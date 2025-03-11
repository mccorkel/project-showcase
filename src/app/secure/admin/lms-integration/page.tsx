import React from 'react';
import { Card, Heading, Text, Flex, Divider, Button, SelectField, TextField, Table, TableCell, TableBody, TableHead, TableRow, Badge, Pagination, SwitchField, Alert } from '@aws-amplify/ui-react';

const LMSIntegrationPage = () => {
  return (
    <Flex direction="column" gap="1rem">
      <Heading level={2}>LMS Integration</Heading>
      <Text>Configure integration with Learning Management Systems and import student data.</Text>
      
      <Card>
        <Heading level={3}>LMS Connection Settings</Heading>
        <Divider />
        <Flex direction="column" gap="1rem" padding="1rem">
          <SelectField
            label="LMS Provider"
            descriptiveText="Select your Learning Management System provider"
          >
            <option value="canvas">Canvas</option>
            <option value="blackboard">Blackboard</option>
            <option value="moodle">Moodle</option>
            <option value="brightspace">Brightspace (D2L)</option>
            <option value="custom">Custom API</option>
          </SelectField>
          
          <TextField
            label="API Base URL"
            placeholder="https://your-lms-instance.instructure.com/api/v1"
            descriptiveText="Base URL for the LMS API"
          />
          
          <TextField
            label="API Key"
            type="password"
            placeholder="Enter your LMS API key"
            descriptiveText="API key or token for authentication"
          />
          
          <SwitchField
            label="Use OAuth"
            labelPosition="end"
            defaultChecked={false}
            descriptiveText="Use OAuth 2.0 for authentication instead of API key"
          />
          
          <Flex justifyContent="flex-end" gap="1rem">
            <Button variation="link">Test Connection</Button>
            <Button variation="primary">Save Connection</Button>
          </Flex>
        </Flex>
      </Card>
      
      <Card>
        <Heading level={3}>Import Student Data</Heading>
        <Divider />
        <Flex direction="column" gap="1rem" padding="1rem">
          <SelectField
            label="Course/Cohort"
            descriptiveText="Select the course or cohort to import"
          >
            <option value="">Select a course...</option>
            <option value="course-1">Web Development Cohort 1</option>
            <option value="course-2">Data Science Cohort 2</option>
            <option value="course-3">UX Design Cohort 1</option>
          </SelectField>
          
          <Flex direction="column" gap="0.5rem">
            <Text fontWeight="bold">Data to Import</Text>
            <Flex gap="1rem" wrap="wrap">
              <SwitchField
                label="Student Profiles"
                labelPosition="end"
                defaultChecked={true}
              />
              <SwitchField
                label="Submissions"
                labelPosition="end"
                defaultChecked={true}
              />
              <SwitchField
                label="Grades"
                labelPosition="end"
                defaultChecked={true}
              />
              <SwitchField
                label="Feedback"
                labelPosition="end"
                defaultChecked={true}
              />
            </Flex>
          </Flex>
          
          <SelectField
            label="Import Strategy"
            descriptiveText="How to handle existing data"
          >
            <option value="merge">Merge (Update existing, add new)</option>
            <option value="overwrite">Overwrite (Replace existing data)</option>
            <option value="skip">Skip (Only add new data)</option>
          </SelectField>
          
          <Flex justifyContent="flex-end" gap="1rem">
            <Button variation="primary">Start Import</Button>
          </Flex>
        </Flex>
      </Card>
      
      <Card>
        <Heading level={3}>Import History</Heading>
        <Divider />
        <Table highlightOnHover={true}>
          <TableHead>
            <TableRow>
              <TableCell as="th">Date</TableCell>
              <TableCell as="th">Course/Cohort</TableCell>
              <TableCell as="th">Data Types</TableCell>
              <TableCell as="th">Records</TableCell>
              <TableCell as="th">Status</TableCell>
              <TableCell as="th">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>2025-01-15 09:30 AM</TableCell>
              <TableCell>Web Development Cohort 1</TableCell>
              <TableCell>Profiles, Submissions</TableCell>
              <TableCell>24 students, 96 submissions</TableCell>
              <TableCell>
                <Badge variation="success">Completed</Badge>
              </TableCell>
              <TableCell>
                <Button size="small">View Details</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025-01-10 02:15 PM</TableCell>
              <TableCell>Data Science Cohort 2</TableCell>
              <TableCell>Profiles, Submissions, Grades</TableCell>
              <TableCell>18 students, 72 submissions</TableCell>
              <TableCell>
                <Badge variation="success">Completed</Badge>
              </TableCell>
              <TableCell>
                <Button size="small">View Details</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025-01-05 11:45 AM</TableCell>
              <TableCell>UX Design Cohort 1</TableCell>
              <TableCell>Profiles, Submissions</TableCell>
              <TableCell>15 students, 45 submissions</TableCell>
              <TableCell>
                <Badge variation="warning">Partial</Badge>
              </TableCell>
              <TableCell>
                <Button size="small">View Details</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Flex justifyContent="center" padding="1rem">
          <Pagination currentPage={1} totalPages={3} siblingCount={1} />
        </Flex>
      </Card>
      
      <Card>
        <Heading level={3}>Conflict Resolution</Heading>
        <Divider />
        <Flex direction="column" gap="1rem" padding="1rem">
          <Alert variation="warning" heading="3 Conflicts Pending Resolution">
            There are 3 data conflicts from the last import that require manual resolution.
          </Alert>
          
          <Table highlightOnHover={true}>
            <TableHead>
              <TableRow>
                <TableCell as="th">Student</TableCell>
                <TableCell as="th">Data Type</TableCell>
                <TableCell as="th">Conflict Type</TableCell>
                <TableCell as="th">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>John Smith</TableCell>
                <TableCell>Profile</TableCell>
                <TableCell>Email mismatch</TableCell>
                <TableCell>
                  <Flex gap="0.5rem">
                    <Button size="small" variation="primary">Resolve</Button>
                  </Flex>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Maria Garcia</TableCell>
                <TableCell>Submission</TableCell>
                <TableCell>Duplicate submission</TableCell>
                <TableCell>
                  <Flex gap="0.5rem">
                    <Button size="small" variation="primary">Resolve</Button>
                  </Flex>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>David Johnson</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Grade discrepancy</TableCell>
                <TableCell>
                  <Flex gap="0.5rem">
                    <Button size="small" variation="primary">Resolve</Button>
                  </Flex>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Flex>
      </Card>
      
      <Card>
        <Heading level={3}>Scheduled Imports</Heading>
        <Divider />
        <Flex direction="column" gap="1rem" padding="1rem">
          <SwitchField
            label="Enable Scheduled Imports"
            labelPosition="end"
            defaultChecked={false}
            descriptiveText="Automatically import data on a schedule"
          />
          
          <SelectField
            label="Frequency"
            descriptiveText="How often to import data"
            isDisabled={true}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </SelectField>
          
          <TextField
            label="Time of Day"
            type="time"
            defaultValue="00:00"
            descriptiveText="When to run the import (24-hour format)"
            isDisabled={true}
          />
          
          <Flex justifyContent="flex-end" gap="1rem">
            <Button variation="primary" isDisabled={true}>Save Schedule</Button>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
};

export default LMSIntegrationPage; 