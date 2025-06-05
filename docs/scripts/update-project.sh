#!/bin/bash

# ============================================================
# HAT Dynamic Template Update Script
# ============================================================
# This script checks for updates to dependencies and tools
# used in the HAT Dynamic Template project.
# ============================================================

# ===================== CONFIGURATION =====================

# Tools to check for updates
TOOLS=("nodejs" "npm" "eleventy" "nunjucks" "tailwindcss" "storybook" "decap-cms")

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ===================== UTILITY FUNCTIONS =====================

# Function to display error messages
function error_message {
    echo -e "${RED}ERROR: $1${NC}" 1>&2
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

# Function to display section headers
function section_header {
    echo -e "${BLUE}===== $1 =====${NC}"
}

# ===================== NETLIFY UPDATES =====================

# Function to get Netlify latest updates
function get_netlify_updates() {
    local temp_file=$(mktemp)
    
    section_header "NETLIFY UPDATES"
    
    # Fetch latest releases from Netlify's GitHub repository
    info_message "Fetching latest Netlify releases..."
    curl -s "https://api.github.com/repos/netlify/netlify/releases" > "$temp_file"
    
    # Check if curl was successful
    if [ ! -s "$temp_file" ]; then
        error_message "Could not retrieve Netlify updates."
        return 1
    fi

    # Extract release information using standard Unix tools
    info_message "Latest Netlify updates:"
    
    # Extract first 3 releases, using sed and grep to parse JSON-like structure
    releases_count=0
    while IFS= read -r line; do
        if [[ "$line" =~ \"name\":\ \"([^\"]+)\" ]]; then
            name="${BASH_REMATCH[1]}"
            releases_count=$((releases_count + 1))
            
            # Find corresponding published date
            read -r date_line
            if [[ "$date_line" =~ \"published_at\":\ \"([^\"]+)\" ]]; then
                date="${BASH_REMATCH[1]}"
                
                # Find description (truncated)
                read -r desc_line
                if [[ "$desc_line" =~ \"body\":\ \"([^\"]{0,200}) ]]; then
                    desc="${BASH_REMATCH[1]}..."
                    
                    # Print formatted update
                    echo -e "- ${YELLOW}$name${NC} (${GREEN}${date:0:10}${NC}): $desc"
                fi
            fi
        fi
        
        # Stop after 3 releases
        if [ $releases_count -ge 3 ]; then
            break
        fi
    done < <(grep -E '"name"|"published_at"|"body"' "$temp_file")

    # Clean up temporary file
    rm "$temp_file"
    
    # Additional Netlify resources
    echo
    info_message "Netlify Resources:"
    echo -e "- Documentation: https://docs.netlify.com/"
    echo -e "- Blog: https://www.netlify.com/blog/"
    echo -e "- Changelog: https://github.com/netlify/netlify/releases"
}

# ===================== VERSION CHECKING =====================

# Function to get current and latest versions
function check_version() {
    local tool=$1
    local current_version=""
    local latest_version=""

    case $tool in
        "nodejs")
            current_version=$(node --version 2>/dev/null)
            latest_version=$(curl -s https://nodejs.org/dist/index.json | head -n 1 | sed -n 's/.*"version": "\([^"]*\)".*/\1/p')
            ;;
        "npm")
            current_version=$(npm --version 2>/dev/null)
            latest_version=$(npm view npm version)
            ;;
        "eleventy")
            current_version=$(npx @11ty/eleventy --version 2>/dev/null)
            latest_version=$(npm view @11ty/eleventy version)
            ;;
        "nunjucks")
            current_version=$(npm list nunjucks | grep nunjucks@ | head -n 1 | sed 's/.*@//')
            latest_version=$(npm view nunjucks version)
            ;;
        "tailwindcss")
            current_version=$(npm list tailwindcss | grep tailwindcss@ | head -n 1 | sed 's/.*@//')
            latest_version=$(npm view tailwindcss version)
            ;;
        "storybook")
            current_version=$(npx sb --version 2>/dev/null)
            latest_version=$(npm view @storybook/cli version)
            ;;
        "decap-cms")
            current_version=$(npm list decap-cms-app | grep decap-cms-app@ | head -n 1 | sed 's/.*@//')
            latest_version=$(npm view decap-cms-app version)
            ;;
        *)
            error_message "Unrecognized tool: $tool"
            return 1
            ;;
    esac

    echo "$current_version|$latest_version"
}

