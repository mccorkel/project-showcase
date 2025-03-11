import React from 'react';
import { Card, Heading, Text, Flex, Divider, Button, SelectField, TextField, Table, TableCell, TableBody, TableHead, TableRow, Badge, Pagination } from '@aws-amplify/ui-react';

const AuditLogsPage = () => {
  return (
    <Flex direction="column" gap="1rem">
      <Heading level={2}>Audit Logs</Heading>
      <Text>View system audit logs for all actions performed by users.</Text>
      
      <Card>
        <Heading level={3}>Filters</Heading>
        <Divider />
        <Flex direction={{ base: 'column', large: 'row' }} gap="1rem" padding="1rem" wrap="wrap">
          <TextField
            label="User"
            placeholder="Search by user email or ID"
            width={{ base: '100%', large: '25%' }}
          />
          <SelectField
            label="Action Type"
            placeholder="All Actions"
            width={{ base: '100%', large: '25%' }}
          >
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="publish">Publish</option>
            <option value="grade">Grade</option>
          </SelectField>
          <SelectField
            label="Resource Type"
            placeholder="All Resources"
            width={{ base: '100%', large: '25%' }}
          >
            <option value="user">User</option>
            <option value="profile">Profile</option>
            <option value="submission">Submission</option>
            <option value="showcase">Showcase</option>
            <option value="template">Template</option>
            <option value="cohort">Cohort</option>
          </SelectField>
          <TextField
            label="Date Range"
            type="date"
            width={{ base: '100%', large: '25%' }}
          />
        </Flex>
        <Flex justifyContent="flex-end" padding="0 1rem 1rem">
          <Button variation="primary">Apply Filters</Button>
        </Flex>
      </Card>
      
      <Card>
        <Flex justifyContent="space-between" alignItems="center" padding="1rem">
          <Heading level={3}>Audit Log Entries</Heading>
          <Button variation="primary">Export Logs</Button>
        </Flex>
        <Divider />
        <Table highlightOnHover={true}>
          <TableHead>
            <TableRow>
              <TableCell as="th">Timestamp</TableCell>
              <TableCell as="th">User</TableCell>
              <TableCell as="th">Action</TableCell>
              <TableCell as="th">Resource Type</TableCell>
              <TableCell as="th">Resource ID</TableCell>
              <TableCell as="th">IP Address</TableCell>
              <TableCell as="th">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>2025-01-16 14:32:45</TableCell>
              <TableCell>admin@example.com</TableCell>
              <TableCell>Create</TableCell>
              <TableCell>User</TableCell>
              <TableCell>us-east-1:b2c3d4e5-f6g7-8901</TableCell>
              <TableCell>192.168.1.1</TableCell>
              <TableCell><Badge variation="success">Success</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025-01-16 14:30:12</TableCell>
              <TableCell>instructor@example.com</TableCell>
              <TableCell>Update</TableCell>
              <TableCell>Submission</TableCell>
              <TableCell>sub-12345</TableCell>
              <TableCell>192.168.1.2</TableCell>
              <TableCell><Badge variation="success">Success</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025-01-16 14:28:55</TableCell>
              <TableCell>student@example.com</TableCell>
              <TableCell>Publish</TableCell>
              <TableCell>Showcase</TableCell>
              <TableCell>show-67890</TableCell>
              <TableCell>192.168.1.3</TableCell>
              <TableCell><Badge variation="success">Success</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025-01-16 14:25:33</TableCell>
              <TableCell>admin@example.com</TableCell>
              <TableCell>Delete</TableCell>
              <TableCell>Template</TableCell>
              <TableCell>temp-54321</TableCell>
              <TableCell>192.168.1.1</TableCell>
              <TableCell><Badge variation="success">Success</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025-01-16 14:20:18</TableCell>
              <TableCell>student@example.com</TableCell>
              <TableCell>Login</TableCell>
              <TableCell>Session</TableCell>
              <TableCell>sess-98765</TableCell>
              <TableCell>192.168.1.3</TableCell>
              <TableCell><Badge variation="success">Success</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025-01-16 14:15:42</TableCell>
              <TableCell>unknown@example.com</TableCell>
              <TableCell>Login</TableCell>
              <TableCell>Session</TableCell>
              <TableCell>N/A</TableCell>
              <TableCell>192.168.1.4</TableCell>
              <TableCell><Badge variation="error">Failed</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025-01-16 14:10:05</TableCell>
              <TableCell>instructor@example.com</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Submission</TableCell>
              <TableCell>sub-24680</TableCell>
              <TableCell>192.168.1.2</TableCell>
              <TableCell><Badge variation="success">Success</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025-01-16 14:05:30</TableCell>
              <TableCell>admin@example.com</TableCell>
              <TableCell>Update</TableCell>
              <TableCell>System Settings</TableCell>
              <TableCell>settings-global</TableCell>
              <TableCell>192.168.1.1</TableCell>
              <TableCell><Badge variation="success">Success</Badge></TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Flex justifyContent="center" padding="1rem">
          <Pagination
            currentPage={1}
            totalPages={10}
            siblingCount={1}
            onChange={() => {}}
          />
        </Flex>
      </Card>
      
      <Card>
        <Heading level={3}>Alert Configuration</Heading>
        <Divider />
        <Flex direction="column" gap="1rem" padding="1rem">
          <Text>Configure alerts for suspicious activity in the audit logs.</Text>
          <Flex direction={{ base: 'column', large: 'row' }} gap="1rem">
            <SelectField
              label="Alert Type"
              width={{ base: '100%', large: '50%' }}
            >
              <option value="failed_login">Failed Login Attempts</option>
              <option value="admin_action">Administrative Actions</option>
              <option value="data_deletion">Data Deletion</option>
              <option value="permission_change">Permission Changes</option>
              <option value="system_settings">System Settings Changes</option>
            </SelectField>
            <TextField
              label="Threshold"
              type="number"
              defaultValue="5"
              width={{ base: '100%', large: '50%' }}
              descriptiveText="Number of occurrences before alert is triggered"
            />
          </Flex>
          <Flex direction={{ base: 'column', large: 'row' }} gap="1rem">
            <TextField
              label="Notification Email"
              placeholder="Enter email address for alerts"
              width={{ base: '100%', large: '50%' }}
            />
            <SelectField
              label="Time Window"
              width={{ base: '100%', large: '50%' }}
            >
              <option value="5min">5 Minutes</option>
              <option value="15min">15 Minutes</option>
              <option value="30min">30 Minutes</option>
              <option value="1hour">1 Hour</option>
              <option value="1day">1 Day</option>
            </SelectField>
          </Flex>
          <Flex justifyContent="flex-end">
            <Button variation="primary">Save Alert Configuration</Button>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
};

export default AuditLogsPage; 