import React, { useState, useEffect, ChangeEvent } from 'react';
import { 
  Card, 
  Heading, 
  Flex, 
  Divider, 
  Button, 
  useTheme,
  Text,
  View,
  RadioGroupField,
  Radio,
  SelectField,
  SwitchField,
  Tabs
} from '@aws-amplify/ui-react';

interface CustomizationOptionsProps {
  customization: {
    themeColor: string;
    accentColor: string;
    fontPreference: string;
    layoutPreference: string;
    sectionsOrder: string[];
    sectionsVisibility: {
      about: boolean;
      projects: boolean;
      skills: boolean;
      experience: boolean;
      education: boolean;
      blogs: boolean;
      contact: boolean;
    };
  };
  onChange: (customization: any) => void;
}

const CustomizationOptions: React.FC<CustomizationOptionsProps> = ({ 
  customization, 
  onChange 
}) => {
  const { tokens } = useTheme();
  
  const [themeColor, setThemeColor] = useState(customization?.themeColor || '#0066cc');
  const [accentColor, setAccentColor] = useState(customization?.accentColor || '#ff9900');
  const [fontPreference, setFontPreference] = useState(customization?.fontPreference || 'system');
  const [layoutPreference, setLayoutPreference] = useState(customization?.layoutPreference || 'standard');
  const [sectionsOrder, setSectionsOrder] = useState<string[]>(customization?.sectionsOrder || [
    'about', 'projects', 'skills', 'experience', 'education', 'blogs', 'contact'
  ]);
  const [sectionsVisibility, setSectionsVisibility] = useState(customization?.sectionsVisibility || {
    about: true,
    projects: true,
    skills: true,
    experience: true,
    education: true,
    blogs: true,
    contact: true
  });

  // Update local state when props change
  useEffect(() => {
    if (customization) {
      setThemeColor(customization.themeColor || '#0066cc');
      setAccentColor(customization.accentColor || '#ff9900');
      setFontPreference(customization.fontPreference || 'system');
      setLayoutPreference(customization.layoutPreference || 'standard');
      setSectionsOrder(customization.sectionsOrder || [
        'about', 'projects', 'skills', 'experience', 'education', 'blogs', 'contact'
      ]);
      setSectionsVisibility(customization.sectionsVisibility || {
        about: true,
        projects: true,
        skills: true,
        experience: true,
        education: true,
        blogs: true,
        contact: true
      });
    }
  }, [customization]);

  // Update parent component when any customization option changes
  useEffect(() => {
    const updatedCustomization = {
      themeColor,
      accentColor,
      fontPreference,
      layoutPreference,
      sectionsOrder,
      sectionsVisibility
    };
    
    onChange(updatedCustomization);
  }, [themeColor, accentColor, fontPreference, layoutPreference, sectionsOrder, sectionsVisibility, onChange]);

  // Handle section visibility toggle
  const handleSectionVisibilityChange = (section: string, isVisible: boolean) => {
    setSectionsVisibility({
      ...sectionsVisibility,
      [section]: isVisible
    });
  };

  // Handle section order change
  const moveSectionUp = (sectionIndex: number) => {
    if (sectionIndex <= 0) return;
    
    const newOrder = [...sectionsOrder];
    const temp = newOrder[sectionIndex];
    newOrder[sectionIndex] = newOrder[sectionIndex - 1];
    newOrder[sectionIndex - 1] = temp;
    
    setSectionsOrder(newOrder);
  };

  const moveSectionDown = (sectionIndex: number) => {
    if (sectionIndex >= sectionsOrder.length - 1) return;
    
    const newOrder = [...sectionsOrder];
    const temp = newOrder[sectionIndex];
    newOrder[sectionIndex] = newOrder[sectionIndex + 1];
    newOrder[sectionIndex + 1] = temp;
    
    setSectionsOrder(newOrder);
  };

  // Get section name for display
  const getSectionName = (sectionKey: string): string => {
    const sectionNames: Record<string, string> = {
      about: 'About Me',
      projects: 'Projects',
      skills: 'Skills',
      experience: 'Experience',
      education: 'Education',
      blogs: 'Blog Posts',
      contact: 'Contact Information'
    };
    
    return sectionNames[sectionKey] || sectionKey;
  };

  // Handle color change
  const handleColorChange = (e: ChangeEvent<HTMLInputElement>, colorType: 'theme' | 'accent') => {
    if (colorType === 'theme') {
      setThemeColor(e.target.value);
    } else {
      setAccentColor(e.target.value);
    }
  };

  return (
    <Card>
      <Heading level={3}>Customize Your Showcase</Heading>
      <Text>Personalize the appearance and layout of your showcase.</Text>
      <Divider marginBlock={tokens.space.medium} />
      
      <Tabs>
        <Tabs.Item title="Theme & Colors" value="theme">
          <Card variation="outlined" padding={tokens.space.medium} marginBottom={tokens.space.medium}>
            <Heading level={4}>Theme Colors</Heading>
            <Text>Choose the primary colors for your showcase.</Text>
            <Divider marginBlock={tokens.space.small} />
            
            <Flex direction="column" gap={tokens.space.medium}>
              <Flex direction="column" gap={tokens.space.small}>
                <Text>Primary Theme Color</Text>
                <Flex alignItems="center" gap={tokens.space.medium}>
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => handleColorChange(e, 'theme')}
                    style={{ width: '50px', height: '40px' }}
                  />
                  <View 
                    backgroundColor={themeColor} 
                    width="100px" 
                    height="30px" 
                    borderRadius={tokens.radii.small}
                  />
                  <Text>{themeColor}</Text>
                </Flex>
              </Flex>
              
              <Flex direction="column" gap={tokens.space.small}>
                <Text>Accent Color</Text>
                <Flex alignItems="center" gap={tokens.space.medium}>
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => handleColorChange(e, 'accent')}
                    style={{ width: '50px', height: '40px' }}
                  />
                  <View 
                    backgroundColor={accentColor} 
                    width="100px" 
                    height="30px" 
                    borderRadius={tokens.radii.small}
                  />
                  <Text>{accentColor}</Text>
                </Flex>
              </Flex>
            </Flex>
          </Card>
          
          <Card variation="outlined" padding={tokens.space.medium}>
            <Heading level={4}>Typography</Heading>
            <Text>Select font styles for your showcase.</Text>
            <Divider marginBlock={tokens.space.small} />
            
            <SelectField
              label="Font Style"
              value={fontPreference}
              onChange={(e) => setFontPreference(e.target.value)}
            >
              <option value="system">System Default</option>
              <option value="serif">Serif</option>
              <option value="sans-serif">Sans-Serif</option>
              <option value="monospace">Monospace</option>
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
              <option value="playful">Playful</option>
            </SelectField>
            
            <Flex direction="column" marginTop={tokens.space.medium}>
              <Text fontWeight="bold">Preview:</Text>
              <View 
                padding={tokens.space.medium} 
                backgroundColor={tokens.colors.background.secondary}
                borderRadius={tokens.radii.small}
              >
                <Heading level={5} fontFamily={fontPreference === 'system' ? 'inherit' : fontPreference}>
                  Heading Example
                </Heading>
                <Text fontFamily={fontPreference === 'system' ? 'inherit' : fontPreference}>
                  This is how your text will appear with the selected font style.
                </Text>
              </View>
            </Flex>
          </Card>
        </Tabs.Item>
        
        <Tabs.Item title="Layout" value="layout">
          <Card variation="outlined" padding={tokens.space.medium} marginBottom={tokens.space.medium}>
            <Heading level={4}>Layout Style</Heading>
            <Text>Choose how your showcase content is arranged.</Text>
            <Divider marginBlock={tokens.space.small} />
            
            <RadioGroupField
              legend="Layout Style"
              name="layoutStyle"
              value={layoutPreference}
              onChange={(e) => setLayoutPreference(e.target.value)}
            >
              <Radio value="standard">Standard (Header + Sections)</Radio>
              <Radio value="portfolio">Portfolio (Project-focused)</Radio>
              <Radio value="resume">Resume Style</Radio>
              <Radio value="minimal">Minimal</Radio>
              <Radio value="creative">Creative</Radio>
            </RadioGroupField>
            
            <Flex marginTop={tokens.space.medium}>
              <View 
                padding={tokens.space.medium} 
                backgroundColor={tokens.colors.background.secondary}
                borderRadius={tokens.radii.small}
                width="100%"
              >
                <Text fontWeight="bold">Layout Preview:</Text>
                <Flex 
                  direction="column" 
                  gap={tokens.space.small} 
                  marginTop={tokens.space.small}
                  padding={tokens.space.small}
                  backgroundColor={tokens.colors.background.primary}
                  borderRadius={tokens.radii.small}
                >
                  {layoutPreference === 'standard' && (
                    <>
                      <View height="30px" backgroundColor={themeColor} borderRadius={tokens.radii.small} />
                      <Flex gap={tokens.space.small}>
                        <View flex="2" height="200px" backgroundColor={tokens.colors.background.tertiary} borderRadius={tokens.radii.small} />
                        <View flex="1" height="200px" backgroundColor={tokens.colors.background.tertiary} borderRadius={tokens.radii.small} />
                      </Flex>
                      <View height="100px" backgroundColor={tokens.colors.background.tertiary} borderRadius={tokens.radii.small} />
                    </>
                  )}
                  
                  {layoutPreference === 'portfolio' && (
                    <>
                      <View height="30px" backgroundColor={themeColor} borderRadius={tokens.radii.small} />
                      <Flex wrap="wrap" gap={tokens.space.small}>
                        <View width="calc(33% - 8px)" height="100px" backgroundColor={tokens.colors.background.tertiary} borderRadius={tokens.radii.small} />
                        <View width="calc(33% - 8px)" height="100px" backgroundColor={tokens.colors.background.tertiary} borderRadius={tokens.radii.small} />
                        <View width="calc(33% - 8px)" height="100px" backgroundColor={tokens.colors.background.tertiary} borderRadius={tokens.radii.small} />
                        <View width="calc(50% - 8px)" height="100px" backgroundColor={tokens.colors.background.tertiary} borderRadius={tokens.radii.small} />
                        <View width="calc(50% - 8px)" height="100px" backgroundColor={tokens.colors.background.tertiary} borderRadius={tokens.radii.small} />
                      </Flex>
                      <View height="50px" backgroundColor={tokens.colors.background.tertiary} borderRadius={tokens.radii.small} />
                    </>
                  )}
                  
                  {layoutPreference === 'resume' && (
                    <Flex gap={tokens.space.small}>
                      <View width="30%" height="300px" backgroundColor={themeColor} borderRadius={tokens.radii.small} />
                      <Flex direction="column" gap={tokens.space.small} flex="1">
                        <View height="50px" backgroundColor={tokens.colors.background.tertiary} borderRadius={tokens.radii.small} />
                        <View height="80px" backgroundColor={tokens.colors.background.tertiary} borderRadius={tokens.radii.small} />
                        <View height="80px" backgroundColor={tokens.colors.background.tertiary} borderRadius={tokens.radii.small} />
                        <View height="80px" backgroundColor={tokens.colors.background.tertiary} borderRadius={tokens.radii.small} />
                      </Flex>
                    </Flex>
                  )}
                  
                  {layoutPreference === 'minimal' && (
                    <>
                      <View height="50px" backgroundColor={themeColor} borderRadius={tokens.radii.small} />
                      <View height="250px" backgroundColor={tokens.colors.background.tertiary} borderRadius={tokens.radii.small} />
                    </>
                  )}
                  
                  {layoutPreference === 'creative' && (
                    <>
                      <Flex gap={tokens.space.small}>
                        <View width="40%" height="300px" backgroundColor={themeColor} borderRadius={tokens.radii.small} />
                        <Flex direction="column" gap={tokens.space.small} flex="1">
                          <View height="100px" backgroundColor={accentColor} borderRadius={tokens.radii.small} />
                          <View height="195px" backgroundColor={tokens.colors.background.tertiary} borderRadius={tokens.radii.small} />
                        </Flex>
                      </Flex>
                    </>
                  )}
                </Flex>
              </View>
            </Flex>
          </Card>
        </Tabs.Item>
        
        <Tabs.Item title="Sections" value="sections">
          <Card variation="outlined" padding={tokens.space.medium}>
            <Heading level={4}>Section Visibility & Order</Heading>
            <Text>Choose which sections to display and their order.</Text>
            <Divider marginBlock={tokens.space.small} />
            
            <Flex direction="column" gap={tokens.space.medium}>
              {sectionsOrder.map((section, index) => (
                <Card key={section} variation="outlined" padding={tokens.space.small}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Flex alignItems="center" gap={tokens.space.medium}>
                      <Text fontWeight="bold">{index + 1}.</Text>
                      <Text>{getSectionName(section)}</Text>
                    </Flex>
                    
                    <Flex gap={tokens.space.small}>
                      <Button
                        size="small"
                        variation="link"
                        onClick={() => moveSectionUp(index)}
                        isDisabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        size="small"
                        variation="link"
                        onClick={() => moveSectionDown(index)}
                        isDisabled={index === sectionsOrder.length - 1}
                      >
                        ↓
                      </Button>
                      <SwitchField
                        label="Show"
                        labelPosition="start"
                        isChecked={sectionsVisibility[section as keyof typeof sectionsVisibility]}
                        onChange={(e) => handleSectionVisibilityChange(section, e.target.checked)}
                      />
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </Flex>
          </Card>
        </Tabs.Item>
      </Tabs>
    </Card>
  );
};

export default CustomizationOptions; 