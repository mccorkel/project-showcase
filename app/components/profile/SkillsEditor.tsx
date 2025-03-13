'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Heading, 
  Flex, 
  Divider, 
  Button, 
  TextField,
  Badge,
  useTheme,
  Collection,
  Text
} from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '../../contexts/AuthContext';
import { addSkillCategory } from '../../graphql/operations/userProfile';

const client = generateClient();

interface SkillCategory {
  category: string;
  skills: string[];
}

interface SkillsEditorProps {
  onSave?: () => void;
}

const SkillsEditor: React.FC<SkillsEditorProps> = ({ onSave }) => {
  const { tokens } = useTheme();
  const { studentProfile, refreshStudentProfile } = useAuth();
  
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editCategory, setEditCategory] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [newSkill, setNewSkill] = useState('');

  // Load skills when the component mounts
  useEffect(() => {
    if (studentProfile?.skills) {
      setSkillCategories(studentProfile.skills || []);
    }
  }, [studentProfile]);

  // Start editing a category
  const startEditing = (index: number) => {
    setIsEditing(index);
    if (index === -1) {
      // Adding a new category
      setEditCategory('');
      setEditSkills('');
    } else {
      // Editing an existing category
      const category = skillCategories[index];
      setEditCategory(category.category);
      setEditSkills(category.skills.join(', '));
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(null);
    setEditCategory('');
    setEditSkills('');
    setNewSkill('');
  };

  // Save the current edit
  const saveEdit = () => {
    const updatedCategories = [...skillCategories];
    const skills = editSkills.split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
    
    if (isEditing === -1) {
      // Adding a new category
      updatedCategories.push({
        category: editCategory,
        skills
      });
    } else if (isEditing !== null) {
      // Updating an existing category
      updatedCategories[isEditing] = {
        category: editCategory,
        skills
      };
    }
    
    setSkillCategories(updatedCategories);
    setIsEditing(null);
    setEditCategory('');
    setEditSkills('');
  };

  // Remove a category
  const removeCategory = (index: number) => {
    const updatedCategories = [...skillCategories];
    updatedCategories.splice(index, 1);
    setSkillCategories(updatedCategories);
  };

  // Add a skill to the current category being edited
  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    const currentSkills = editSkills ? editSkills.split(',').map(s => s.trim()) : [];
    if (!currentSkills.includes(newSkill.trim())) {
      const updatedSkills = [...currentSkills, newSkill.trim()].join(', ');
      setEditSkills(updatedSkills);
    }
    setNewSkill('');
  };

  // Remove a skill from the current category being edited
  const removeSkill = (skillToRemove: string) => {
    const currentSkills = editSkills.split(',').map(s => s.trim());
    const updatedSkills = currentSkills.filter(skill => skill !== skillToRemove).join(', ');
    setEditSkills(updatedSkills);
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
      // Update skills
      await client.graphql({
        query: addSkillCategory,
        variables: {
          id: studentProfile.id,
          skills: skillCategories
        }
      });
      
      // Refresh the profile data
      await refreshStudentProfile();
      
      // Call the onSave callback if provided
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Error updating skills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <Heading level={3}>Skills</Heading>
      <Divider marginBlock={tokens.space.medium} />
      
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap={tokens.space.medium}>
          {/* List of skill categories */}
          <Collection
            items={skillCategories}
            type="list"
            gap={tokens.space.medium}
          >
            {(category, index) => (
              <Card key={index} variation="outlined">
                <Flex direction="column" gap={tokens.space.small}>
                  <Heading level={5}>{category.category}</Heading>
                  <Flex wrap="wrap" gap={tokens.space.xs}>
                    {category.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variation="info">
                        {skill}
                      </Badge>
                    ))}
                  </Flex>
                  <Flex justifyContent="flex-end" gap={tokens.space.small}>
                    <Button
                      onClick={() => startEditing(index)}
                      variation="link"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => removeCategory(index)}
                      variation="destructive"
                    >
                      Remove
                    </Button>
                  </Flex>
                </Flex>
              </Card>
            )}
          </Collection>
          
          {/* Add new category button */}
          {isEditing === null && (
            <Button
              onClick={() => startEditing(-1)}
              variation="link"
              alignSelf="flex-start"
            >
              + Add Skill Category
            </Button>
          )}
          
          {/* Edit form */}
          {isEditing !== null && (
            <Card variation="outlined">
              <Heading level={5}>{isEditing === -1 ? 'Add Skill Category' : 'Edit Skill Category'}</Heading>
              <Divider marginBlock={tokens.space.small} />
              <Flex direction="column" gap={tokens.space.medium}>
                <TextField
                  label="Category Name"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  placeholder="e.g., Frontend, Backend, Database"
                  required
                />
                
                <Flex direction="column" gap={tokens.space.small}>
                  <Text>Skills (comma-separated)</Text>
                  <TextField
                    value={editSkills}
                    onChange={(e) => setEditSkills(e.target.value)}
                    placeholder="e.g., React, JavaScript, HTML, CSS"
                    label="Skills"
                    labelHidden
                  />
                  
                  {/* Display skills as badges */}
                  {editSkills && (
                    <Flex wrap="wrap" gap={tokens.space.xs} marginTop={tokens.space.xs}>
                      {editSkills.split(',').map((skill, i) => (
                        skill.trim() && (
                          <Badge 
                            key={i} 
                            variation="info"
                            onClick={() => removeSkill(skill.trim())}
                            style={{ cursor: 'pointer' }}
                          >
                            {skill.trim()} ✕
                          </Badge>
                        )
                      ))}
                    </Flex>
                  )}
                  
                  {/* Add individual skill */}
                  <Flex direction="row" gap={tokens.space.small}>
                    <TextField
                      placeholder="Add a skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      width="100%"
                      label="Add Skill"
                      labelHidden
                    />
                    <Button
                      onClick={addSkill}
                      variation="primary"
                    >
                      Add
                    </Button>
                  </Flex>
                </Flex>
                
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

export default SkillsEditor; 