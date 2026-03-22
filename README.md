<div align="center">
  <img src="grg-logo.png" width="200">
</div>


<h1 align="center">
⭐ <i>Github README Generator</i> • CLI Tool For Generating Structured GitHub README Files
</h1>


> A CLI-based tool that automates documentation for my personal portfolio projects. It collects project data via prompts, injects it into my structured project.js file, and generates polished README files for individual or all projects, including automatic ranking and consistent formatting.


---

## 📸 Showcase
### Batch README Generation
<div align="center">
  <img src="batch-generation.gif" width="100%" alt="Batch generation of README files"/>
</div>

### Interactive Single Project Generation
<div align="center">
  <img src="single-project.gif" width="100%" alt="Interactive single project README generation"/>
</div>

### Usage
```bash
# Generate READMEs for all projects
node scripts/generate-readmes.js

# Create README for a single project interactively
node scripts/createProject.js


## 🔷 Project Overview
<table align="center">
<tr><td>Type</td><td>Personal Project</td></tr>
<tr><td>My Role</td><td>Full-Stack</td></tr>
<tr><td>Platform</td><td>CLI</td></tr>
<tr><td>Duration</td><td>Mar 13 - Mar 17</td></tr>
<tr><td>Status</td><td>Completed</td></tr>
<tr><td>Version</td><td>1.0.0</td></tr>
</table>


## ⚙️ Tech Stack & Tools

<table align="center">
  <tr>
    <td><strong>Runtime</strong></td>
    <td><strong>Tools</strong></td>
  </tr>
  <tr>
    <td>
      &nbsp;&nbsp;<img src="https://najialjarwan.vercel.app/external-icons/nodejs.svg" height="40" title="Node JS" />
    </td>
    <td>
      <img src="https://najialjarwan.vercel.app/external-icons/vscode.svg" height="40" title="VS Code" />
      <img src="https://najialjarwan.vercel.app/external-icons/git.svg" height="40" title="Git" />
    </td>
  </tr>
</table>


## 💡 Problem / Motivation

Maintaining consistent README files for my portfolio existing and new projects was repetitive and error-prone. I created this tool to automate documentation for my personal workflow. While it’s tailored to my data structure and project organization, it reflects my focus on automation, clean architecture, and developer-focused tooling.


## ✨ Key Features

- Interactive CLI workflow to collect project data and inject it into project.js (source of truth)
- Automatic project ranking and ordering when inserting new projects
- Generates README files directly in project folders for single projects
- Batch generation for all projects using project.js as source
- Custom formatting engine to handle nested objects, arrays, and maintain consistent markdown
- Separation of concerns: data collection, data storage, and README generation
- Scalable architecture for adding templates, sections, badges, and other formatting options


## 🚀 Future Improvements

- Add multiple README templates (minimal, detailed, portfolio-focused)
- Support Markdown preview before file generation
- Export configurations for reuse across multiple projects
- Add support for badges, images, and dynamic sections (e.g., shields.io)
- Build a web-based UI version for non-CLI users


## 🎨 Credits & Inspirations

- Built and designed fully independently
- Inspired by the need for structured documentation and reusable workflows


## 📝 Notes

- This project reflects a shift toward building developer tools rather than just applications.
- Focus was placed on code structure, scalability, and maintainability rather than UI.
- Serves as a foundation for future tooling and automation-focused of my personal projects.


---


<p align="center">
  <em>This README was automatically generated using a custom README generator</em> ✨
</p>
