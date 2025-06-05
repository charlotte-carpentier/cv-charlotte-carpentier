# ============================================================
# HAT Dynamic Template Update Script for Windows
# ============================================================
# This script checks for updates to dependencies and tools
# used in the HAT Dynamic Template project.
# ============================================================

# ===================== CONFIGURATION =====================

# Tools to check for updates
$tools = @("nodejs", "npm", "eleventy", "nunjucks", "tailwindcss", "storybook", "decap-cms")

# Console colors configuration
$colorGreen = [System.ConsoleColor]::Green
$colorYellow = [System.ConsoleColor]::Yellow
$colorRed = [System.ConsoleColor]::Red
$colorBlue = [System.ConsoleColor]::Blue
$colorCyan = [System.ConsoleColor]::Cyan
$colorDefault = [System.ConsoleColor]::White

# ===================== UTILITY FUNCTIONS =====================

# Function to display error messages
function Show-Error {
    param (
        [string]$Message
    )
    Write-Host "ERROR: $Message" -ForegroundColor $colorRed
}

# Function to display success messages
function Show-Success {
    param (
        [string]$Message
    )
    Write-Host $Message -ForegroundColor $colorGreen
}

# Function to display warning messages
function Show-Warning {
    param (
        [string]$Message
    )
    Write-Host $Message -ForegroundColor $colorYellow
}

# Function to display info messages
function Show-Info {
    param (
        [string]$Message
    )
    Write-Host $Message -ForegroundColor $colorCyan
}

# Function to display section headers
function Show-SectionHeader {
    param (
        [string]$Title
    )
    Write-Host "`n===== $Title =====" -ForegroundColor $colorBlue
}

# ===================== NETLIFY UPDATES =====================

# Function to get Netlify latest updates
function Get-NetlifyUpdates {
    Show-SectionHeader "NETLIFY UPDATES"
    
    try {
        Show-Info "Fetching latest Netlify releases..."
        $releases = Invoke-RestMethod -Uri "https://api.github.com/repos/netlify/netlify/releases" -ErrorAction Stop
        
        Show-Info "Latest Netlify updates:"
        
        for ($i = 0; $i -lt [Math]::Min(3, $releases.Count); $i++) {
            $release = $releases[$i]
            Write-Host ("- " + $release.name) -ForegroundColor $colorYellow -NoNewline
            Write-Host (" (" + (Get-Date $release.published_at -Format "yyyy-MM-dd") + "): ") -ForegroundColor $colorGreen -NoNewline
            
            # Get a preview of the release body, truncated if needed
            $bodyPreview = if ($release.body.Length -gt 200) {
                $release.body.Substring(0, 200) + "..."
            } else {
                $release.body
            }
            Write-Host $bodyPreview
        }
        
        # Additional Netlify resources
        Write-Host
        Show-Info "Netlify Resources:"
        Write-Host "- Documentation: https://docs.netlify.com/"
        Write-Host "- Blog: https://www.netlify.com/blog/"
        Write-Host "- Changelog: https://github.com/netlify/netlify/releases"
    }
    catch {
        Show-Error "Could not retrieve Netlify updates."
    }
}

# ===================== VERSION CHECKING =====================

# Function to get current and latest versions
function Get-ToolVersion {
    param(
        [string]$Tool
    )

    $currentVersion = $null
    $latestVersion = $null

    switch ($Tool) {
        "nodejs" {
            $currentVersion = (node --version 2>$null)
            try {
                $latestVersion = (Invoke-RestMethod "https://nodejs.org/dist/index.json" -ErrorAction Stop)[0].version
            }
            catch {
                Show-Error "Could not fetch latest Node.js version."
                return $null
            }
        }
        "npm" {
            $currentVersion = (npm --version 2>$null)
            try {
                $latestVersion = (npm view npm version -ErrorAction Stop)
            }
            catch {
                Show-Error "Could not fetch latest npm version."
                return $null
            }
        }
        "eleventy" {
            $currentVersion = (npx @11ty/eleventy --version 2>$null)
            try {
                $latestVersion = (npm view @11ty/eleventy version -ErrorAction Stop)
            }
            catch {
                Show-Error "Could not fetch latest Eleventy version."
                return $null
            }
        }
        "nunjucks" {
            try {
                $currentVersion = ((npm list nunjucks) -match "nunjucks@" -replace ".*@", "")
                $latestVersion = (npm view nunjucks version -ErrorAction Stop)
            }
            catch {
                Show-Error "Could not fetch latest Nunjucks version."
                return $null
            }
        }
        "tailwindcss" {
            try {
                $currentVersion = ((npm list tailwindcss) -match "tailwindcss@" -replace ".*@", "")
                $latestVersion = (npm view tailwindcss version -ErrorAction Stop)
            }
            catch {
                Show-Error "Could not fetch latest TailwindCSS version."
                return $null
            }
        }
        "storybook" {
            $currentVersion = (npx sb --version 2>$null)
            try {
                $latestVersion = (npm view @storybook/cli version -ErrorAction Stop)
            }
            catch {
                Show-Error "Could not fetch latest Storybook version."
                return $null
            }
        }
        "decap-cms" {
            try {
                $currentVersion = ((npm list decap-cms-app) -match "decap-cms-app@" -replace ".*@", "")
                $latestVersion = (npm view decap-cms-app version -ErrorAction Stop)
            }
            catch {
                Show-Error "Could not fetch latest Decap CMS version."
                return $null
            }
        }
        default {
            Show-Error "Unrecognized tool: $Tool"
            return $null
        }
    }

    return @{
        CurrentVersion = $currentVersion
        LatestVersion = $latestVersion
    }
}

