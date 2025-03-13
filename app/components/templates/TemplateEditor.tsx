import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Heading, 
  Text, 
  Button, 
  Flex, 
  Divider, 
  TextField, 
  TextAreaField,
  Tabs,
  Grid,
  View,
  Loader,
  Alert,
  Badge,
  SelectField,
  SwitchField,
  useTheme
} from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '../../contexts/AuthContext';
import { getTemplateById, createTemplate, updateTemplate } from '../../graphql/operations/showcase';
import CodeEditor from './CodeEditor';

const client = generateClient();

interface TemplateEditorProps {
  templateId?: string;
  onSave?: (id: string) => void;
  onCancel?: () => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ 
  templateId, 
  onSave, 
  onCancel 
}) => {
  const { tokens } = useTheme();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(templateId ? true : false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  
  const [htmlTemplate, setHtmlTemplate] = useState('<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>{{profile.firstName}} {{profile.lastName}} - Portfolio</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <header>\n    <h1>{{profile.firstName}} {{profile.lastName}}</h1>\n    <p>{{profile.title}}</p>\n  </header>\n  \n  <main>\n    <section id="about">\n      <h2>About Me</h2>\n      <p>{{profile.bio}}</p>\n    </section>\n    \n    <section id="projects">\n      <h2>Projects</h2>\n      <div class="projects-grid">\n        {{#each projects}}\n          {{#if isIncluded}}\n            <div class="project-card">\n              <h3>{{title}}</h3>\n              <p>{{description}}</p>\n              <div class="project-links">\n                {{#if repoLink}}<a href="{{repoLink}}">Repository</a>{{/if}}\n                {{#if demoLink}}<a href="{{demoLink}}">Demo</a>{{/if}}\n                {{#if deployedUrl}}<a href="{{deployedUrl}}">Live Site</a>{{/if}}\n              </div>\n            </div>\n          {{/if}}\n        {{/each}}\n      </div>\n    </section>\n    \n    <section id="skills">\n      <h2>Skills</h2>\n      <ul class="skills-list">\n        {{#each profile.skills}}\n          <li>{{this}}</li>\n        {{/each}}\n      </ul>\n    </section>\n  </main>\n  \n  <footer>\n    <p>&copy; {{currentYear}} {{profile.firstName}} {{profile.lastName}}</p>\n  </footer>\n  \n  <script src="script.js"></script>\n</body>\n</html>');
  
  const [cssTemplate, setCssTemplate] = useState('/* Base Styles */\n* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nbody {\n  font-family: {{customization.fontPreference}};\n  line-height: 1.6;\n  color: #333;\n  background-color: #fff;\n}\n\nheader {\n  background-color: {{customization.themeColor}};\n  color: white;\n  padding: 2rem;\n  text-align: center;\n}\n\nmain {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 2rem;\n}\n\nsection {\n  margin-bottom: 3rem;\n}\n\nh2 {\n  color: {{customization.themeColor}};\n  margin-bottom: 1rem;\n  border-bottom: 2px solid {{customization.accentColor}};\n  padding-bottom: 0.5rem;\n}\n\n/* Projects Grid */\n.projects-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n  gap: 2rem;\n}\n\n.project-card {\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  padding: 1.5rem;\n  box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n}\n\n.project-card h3 {\n  color: {{customization.themeColor}};\n  margin-bottom: 1rem;\n}\n\n.project-links {\n  display: flex;\n  gap: 1rem;\n  margin-top: 1rem;\n}\n\n.project-links a {\n  color: {{customization.accentColor}};\n  text-decoration: none;\n}\n\n.project-links a:hover {\n  text-decoration: underline;\n}\n\n/* Skills List */\n.skills-list {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;\n  list-style: none;\n}\n\n.skills-list li {\n  background-color: {{customization.accentColor}};\n  color: white;\n  padding: 0.5rem 1rem;\n  border-radius: 4px;\n}\n\n/* Footer */\nfooter {\n  background-color: #333;\n  color: white;\n  text-align: center;\n  padding: 1rem;\n  margin-top: 2rem;\n}\n\n/* Responsive Design */\n@media (max-width: 768px) {\n  .projects-grid {\n    grid-template-columns: 1fr;\n  }\n}');
  
  const [jsTemplate, setJsTemplate] = useState('// Add any JavaScript functionality here\ndocument.addEventListener("DOMContentLoaded", function() {\n  console.log("Template loaded successfully");\n  \n  // Example: Add current year to footer\n  const currentYear = new Date().getFullYear();\n  document.querySelector("footer p").innerHTML = document.querySelector("footer p").innerHTML.replace("{{currentYear}}", currentYear);\n});');

  // Fetch template data if editing an existing template
  useEffect(() => {
    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  // Fetch template data from API
  const fetchTemplate = async () => {
    setIsLoading(true);
    
    try {
      const result = await client.graphql({
        query: getTemplateById,
        variables: {
          id: templateId
        }
      });
      
      if ('data' in result && result.data.getTemplate) {
        const templateData = result.data.getTemplate;
        
        // Set component state from template data
        setName(templateData.name || '');
        setDescription(templateData.description || '');
        setCategory(templateData.category || 'general');
        setTags(templateData.tags || []);
        setFeatures(templateData.features || []);
        setIsPublic(templateData.isPublic || false);
        
        if (templateData.templateData) {
          try {
            const templateFiles = JSON.parse(templateData.templateData);
            if (templateFiles.html) setHtmlTemplate(templateFiles.html);
            if (templateFiles.css) setCssTemplate(templateFiles.css);
            if (templateFiles.js) setJsTemplate(templateFiles.js);
          } catch (error) {
            console.error('Error parsing template data:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching template:', error);
      setSaveError('Failed to load template data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save template data
  const saveTemplate = async () => {
    if (!user) {
      setSaveError('User not authenticated. Please log in and try again.');
      return;
    }
    
    // Validate required fields
    if (!name.trim()) {
      setSaveError('Template name is required.');
      return;
    }
    
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    const templateData = {
      name,
      description,
      category,
      tags,
      features,
      isPublic,
      templateData: JSON.stringify({
        html: htmlTemplate,
        css: cssTemplate,
        js: jsTemplate
      }),
      createdBy: user.username
    };
    
    try {
      let result;
      
      if (templateId) {
        // Update existing template
        result = await client.graphql({
          query: updateTemplate,
          variables: {
            input: {
              id: templateId,
              ...templateData
            }
          }
        });
      } else {
        // Create new template
        result = await client.graphql({
          query: createTemplate,
          variables: {
            input: templateData
          }
        });
      }
      
      setSaveSuccess(true);
      
      // Call onSave callback if provided
      if (onSave) {
        const savedId = templateId || 
          (result.data?.createTemplate?.id || result.data?.updateTemplate?.id);
        
        if (savedId) {
          onSave(savedId);
        }
      }
    } catch (error) {
      console.error('Error saving template:', error);
      setSaveError('Failed to save template. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Add a new tag
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Add a new feature
  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  // Remove a feature
  const removeFeature = (featureToRemove: string) => {
    setFeatures(features.filter(feature => feature !== featureToRemove));
  };

  if (isLoading) {
    return (
      <Card>
        <Flex justifyContent="center" padding={tokens.space.xl}>
          <Loader size="large" />
        </Flex>
      </Card>
    );
  }

  return (
    <Card>
      <Heading level={2}>{templateId ? 'Edit Template' : 'Create Template'}</Heading>
      <Text>Design a custom template for student showcases.</Text>
      <Divider marginBlock={tokens.space.medium} />
      
      {saveSuccess && (
        <Alert
          variation="success"
          isDismissible={true}
          hasIcon={true}
          heading="Template Saved"
          marginBottom={tokens.space.medium}
        >
          Your template has been saved successfully.
        </Alert>
      )}
      
      {saveError && (
        <Alert
          variation="error"
          isDismissible={true}
          hasIcon={true}
          heading="Error"
          marginBottom={tokens.space.medium}
        >
          {saveError}
        </Alert>
      )}
      
      <Flex direction="column" gap={tokens.space.medium}>
        <TextField
          label="Template Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name for your template"
          isRequired={true}
        />
        
        <TextAreaField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your template"
          rows={3}
        />
        
        <Flex gap={tokens.space.medium}>
          <SelectField
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            flex="1"
          >
            <option value="general">General</option>
            <option value="portfolio">Portfolio</option>
            <option value="resume">Resume</option>
            <option value="creative">Creative</option>
            <option value="minimal">Minimal</option>
            <option value="professional">Professional</option>
          </SelectField>
          
          <SwitchField
            label="Make Public"
            labelPosition="start"
            isChecked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            alignSelf="flex-end"
          />
        </Flex>
        
        <Card variation="outlined" padding={tokens.space.medium}>
          <Heading level={4}>Tags</Heading>
          <Text>Add tags to help users find your template.</Text>
          
          <Flex alignItems="flex-end" gap={tokens.space.small} marginTop={tokens.space.small}>
            <TextField
              label="New Tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Enter a tag"
              flex="1"
            />
            <Button onClick={addTag}>Add</Button>
          </Flex>
          
          {tags.length > 0 && (
            <Flex wrap="wrap" gap={tokens.space.xs} marginTop={tokens.space.medium}>
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variation="info"
                  marginRight={tokens.space.xs}
                  marginBottom={tokens.space.xs}
                >
                  {tag}
                  <Button
                    size="small"
                    variation="link"
                    onClick={() => removeTag(tag)}
                    marginLeft={tokens.space.xs}
                  >
                    ✕
                  </Button>
                </Badge>
              ))}
            </Flex>
          )}
        </Card>
        
        <Card variation="outlined" padding={tokens.space.medium}>
          <Heading level={4}>Features</Heading>
          <Text>List the features supported by your template.</Text>
          
          <Flex alignItems="flex-end" gap={tokens.space.small} marginTop={tokens.space.small}>
            <TextField
              label="New Feature"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Enter a feature"
              flex="1"
            />
            <Button onClick={addFeature}>Add</Button>
          </Flex>
          
          {features.length > 0 && (
            <View marginTop={tokens.space.medium}>
              {features.map((feature) => (
                <Badge
                  key={feature}
                  variation="info"
                  marginRight={tokens.space.xs}
                  marginBottom={tokens.space.xs}
                >
                  {feature}
                  <Button
                    size="small"
                    variation="link"
                    onClick={() => removeFeature(feature)}
                    marginLeft={tokens.space.xs}
                  >
                    ✕
                  </Button>
                </Badge>
              ))}
            </View>
          )}
        </Card>
        
        <Tabs>
          <Tabs.Item title="HTML" value="html">
            <Card variation="outlined" padding={tokens.space.medium}>
              <Heading level={4}>HTML Template</Heading>
              <Text marginBottom={tokens.space.medium}>
                Use Handlebars syntax ({'{{variable}}'}) to insert dynamic content.
              </Text>
              
              <CodeEditor
                value={htmlTemplate}
                onChange={setHtmlTemplate}
                language="html"
                height="400px"
              />
            </Card>
          </Tabs.Item>
          
          <Tabs.Item title="CSS" value="css">
            <Card variation="outlined" padding={tokens.space.medium}>
              <Heading level={4}>CSS Template</Heading>
              <Text marginBottom={tokens.space.medium}>
                Use Handlebars syntax ({'{{variable}}'}) to insert dynamic styles.
              </Text>
              
              <CodeEditor
                value={cssTemplate}
                onChange={setCssTemplate}
                language="css"
                height="400px"
              />
            </Card>
          </Tabs.Item>
          
          <Tabs.Item title="JavaScript" value="js">
            <Card variation="outlined" padding={tokens.space.medium}>
              <Heading level={4}>JavaScript Template</Heading>
              <Text marginBottom={tokens.space.medium}>
                Add interactive functionality to your template.
              </Text>
              
              <CodeEditor
                value={jsTemplate}
                onChange={setJsTemplate}
                language="javascript"
                height="400px"
              />
            </Card>
          </Tabs.Item>
          
          <Tabs.Item title="Template Variables" value="variables">
            <Card variation="outlined" padding={tokens.space.medium}>
              <Heading level={4}>Available Template Variables</Heading>
              <Text marginBottom={tokens.space.medium}>
                Use these variables in your template to insert dynamic content.
              </Text>
              
              <Flex direction="column" gap={tokens.space.medium}>
                <Card variation="outlined" padding={tokens.space.small}>
                  <Heading level={5}>Profile Variables</Heading>
                  <Text>Access student profile information.</Text>
                  <View as="pre" padding={tokens.space.small} backgroundColor={tokens.colors.background.secondary}>
                    {`{{profile.firstName}} - Student's first name
{{profile.lastName}} - Student's last name
{{profile.title}} - Professional title
{{profile.bio}} - About me/bio text
{{profile.avatarUrl}} - URL to profile image
{{profile.location}} - Current location
{{profile.skills}} - Array of skills
{{profile.education}} - Array of education history
{{profile.experience}} - Array of work experience
{{profile.socialLinks}} - Object containing social media links`}
                  </View>
                </Card>
                
                <Card variation="outlined" padding={tokens.space.small}>
                  <Heading level={5}>Projects Variables</Heading>
                  <Text>Access student projects.</Text>
                  <View as="pre" padding={tokens.space.small} backgroundColor={tokens.colors.background.secondary}>
                    {`{{#each projects}} - Loop through all projects
  {{#if isIncluded}} - Check if project is included in showcase
    {{title}} - Project title
    {{description}} - Project description
    {{technologies}} - Array of technologies used
    {{featuredImageUrl}} - URL to featured image
    {{repoLink}} - Repository URL
    {{demoLink}} - Demo URL
    {{deployedUrl}} - Deployed application URL
  {{/if}}
{{/each}}`}
                  </View>
                </Card>
                
                <Card variation="outlined" padding={tokens.space.small}>
                  <Heading level={5}>Customization Variables</Heading>
                  <Text>Access showcase customization settings.</Text>
                  <View as="pre" padding={tokens.space.small} backgroundColor={tokens.colors.background.secondary}>
                    {`{{customization.themeColor}} - Primary theme color
{{customization.accentColor}} - Accent color
{{customization.fontPreference}} - Font preference
{{customization.layoutPreference}} - Layout preference`}
                  </View>
                </Card>
              </Flex>
            </Card>
          </Tabs.Item>
        </Tabs>
      </Flex>
      
      <Flex justifyContent="space-between" marginTop={tokens.space.xl}>
        {onCancel && (
          <Button
            variation="link"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        
        <Button
          variation="primary"
          onClick={saveTemplate}
          isLoading={isSaving}
        >
          {templateId ? 'Update Template' : 'Create Template'}
        </Button>
      </Flex>
    </Card>
  );
};

export default TemplateEditor; 