# ===================== DOCUMENTATION =====================

# Function to open documentation
function open_documentation() {
    local tool=$1
    local docs=""

    case $tool in
        "nodejs")
            docs="https://nodejs.org/en/download/"
            ;;
        "npm")
            docs="https://docs.npmjs.com/updating-npm"
            ;;
        "eleventy")
            docs="https://www.11ty.dev/docs/upgrade/"
            ;;
        "nunjucks")
            docs="https://mozilla.github.io/nunjucks/getting-started.html"
            ;;
        "tailwindcss")
            docs="https://tailwindcss.com/blog/tailwindcss-v4-alpha"
            ;;
        "storybook")
            docs="https://storybook.js.org/docs/migration/migration-guide"
            ;;
        "decap-cms")
            docs="https://decapcms.org/docs/upgrading/"
            ;;
    esac

    info_message "Recommended documentation: $docs"
    read -p "Would you like to open the documentation in your default browser? (y/n) " open_doc
    if [[ "$open_doc" == "y" || "$open_doc" == "Y" ]]; then
        xdg-open "$docs" 2>/dev/null || open "$docs" 2>/dev/null || start "$docs" 2>/dev/null
    fi
}

# ===================== UPDATE TOOLS =====================

# Function to update a tool
function update_tool() {
    local tool=$1
    local update_command=""

    case $tool in
        "nodejs")
            warning_message "Please use nvm or download from nodejs.org"
            return 1
            ;;
        "npm")
            update_command="npm install -g npm@latest"
            ;;
        "eleventy")
            update_command="npm install @11ty/eleventy@latest --save-dev"
            ;;
        "nunjucks")
            update_command="npm install nunjucks@latest --save-dev"
            ;;
        "tailwindcss")
            update_command="npm install tailwindcss@latest postcss autoprefixer --save-dev"
            ;;
        "storybook")
            update_command="npx storybook@latest upgrade"
            ;;
        "decap-cms")
            update_command="npm install decap-cms-app@latest --save-dev"
            ;;
        *)
            error_message "Update not supported for this tool"
            return 1
            ;;
    esac

    warning_message "Update command: $update_command"
    read -p "Do you want to proceed with the update? (y/n) " confirm
    if [[ "$confirm" == "y" || "$confirm" == "Y" ]]; then
        echo -e "${CYAN}Executing update command...${NC}"
        eval "$update_command"
        if [ $? -eq 0 ]; then
            success_message "Update successful!"
        else
            error_message "Update failed."
        fi
    fi
}

# ===================== MAIN FUNCTION =====================

# Main function to execute the script
function main() {
    # Display script title
    section_header "HAT DYNAMIC TEMPLATE UPDATE CHECKER"
    info_message "This script will check for updates to all tools and dependencies."
    echo
    
    section_header "CHECKING TOOL VERSIONS"

    # Check versions of each tool
    for tool in "${TOOLS[@]}"; do
        # Get versions
        info_message "Checking $tool..."
        version_info=$(check_version "$tool")
        
        # Skip if tool not found
        if [ $? -ne 0 ]; then
            warning_message "Could not check $tool. Make sure it's installed."
            continue
        }
        
        # Split version info
        IFS='|' read -r current_version latest_version <<< "$version_info"

        # Print version comparison
        echo
        warning_message "$tool"
        success_message "Current version: $current_version"
        success_message "Latest version: $latest_version"

        # Compare versions
        if [ "$current_version" != "$latest_version" ]; then
            warning_message "A new version is available!"
            
            # Ask about documentation
            open_documentation "$tool"

            # Ask about update
            read -p "Would you like to update this tool? (y/n) " update_check
            if [[ "$update_check" == "y" || "$update_check" == "Y" ]]; then
                update_tool "$tool"
            fi
        else
            success_message "You are up to date."
        fi
        
        echo
    done

    # Get Netlify updates
    get_netlify_updates
    
    section_header "UPDATE CHECK COMPLETED"
    success_message "All tools have been checked for updates."
}

# Execute main function
main