#!/bin/bash

# ============================================================
# HAT Dynamic Template Installation Script
# ============================================================
# This script clones the HAT Dynamic Template repository and
# installs all necessary dependencies for a complete project.
# ============================================================

# Configuration variables
REPO_URL="https://github.com/theHat13/dynamic-template.git"
PROJECT_DIR="hat-dynamic-template"
NODE_VERSION_MIN="18"
NODE_VERSION_RECOMMENDED="20"
NEED_SUDO=false

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Display script title
echo -e "${BLUE}=================================================================${NC}"
echo -e "${BLUE}           HAT Dynamic Template Installation - Start            ${NC}"
echo -e "${BLUE}=================================================================${NC}"

# ===================== UTILITY FUNCTIONS =====================

# Function to display error messages and exit
function error_exit {
    echo -e "${RED}ERROR: $1${NC}" 1>&2
    exit 1
}

# Function to display success messages
function success_message {
    echo -e "${GREEN}$1${NC}"
}

# Function to display warning messages
function warning_message {
    echo -e "${YELLOW}$1${NC}"
}

# Function to display info messages
function info_message {
    echo -e "${CYAN}$1${NC}"
}

# Function to run commands with sudo if needed
function run_with_sudo_if_needed {
    if [ "$NEED_SUDO" = true ]; then
        sudo "$@"
    else
        "$@"
    fi
}

# Function to check and handle package manager
function check_package_manager {
    if [[ "$OS" == "macOS" ]]; then
        if ! command -v brew &>/dev/null; then
            warning_message "Homebrew not found. Installing..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" || error_exit "Could not install Homebrew."
            success_message "Homebrew installed successfully."
        else
            success_message "Homebrew is already installed."
        fi
    elif [[ "$OS" == "Linux" ]]; then
        # Check specific Linux distribution
        if command -v apt-get &>/dev/null; then
            PKG_MANAGER="apt-get"
            PKG_UPDATE="apt-get update"
            PKG_INSTALL="apt-get install -y"
        elif command -v dnf &>/dev/null; then
            PKG_MANAGER="dnf"
            PKG_UPDATE="dnf check-update"
            PKG_INSTALL="dnf install -y"
        elif command -v yum &>/dev/null; then
            PKG_MANAGER="yum"
            PKG_UPDATE="yum check-update"
            PKG_INSTALL="yum install -y"
        elif command -v pacman &>/dev/null; then
            PKG_MANAGER="pacman"
            PKG_UPDATE="pacman -Sy"
            PKG_INSTALL="pacman -S --noconfirm"
        else
            warning_message "Could not identify Linux package manager. You may need to install dependencies manually."
            PKG_MANAGER="unknown"
        fi
        
        if [[ "$PKG_MANAGER" != "unknown" ]]; then
            success_message "Package manager $PKG_MANAGER detected."
            # Update package repositories if we can do it without sudo
            if [ "$NEED_SUDO" = false ]; then
                warning_message "Updating packages..."
                eval "$PKG_UPDATE" || warning_message "Could not update packages. Continuing anyway..."
            else
                warning_message "Skipping system package updates (requires sudo)."
            fi
        fi
    fi
}

# ===================== PERMISSION CHECKS =====================

# Check if we're running as root
if [[ $EUID -eq 0 ]]; then
    warning_message "Running as root. Will adjust permissions at the end."
    RUNNING_AS_ROOT=true
else
    RUNNING_AS_ROOT=false
    # Check if we need sudo for some operations
    if ! touch /usr/local/test_sudo_needed 2>/dev/null; then
        warning_message "Some operations may require administrative privileges."
        warning_message "You may be prompted for your password."
        NEED_SUDO=true
    else
        rm /usr/local/test_sudo_needed
    fi
fi

# ===================== PREREQUISITE CHECKS ====================

