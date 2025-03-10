# Template Integration for Student Showcases

## Overview

This document outlines how to integrate student showcase data into customizable templates to generate static HTML documents. It includes an example template compatible with the `showcase.md` data structure and instructions for creating and using custom templates.

## Template Structure

Templates are HTML files with placeholders for dynamic data. These placeholders are replaced with actual data from the student's showcase record to generate a static HTML document.

### Example Template

Below is an example template compatible with the `showcase.md` data structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{profile.first_name}} {{profile.last_name}}'s Showcase</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>{{profile.first_name}} {{profile.last_name}}</h1>
        <p>{{profile.title}}</p>
        <img src="{{profile.profile_image_url}}" alt="Profile Image">
    </header>
    <section id="about">
        <h2>About Me</h2>
        <p>{{profile.bio}}</p>
    </section>
    <section id="projects">
        <h2>Projects</h2>
        <ul>
            {% for project in projects %}
            <li>
                <h3>{{project.title}}</h3>
                <p>{{project.summary}}</p>
                <a href="{{project.github_url}}">GitHub</a>
                <a href="{{project.deployed_url}}">Live Demo</a>
            </li>
            {% endfor %}
        </ul>
    </section>
    <footer>
        <p>Contact: {{profile.contact_email}}</p>
    </footer>
</body>
</html>
```

### Placeholder Syntax

- **Double curly braces (`{{ }}`)**: Used for inserting single data fields.
- **Block tags (`{% %}`)**: Used for loops and conditional logic.

## Instructions for Creating and Using Custom Templates

1. **Create a Template**:
   - Use HTML and include placeholders for dynamic data.
   - Ensure compatibility with the `showcase.md` data structure.

2. **Inject Data**:
   - Use a templating engine (e.g., Jinja2 for Python) to replace placeholders with actual data.
   - Load the student's showcase record and pass it to the templating engine.

3. **Generate Static HTML**:
   - Render the template with the injected data to produce a static HTML file.
   - Save the generated HTML file to the desired location (e.g., S3 bucket).

4. **Preview and Publish**:
   - Use the preview functionality to view the generated HTML before publishing.
   - Once satisfied, publish the showcase to make it publicly accessible.

## Saving and Loading Templates

- **Save Templates**: Users can save their custom templates to a designated S3 bucket.
- **Load Templates**: When creating or editing a showcase, load available templates from the S3 bucket as options.

## Creating Your Own Template

1. **Design**: Start with a basic HTML structure and design the layout.
2. **Add Placeholders**: Insert placeholders where dynamic data should appear.
3. **Test**: Use sample data to test the template and ensure it renders correctly.
4. **Save**: Once finalized, save the template to the S3 bucket for future use.

This document will be updated as the template integration process evolves. 