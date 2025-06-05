# Hat Dynamic Template (HDT)

## 🌟 Introduction

Hat Dynamic Template is a front-end development framework designed to create modular and maintainable websites. It combines the following technologies:

- **Eleventy**: Static site generator
- **Nunjucks**: Template engine
- **TailwindCSS v4**: Utility-first CSS framework
- **Storybook**: Isolated component development
- **Decap CMS**: Content management
- **Concurrently**: Parallel command execution

### Architecture

The project follows the OMA (Organism-Molecule-Atom) architecture to ensure a clear and scalable component structure.

## 🔧 Prerequisites

- Package Manager:
  - Homebrew (macOS)
  - apt-get (Debian/Ubuntu)
  - dnf (Fedora)
  - yum (CentOS)
  - pacman (Arch Linux)

- Node.js (v20.0.0 recommended, minimum v18.0.0)
- npm (latest version)
- Git

## 🚀 Installation Options

### 1️⃣ Create a New Project Based on HAT Template

Use these scripts to set up a new project based on the HAT Dynamic Template:

#### On Linux/macOS

```sh
curl -O https://raw.githubusercontent.com/theHat13/dynamic-template/main/docs/scripts/setup-new-project.sh && chmod +x setup-new-project.sh && ./setup-new-project.sh
```

#### On Windows (PowerShell)

```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/theHat13/dynamic-template/main/docs/scripts/setup-new-project.ps1" -OutFile "setup-new-project.ps1" ; .\setup-new-project.ps1
```

### 2️⃣ Clone the HAT Template for Framework Development

If you want to work on the HAT template framework itself, use these scripts:

#### On Linux/macOS

```sh
curl -O https://raw.githubusercontent.com/theHat13/dynamic-template/main/docs/scripts/clone-hat-template.sh && chmod +x clone-hat-template.sh && ./clone-hat-template.sh
```

#### On Windows (PowerShell)

```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/theHat13/dynamic-template/main/docs/scripts/clone-hat-template.ps1" -OutFile "clone-hat-template.ps1" ; .\clone-hat-template.ps1
```

### 3️⃣ Manual Installation Process

1. **Clone the repository**

   ```sh
   git clone https://github.com/theHat13/dynamic-template.git your-project
   cd your-project
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Install Storybook and Concurrently**

   ```sh
   npm install --save-dev @storybook/html @storybook/addon-essentials concurrently
   npx storybook init --builder webpack5
   ```

## 🖥 NPM Scripts

- `npm start`: Start Eleventy development server
- `npm run storybook`: Start Storybook
- `npm run dev`: Start Eleventy and Storybook simultaneously
- `npm run build`: Compile site for production
- `npm run refresh`: Clear cache and generated files
- `npm run build-storybook`: Compile Storybook for production

## 🚢 Deployment

### Netlify

1. Connect GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `public`

The rest of the document remains the same...