# Function to check version compatibility
check_version_compatibility() {
    local tool_name="$1"
    local current_version="$2"
    local min_version="$3"
    local recommended_version="$4"

    # Compare versions
    local is_compatible=$(printf '%s\n%s\n' "$min_version" "$current_version" | sort -V | head -n1)

    if [ "$is_compatible" != "$min_version" ]; then
        echo -e "${RED}ERROR: Incompatible $tool_name version${NC}"
        echo -e "${YELLOW}Current version: $current_version${NC}"
        echo -e "${YELLOW}Minimum required version: $min_version${NC}"
        echo -e "${CYAN}Recommended version: $recommended_version${NC}"
        
        case "$tool_name" in
            "Node.js")
                echo -e "${BLUE}Installation instructions:${NC}"
                echo "- macOS: Use Homebrew (brew install node)"
                echo "- Linux: Use nvm (Node Version Manager)"
                echo
                echo "Recommended installation methods:"
                echo "1. nvm (Node Version Manager): https://github.com/nvm-sh/nvm"
                echo "2. Official Node.js downloads: https://nodejs.org/"
                ;;
            "npm")
                echo -e "${BLUE}Update npm:${NC}"
                echo "Run: npm install -g npm@latest"
                ;;
            "Git")
                echo -e "${BLUE}Installation instructions:${NC}"
                echo "- macOS: brew install git"
                echo "- Linux: sudo apt-get install git (Debian/Ubuntu)"
                ;;
        esac
        
        exit 1
    else
        success_message "$tool_name version $current_version is compatible"
    fi
}

# Prerequisite check function
check_prerequisites() {
    # Check Git
    if ! command -v git &>/dev/null; then
        echo -e "${RED}ERROR: Git is not installed${NC}"
        echo -e "${BLUE}Installation instructions:${NC}"
        echo "- macOS: Use Homebrew (brew install git)"
        echo "- Linux: Use package manager (apt-get install git, dnf install git)"
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &>/dev/null; then
        echo -e "${RED}ERROR: Node.js is not installed${NC}"
        echo -e "${BLUE}Installation instructions:${NC}"
        echo "1. Use Node Version Manager (nvm): https://github.com/nvm-sh/nvm"
        echo "2. Download from official Node.js website: https://nodejs.org/"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &>/dev/null; then
        echo -e "${RED}ERROR: npm is not installed${NC}"
        echo -e "${BLUE}Installation instructions:${NC}"
        echo "npm typically comes bundled with Node.js"
        echo "1. Reinstall Node.js from: https://nodejs.org/"
        echo "2. If Node.js is installed, try: npm install -g npm@latest"
        exit 1
    fi

    # Get versions
    local git_version=$(git --version | awk '{print $3}')
    local node_version=$(node -v | cut -d 'v' -f 2)
    local npm_version=$(npm -v)

    # Check versions
    check_version_compatibility "Git" "$git_version" "2.25.0" "2.40.0"
    check_version_compatibility "Node.js" "$node_version" "18.0.0" "20.0.0"
    check_version_compatibility "npm" "$npm_version" "9.0.0" "10.0.0"
}

# Run the prerequisites check
check_prerequisites

# ===================== ENVIRONMENT DETECTION =====================

section_header "DETECTING ENVIRONMENT"

# Detect operating system
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
    warning_message "macOS system detected"
    # Check if Homebrew is installed
    if ! command -v brew &>/dev/null; then
        warning_message "Homebrew not found. Installing..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" || error_exit "Could not install Homebrew."
        success_message "Homebrew installed successfully."
    else
        success_message "Homebrew is already installed."
    fi
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
    warning_message "Linux system detected"
    # Update packages - only if we can without sudo
    if [ "$NEED_SUDO" = false ]; then
        warning_message "Updating packages..."
        apt-get update || warning_message "Could not update packages. Continuing anyway."
    else
        warning_message "Skipping system package updates (requires sudo)."
    fi
else
    OS="Other"
    warning_message "Unrecognized operating system. Installation might not work correctly."
fi

# ===================== DEPENDENCY CHECKS AND INSTALLATION =====================

# Check for Git installation
if ! command -v git &>/dev/null; then
    warning_message "Git not found. Installing..."
    
    if [[ "$OS" == "macOS" ]]; then
        brew install git || error_exit "Could not install Git via Homebrew."
    elif [[ "$OS" == "Linux" ]]; then
        run_with_sudo_if_needed $PKG_INSTALL git || error_exit "Could not install Git."
    elif [[ "$OS" == "Windows" ]]; then
        error_exit "Git is not installed. Please install it manually from https://git-scm.com/download/win"
    else
        error_exit "Could not install Git. Please install it manually."
    fi
    
    success_message "Git installed successfully."
