'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Heading, 
  Flex, 
  Divider, 
  Button, 
  TextField,
  TextAreaField,
  useTheme,
  Collection
} from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '../../contexts/AuthContext';
import { addEducation } from '../../graphql/operations/userProfile';

const client = generateClient();

interface Education {
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
  description: string;
}

interface EducationEditorProps {
  onSave?: () => void;
}

const EducationEditor: React.FC<EducationEditorProps> = ({ onSave }) => {
  const { tokens } = useTheme();
  const { studentProfile, refreshStudentProfile } = useAuth();
  
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Education>({
    institution: '',
    degree: '',
    field: '',
    start_date: '',
    end_date: '',
    description: ''
  });

  // Load education history when the component mounts
  useEffect(() => {
    if (studentProfile?.education) {
      setEducationList(studentProfile.education || []);
    }
  }, [studentProfile]);

  // Start editing an education entry
  const startEditing = (index: number) => {
    setIsEditing(index);
    setEditForm(index === -1 ? {
      institution: '',
      degree: '',
      field: '',
      start_date: '',
      end_date: '',
      description: ''
    } : {...educationList[index]});
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(null);
  };

  // Update the edit form
  const updateEditForm = (field: keyof Education, value: string) => {
    setEditForm({
      ...editForm,
      [field]: value
    });
  };

  // Save the current edit
  const saveEdit = () => {
    const updatedList = [...educationList];
    
    if (isEditing === -1) {
      // Adding a new entry
      updatedList.push(editForm);
    } else if (isEditing !== null) {
      // Updating an existing entry
      updatedList[isEditing] = editForm;
    }
    
    setEducationList(updatedList);
    setIsEditing(null);
  };

  // Remove an education entry
  const removeEducation = (index: number) => {
    const updatedList = [...educationList];
    updatedList.splice(index, 1);
    setEducationList(updatedList);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentProfile?.id) {
      console.error('No student profile ID found');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update education history
      await client.graphql({
        query: addEducation,
        variables: {
          id: studentProfile.id,
          education: educationList
        }
      });
      
      // Refresh the profile data
      await refreshStudentProfile();
      
      // Call the onSave callback if provided
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Error updating education history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <Heading level={3}>Education History</Heading>
      <Divider marginBlock={tokens.space.medium} />
      
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap={tokens.space.medium}>
          {/* List of education entries */}
          <Collection
            items={educationList}
            type="list"
            gap={tokens.space.medium}
          >
            {(item, index) => (
              <Card key={index} variation="outlined">
                <Flex direction="column" gap={tokens.space.small}>
                  <Heading level={5}>{item.institution}</Heading>
                  <Flex direction="row" gap={tokens.space.small}>
                    <span>{item.degree} in {item.field}</span>
                  </Flex>
                  <Flex direction="row" gap={tokens.space.small}>
                    <span>{item.start_date} - {item.end_date}</span>
                  </Flex>
                  <p>{item.description}</p>
                  <Flex justifyContent="flex-end" gap={tokens.space.small}>
                    <Button
                      onClick={() => startEditing(index)}
                      variation="link"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => removeEducation(index)}
                      variation="destructive"
                    >
                      Remove
                    </Button>
                  </Flex>
                </Flex>
              </Card>
            )}
          </Collection>
          
          {/* Add new education button */}
          {isEditing === null && (
            <Button
              onClick={() => startEditing(-1)}
              variation="link"
              alignSelf="flex-start"
            >
              + Add Education
            </Button>
          )}
          
          {/* Edit form */}
          {isEditing !== null && (
            <Card variation="outlined">
              <Heading level={5}>{isEditing === -1 ? 'Add Education' : 'Edit Education'}</Heading>
              <Divider marginBlock={tokens.space.small} />
              <Flex direction="column" gap={tokens.space.medium}>
                <TextField
                  label="Institution"
                  value={editForm.institution}
                  onChange={(e) => updateEditForm('institution', e.target.value)}
                  placeholder="e.g., University of California, Berkeley"
                  required
                />
                
                <Flex direction={{ base: 'column', large: 'row' }} gap={tokens.space.medium}>
                  <TextField
                    label="Degree"
                    value={editForm.degree}
                    onChange={(e) => updateEditForm('degree', e.target.value)}
                    placeholder="e.g., Bachelor of Science"
                    required
                    width="100%"
                  />
                  <TextField
                    label="Field of Study"
                    value={editForm.field}
                    onChange={(e) => updateEditForm('field', e.target.value)}
                    placeholder="e.g., Computer Science"
                    required
                    width="100%"
                  />
                </Flex>
                
                <Flex direction={{ base: 'column', large: 'row' }} gap={tokens.space.medium}>
                  <TextField
                    label="Start Date"
                    value={editForm.start_date}
                    onChange={(e) => updateEditForm('start_date', e.target.value)}
                    placeholder="e.g., Sep 2018"
                    required
                    width="100%"
                  />
                  <TextField
                    label="End Date"
                    value={editForm.end_date}
                    onChange={(e) => updateEditForm('end_date', e.target.value)}
                    placeholder="e.g., May 2022 or Present"
                    required
                    width="100%"
                  />
                </Flex>
                
                <TextAreaField
                  label="Description"
                  value={editForm.description}
                  onChange={(e) => updateEditForm('description', e.target.value)}
                  placeholder="Describe your studies, achievements, etc."
                  rows={3}
                />
                
                <Flex justifyContent="flex-end" gap={tokens.space.medium}>
                  <Button
                    onClick={cancelEditing}
                    variation="link"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveEdit}
                    variation="primary"
                  >
                    {isEditing === -1 ? 'Add' : 'Update'}
                  </Button>
                </Flex>
              </Flex>
            </Card>
          )}
          
          <Divider />
          
          {/* Save button */}
          <Flex justifyContent="flex-end">
            <Button
              type="submit"
              variation="primary"
              isLoading={isLoading}
              loadingText="Saving..."
            >
              Save Changes
            </Button>
          </Flex>
        </Flex>
      </form>
    </Card>
  );
};

export default EducationEditor; 