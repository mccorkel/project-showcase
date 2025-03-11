import React from 'react';
import { Card, Heading, Text, Flex, Divider, Button, SelectField, TextField, Table, TableCell, TableBody, TableHead, TableRow, Badge, Pagination, SwitchField } from '@aws-amplify/ui-react';

const PermissionDelegationsPage = () => {
  return (
    <Flex direction="column" gap="1rem">
      <Heading level={2}>Permission Delegations</Heading>
      <Text>Manage temporary permission delegations between users in the system.</Text>
      
      <Card>
        <Heading level={3}>Create New Delegation</Heading>
        <Divider />
        <Flex direction="column" gap="1rem" padding="1rem">
          <Flex direction={{ base: 'column', large: 'row' }} gap="1rem">
            <TextField
              label="Delegator (From)"
              placeholder="Search by email or name"
              width={{ base: '100%', large: '50%' }}
              descriptiveText="User who is delegating permissions"
            />
            <TextField
              label="Delegatee (To)"
              placeholder="Search by email or name"
              width={{ base: '100%', large: '50%' }}
              descriptiveText="User who will receive delegated permissions"
            />
          </Flex>
          
          <Heading level={5}>Permissions to Delegate</Heading>
          <Flex direction="column" gap="0.5rem">
            <SwitchField
              label="Grade Submissions"
              labelPosition="end"
            />
            <SwitchField
              label="Manage Students"
              labelPosition="end"
            />
            <SwitchField
              label="Manage Cohorts"
              labelPosition="end"
            />
            <SwitchField
              label="Publish Showcases"
              labelPosition="end"
            />
            <SwitchField
              label="Manage Templates"
              labelPosition="end"
            />
          </Flex>
          
          <Heading level={5}>Resource Scope</Heading>
          <SelectField
            label="Resource Type"
          >
            <option value="all">All Resources</option>
            <option value="cohort">Specific Cohort</option>
            <option value="student">Specific Student</option>
            <option value="submission">Specific Submission</option>
            <option value="template">Specific Template</option>
          </SelectField>
          
          <TextField
            label="Resource ID"
            placeholder="Enter resource ID (leave blank for all)"
            descriptiveText="ID of the specific resource this delegation applies to"
          />
          
          <Heading level={5}>Delegation Duration</Heading>
          <Flex direction={{ base: 'column', large: 'row' }} gap="1rem">
            <TextField
              label="Start Date"
              type="date"
              width={{ base: '100%', large: '50%' }}
            />
            <TextField
              label="Expiration Date"
              type="date"
              width={{ base: '100%', large: '50%' }}
            />
          </Flex>
          
          <TextField
            label="Reason for Delegation"
            placeholder="Enter reason for this delegation"
            descriptiveText="Will be recorded in audit logs"
          />
          
          <Flex justifyContent="flex-end">
            <Button variation="primary">Create Delegation</Button>
          </Flex>
        </Flex>
      </Card>
      
      <Card>
        <Flex justifyContent="space-between" alignItems="center" padding="1rem">
          <Heading level={3}>Active Delegations</Heading>
          <Button variation="primary">Export Delegations</Button>
        </Flex>
        <Divider />
        <Table highlightOnHover={true}>
          <TableHead>
            <TableRow>
              <TableCell as="th">Delegator</TableCell>
              <TableCell as="th">Delegatee</TableCell>
              <TableCell as="th">Permissions</TableCell>
              <TableCell as="th">Resource Type</TableCell>
              <TableCell as="th">Resource ID</TableCell>
              <TableCell as="th">Created</TableCell>
              <TableCell as="th">Expires</TableCell>
              <TableCell as="th">Status</TableCell>
              <TableCell as="th">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>admin@example.com</TableCell>
              <TableCell>instructor@example.com</TableCell>
              <TableCell>Grade Submissions, Manage Students</TableCell>
              <TableCell>Cohort</TableCell>
              <TableCell>cohort-12345</TableCell>
              <TableCell>2025-01-15</TableCell>
              <TableCell>2025-02-15</TableCell>
              <TableCell><Badge variation="success">Active</Badge></TableCell>
              <TableCell>
                <Button size="small" variation="link">Revoke</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>admin@example.com</TableCell>
              <TableCell>instructor2@example.com</TableCell>
              <TableCell>Manage Templates</TableCell>
              <TableCell>All</TableCell>
              <TableCell>-</TableCell>
              <TableCell>2025-01-10</TableCell>
              <TableCell>2025-01-20</TableCell>
              <TableCell><Badge variation="success">Active</Badge></TableCell>
              <TableCell>
                <Button size="small" variation="link">Revoke</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>instructor@example.com</TableCell>
              <TableCell>instructor3@example.com</TableCell>
              <TableCell>Grade Submissions</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>student-67890</TableCell>
              <TableCell>2025-01-05</TableCell>
              <TableCell>2025-01-12</TableCell>
              <TableCell><Badge variation="warning">Expiring Soon</Badge></TableCell>
              <TableCell>
                <Button size="small" variation="link">Revoke</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Flex justifyContent="center" padding="1rem">
          <Pagination
            currentPage={1}
            totalPages={1}
            siblingCount={1}
            onChange={() => {}}
          />
        </Flex>
      </Card>
      
      <Card>
        <Heading level={3}>Delegation History</Heading>
        <Divider />
        <Table highlightOnHover={true}>
          <TableHead>
            <TableRow>
              <TableCell as="th">Delegator</TableCell>
              <TableCell as="th">Delegatee</TableCell>
              <TableCell as="th">Permissions</TableCell>
              <TableCell as="th">Resource Type</TableCell>
              <TableCell as="th">Created</TableCell>
              <TableCell as="th">Expired/Revoked</TableCell>
              <TableCell as="th">Status</TableCell>
              <TableCell as="th">Revoked By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>admin@example.com</TableCell>
              <TableCell>instructor4@example.com</TableCell>
              <TableCell>Manage Cohorts</TableCell>
              <TableCell>All</TableCell>
              <TableCell>2024-12-15</TableCell>
              <TableCell>2025-01-15</TableCell>
              <TableCell><Badge variation="info">Expired</Badge></TableCell>
              <TableCell>-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>admin@example.com</TableCell>
              <TableCell>instructor5@example.com</TableCell>
              <TableCell>Publish Showcases</TableCell>
              <TableCell>Cohort</TableCell>
              <TableCell>2024-12-10</TableCell>
              <TableCell>2024-12-20</TableCell>
              <TableCell><Badge variation="error">Revoked</Badge></TableCell>
              <TableCell>admin@example.com</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Flex justifyContent="center" padding="1rem">
          <Pagination
            currentPage={1}
            totalPages={1}
            siblingCount={1}
            onChange={() => {}}
          />
        </Flex>
      </Card>
      
      <Card>
        <Heading level={3}>Delegation Settings</Heading>
        <Divider />
        <Flex direction="column" gap="1rem" padding="1rem">
          <TextField
            label="Maximum Delegation Duration (days)"
            type="number"
            defaultValue="30"
            descriptiveText="Maximum number of days a delegation can be active"
          />
          <SwitchField
            label="Require Approval for Delegations"
            defaultChecked={true}
            labelPosition="end"
            descriptiveText="When enabled, delegations require approval from an administrator"
          />
          <SwitchField
            label="Allow Delegation Chaining"
            defaultChecked={false}
            labelPosition="end"
            descriptiveText="When enabled, users with delegated permissions can delegate those permissions to others"
          />
          <SwitchField
            label="Notify Users on Delegation"
            defaultChecked={true}
            labelPosition="end"
            descriptiveText="Send email notifications when permissions are delegated"
          />
          <Flex justifyContent="flex-end">
            <Button variation="primary">Save Settings</Button>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
};

export default PermissionDelegationsPage; 