else
    GIT_VERSION=$(git --version)
    success_message "Git is already installed: $GIT_VERSION"
fi

# Check for Node.js installation
if ! command -v node &>/dev/null; then
    warning_message "Node.js not found. Installing..."
    
    if [[ "$OS" == "macOS" ]]; then
        brew install node || error_exit "Could not install Node.js via Homebrew."
    elif [[ "$OS" == "Linux" ]]; then
        # Install Node.js using nvm instead of system packages
        warning_message "Installing nvm (Node Version Manager)..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # Load nvm
        
        nvm install ${NODE_VERSION_RECOMMENDED} || error_exit "Could not install Node.js via nvm."
        nvm use ${NODE_VERSION_RECOMMENDED} || error_exit "Could not use Node.js ${NODE_VERSION_RECOMMENDED}."
        
        # Add to shell config to make it persist
        if [ -f "$HOME/.bashrc" ] && ! grep -q "export NVM_DIR" "$HOME/.bashrc"; then
            echo 'export NVM_DIR="$HOME/.nvm"' >> "$HOME/.bashrc"
            echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> "$HOME/.bashrc"
        elif [ -f "$HOME/.zshrc" ] && ! grep -q "export NVM_DIR" "$HOME/.zshrc"; then
            echo 'export NVM_DIR="$HOME/.nvm"' >> "$HOME/.zshrc"
            echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> "$HOME/.zshrc"
        fi
    elif [[ "$OS" == "Windows" ]]; then
        error_exit "Node.js is not installed. Please install it manually from https://nodejs.org/"
    else
        error_exit "Could not install Node.js. Please install it manually."
    fi
    
    success_message "Node.js installed successfully."
else
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
    
    if [[ $NODE_VERSION -lt $NODE_VERSION_MIN ]]; then
        warning_message "Node.js version ($NODE_VERSION) is too old. Version $NODE_VERSION_MIN or higher required."
        warning_message "Attempting to install Node.js $NODE_VERSION_RECOMMENDED..."
        
        if [[ "$OS" == "macOS" ]]; then
            brew install node || error_exit "Could not install Node.js via Homebrew."
        elif [[ "$OS" == "Linux" ]]; then
            # Install Node.js using nvm
            warning_message "Installing nvm (Node Version Manager)..."
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
            export NVM_DIR="$HOME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # Load nvm
            
            nvm install ${NODE_VERSION_RECOMMENDED} || error_exit "Could not install Node.js via nvm."
            nvm use ${NODE_VERSION_RECOMMENDED} || error_exit "Could not use Node.js ${NODE_VERSION_RECOMMENDED}."
            
            # Add to shell config to make it persist
            if [ -f "$HOME/.bashrc" ] && ! grep -q "export NVM_DIR" "$HOME/.bashrc"; then
                echo 'export NVM_DIR="$HOME/.nvm"' >> "$HOME/.bashrc"
                echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> "$HOME/.bashrc"
            elif [ -f "$HOME/.zshrc" ] && ! grep -q "export NVM_DIR" "$HOME/.zshrc"; then
                echo 'export NVM_DIR="$HOME/.nvm"' >> "$HOME/.zshrc"
                echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> "$HOME/.zshrc"
            fi
        else
            error_exit "Please update Node.js manually to version $NODE_VERSION_RECOMMENDED or higher."
        fi
        
        success_message "Node.js updated successfully."
    elif [[ $NODE_VERSION -lt $NODE_VERSION_RECOMMENDED ]]; then
        warning_message "Node.js version $NODE_VERSION detected. Version $NODE_VERSION_RECOMMENDED is recommended."
        warning_message "Continuing with current version, but consider upgrading for better compatibility."
    else
        success_message "Node.js version $NODE_VERSION is installed (recommended: $NODE_VERSION_RECOMMENDED+)."
    fi
fi

# Update npm to latest version with fallback for compatibility issues
warning_message "Attempting to update npm to latest version..."

if npm install -g npm@latest; then
    NPM_VERSION=$(npm --version)
    success_message "npm updated to latest version successfully: $NPM_VERSION"