# ===================== DOCUMENTATION =====================

# Function to open documentation
function Open-Documentation {
    param(
        [string]$Tool
    )

    $docs = switch ($Tool) {
        "nodejs" { "https://nodejs.org/en/download/" }
        "npm" { "https://docs.npmjs.com/updating-npm" }
        "eleventy" { "https://www.11ty.dev/docs/upgrade/" }
        "nunjucks" { "https://mozilla.github.io/nunjucks/getting-started.html" }
        "tailwindcss" { "https://tailwindcss.com/blog/tailwindcss-v4-alpha" }
        "storybook" { "https://storybook.js.org/docs/migration/migration-guide" }
        "decap-cms" { "https://decapcms.org/docs/upgrading/" }
    }

    Show-Info "Recommended documentation: $docs"
    $openDoc = Read-Host "Would you like to open the documentation in your default browser? (y/n)"
    
    if ($openDoc -eq "y" -or $openDoc -eq "Y") {
        Start-Process $docs
    }
}

# ===================== UPDATE TOOLS =====================

# Function to update a tool
function Update-Tool {
    param(
        [string]$Tool
    )

    $updateCommand = switch ($Tool) {
        "nodejs" { 
            Show-Warning "Please use nvm or download from nodejs.org" 
            return 
        }
        "npm" { "npm install -g npm@latest" }
        "eleventy" { "npm install @11ty/eleventy@latest --save-dev" }
        "nunjucks" { "npm install nunjucks@latest --save-dev" }
        "tailwindcss" { "npm install tailwindcss@latest postcss autoprefixer --save-dev" }
        "storybook" { "npx storybook@latest upgrade" }
        "decap-cms" { "npm install decap-cms-app@latest --save-dev" }
        default { 
            Show-Error "Update not supported for this tool"
            return 
        }
    }

    Show-Warning "Update command: $updateCommand"
    $confirm = Read-Host "Do you want to proceed with the update? (y/n)"
    
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        Show-Info "Executing update command..."
        try {
            Invoke-Expression $updateCommand
            Show-Success "Update successful!"
        }
        catch {
            Show-Error "Update failed. $($_.Exception.Message)"
        }
    }
}

# ===================== MAIN FUNCTION =====================

# Main function to execute the script
function Start-UpdateCheck {
    # Display script header
    Write-Host "=================================================================" -ForegroundColor $colorBlue
    Write-Host "           HAT Dynamic Template Update Checker                  " -ForegroundColor $colorBlue
    Write-Host "=================================================================" -ForegroundColor $colorBlue
    
    Show-SectionHeader "CHECKING TOOL VERSIONS"
    Show-Info "This script will check for updates to all tools and dependencies."
    Write-Host

    # Check versions of each tool
    foreach ($tool in $tools) {
        # Get versions
        Show-Info "Checking $tool..."
        $versionInfo = Get-ToolVersion -Tool $tool

        if ($versionInfo) {
            Write-Host "`n$tool" -ForegroundColor $colorYellow
            Show-Success "Current version: $($versionInfo.CurrentVersion)"
            Show-Success "Latest version: $($versionInfo.LatestVersion)"

            if ($versionInfo.CurrentVersion -ne $versionInfo.LatestVersion) {
                Show-Warning "A new version is available!"
                
                # Ask about documentation
                Open-Documentation -Tool $tool

                # Ask about update
                $updateCheck = Read-Host "Would you like to update this tool? (y/n)"
                if ($updateCheck -eq "y" -or $updateCheck -eq "Y") {
                    Update-Tool -Tool $tool
                }
            }
            else {
                Show-Success "You are up to date."
            }
            
            Write-Host
        }
    }

    # Get Netlify updates
    Get-NetlifyUpdates
    
    Show-SectionHeader "UPDATE CHECK COMPLETED"
    Show-Success "All tools have been checked for updates."
    Write-Host "=================================================================" -ForegroundColor $colorBlue
}

# ===================== SCRIPT EXECUTION =====================

# Execute the main function
Start-UpdateCheck