else
    warning_message "Could not update to latest npm. Trying compatible version..."
    NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
    
    if [[ $NODE_VERSION -eq 18 ]]; then
        npm install -g npm@9.8.1 || error_exit "Could not update npm. Please try manually: npm install -g npm@9.8.1"
        success_message "npm updated to version 9.8.1 (compatible with Node.js 18)."
    elif [[ $NODE_VERSION -eq 20 ]]; then
        npm install -g npm@10.2.4 || error_exit "Could not update npm. Please try manually: npm install -g npm@10.2.4"
        success_message "npm updated to version 10.2.4 (compatible with Node.js 20)."
    else
        npm install -g npm@9.8.1 || error_exit "Could not update npm. Please try manually: npm install -g npm@9.8.1"
        success_message "npm updated to a compatible version."
    fi
fi

# ===================== PROJECT SETUP =====================

# Clone GitHub repository
warning_message "Cloning GitHub repository..."

# Ask for project name
read -p "Enter project name (press Enter to use '$PROJECT_DIR'): " custom_project_dir
if [ -n "$custom_project_dir" ]; then
    PROJECT_DIR="$custom_project_dir"
fi

# Check if directory already exists
if [ -d "$PROJECT_DIR" ]; then
    warning_message "Directory $PROJECT_DIR already exists. Using alternative name."
    PROJECT_DIR="${PROJECT_DIR}-$(date +%Y%m%d%H%M%S)"
fi

# Clone repository
git clone "$REPO_URL" "$PROJECT_DIR" || error_exit "Error cloning repository."
success_message "Repository cloned successfully into $PROJECT_DIR folder."

# Navigate to project directory
cd "$PROJECT_DIR" || error_exit "Error navigating to project directory."

# ===================== DEPENDENCY INSTALLATION =====================

# Install npm dependencies
warning_message "Installing npm dependencies..."
npm install || error_exit "Error installing dependencies."
success_message "Dependencies installed successfully."

# Install TailwindCSS and CLI explicitly
warning_message "Installing TailwindCSS and CLI..."
if npm install tailwindcss@latest postcss autoprefixer --save-dev; then
    success_message "TailwindCSS and dependencies installed successfully."
    # Get TailwindCSS version
    TAILWIND_VERSION=$(npx tailwindcss --version 2>/dev/null)
    success_message "TailwindCSS version: $TAILWIND_VERSION"
else
    warning_message "Explicit TailwindCSS installation failed, but it may be included in project dependencies."
fi

# Install Eleventy globally
warning_message "Installing Eleventy globally..."
if npm install -g @11ty/eleventy@latest; then
    success_message "Eleventy installed successfully."
    # Get Eleventy version
    ELEVENTY_VERSION=$(npx eleventy --version 2>/dev/null)
    success_message "Eleventy version: $ELEVENTY_VERSION"
else
    warning_message "Global Eleventy installation failed, but the project may still work with local installation."
fi

# Install concurrently as a dev dependency
warning_message "Installing concurrently..."
if npm install --save-dev concurrently; then
    success_message "Concurrently installed successfully."
    # Get concurrently version
    CONCURRENTLY_VERSION=$(npm list concurrently | grep concurrently@ | head -n 1 | sed 's/.*@//')
    success_message "Concurrently version: $CONCURRENTLY_VERSION"
else
    warning_message "Concurrently installation failed."
fi

# Install Storybook and related dependencies
warning_message "Installing Storybook for HTML..."
npm install --save-dev @storybook/html @storybook/addon-essentials @storybook/addon-interactions @storybook/addon-a11y @storybook/addon-links @storybook/addon-viewport || warning_message "Storybook installation failed. Check package compatibility."

# Initialize Storybook
warning_message "Initializing Storybook..."
npx storybook init --builder webpack5 --use-npm || warning_message "Storybook initialization failed. You may need to run it manually later."

# Add Storybook scripts to package.json if they don't exist
if ! grep -q '"storybook":' package.json; then
    warning_message "Adding Storybook scripts to package.json..."
    # Use a temporary file for sed compatibility across platforms
    sed -i.bak 's/"scripts": {/"scripts": {\n    "storybook": "storybook dev -p 6006",\n    "build-storybook": "storybook build",/g' package.json
    rm package.json.bak
fi

# Create example Storybook story if stories directory doesn't exist
if [ ! -d "stories" ]; then
    warning_message "Creating stories directory and example story..."
    mkdir -p stories
    
    # Create a Button.stories.js example
    cat > stories/Button.stories.js << 'EOL'
export default {
  title: 'Atoms/Button',
  tags: ['autodocs'],
  render: ({ label, primary, backgroundColor, size, onClick }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerText = label;
    btn.addEventListener('click', onClick);
    
    const mode = primary ? 'btn px-5 py-2.5 rounded-lg text-sm tracking-wider font-medium border border-current outline-none whitespace-nowrap bg-black hover:bg-white text-white hover:text-black' : 'btn px-5 py-2.5 rounded-lg text-sm tracking-wider font-medium border border-current outline-none whitespace-nowrap';
    
    btn.className = ['btn', `btn--${size}`, mode].join(' ');
    
    return btn;
  },
  argTypes: {
    backgroundColor: { control: 'color' },
    label: { control: 'text' },
    onClick: { action: 'onClick' },
    primary: { control: 'boolean' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};

export const Primary = {
  args: {
    primary: true,
    label: 'Button',
    size: 'medium',
  },
};

export const Secondary = {
  args: {
    label: 'Button',
    size: 'medium',
  },
};

export const Large = {
  args: {
    primary: true,
    label: 'Button',
    size: 'large',
  },
};

export const Small = {
  args: {
    primary: true,
    label: 'Button',
    size: 'small',
  },
};
EOL
    success_message "Example Storybook story for Button component created."
fi

# Install necessary webpack loaders for Nunjucks support
warning_message "Installing Nunjucks support for Storybook..."
if npm install --save-dev simple-nunjucks-loader; then
    success_message "Nunjucks loader installed successfully."
else
    warning_message "Nunjucks loader installation failed. You may need to install it manually."
fi

# Create necessary directories if they don't exist
mkdir -p public/css

# Create TailwindCSS output file if it doesn't exist
touch public/css/output.css

# Compile TailwindCSS styles
warning_message "Compiling TailwindCSS styles..."
if npx tailwindcss -i ./src/input.css -o ./public/css/output.css; then
    success_message "TailwindCSS styles compiled successfully."
else
    warning_message "Error compiling TailwindCSS. Check the configuration."
fi

# ===================== FINALIZATION =====================

# Set proper ownership if run with sudo
if [[ $RUNNING_AS_ROOT == true ]]; then
    if [[ -n "$SUDO_USER" ]]; then
        chown -R $SUDO_USER:$(id -g $SUDO_USER) "$PROJECT_DIR"
        success_message "Changed ownership of $PROJECT_DIR to $SUDO_USER"
    else
        warning_message "Running as root but SUDO_USER is not set. Could not change ownership."
    fi
fi

# Ensure permissions are correct for the project directory
chmod -R u+w "$PROJECT_DIR"

# Setup complete
echo -e "${BLUE}=================================================================${NC}"
echo -e "${BLUE}                   HAT Dynamic Template                          ${NC}"
echo -e "${BLUE}              Setup completed successfully!                      ${NC}"
echo -e "${BLUE}=================================================================${NC}"
success_message "Project created: $PROJECT_DIR"
echo ""
success_message "Key components installed:"
success_message "✓ Node.js"
success_message "✓ npm"
success_message "✓ TailwindCSS"
success_message "✓ Eleventy"
success_message "✓ Storybook"
success_message "✓ Nunjucks support"
echo ""
success_message "Use the following commands to start:"
echo -e "${GREEN}cd $PROJECT_DIR${NC}"
echo -e "${GREEN}npm start          # Start Eleventy development server${NC}"
echo -e "${GREEN}npm run storybook  # Start Storybook development server${NC}"
echo -e "${BLUE}=================================================================${NC}"
echo -e "${GREEN}The site will be available at: ${CYAN}http://localhost:8080${NC}"
echo -e "${GREEN}Storybook will be available at: ${CYAN}http://localhost:6006${NC}"
echo -e "${BLUE}=================================================================${NC}"