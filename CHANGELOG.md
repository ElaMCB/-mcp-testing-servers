# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-XX

### Added
- ✅ Complete Playwright MCP Server implementation with 8 tools:
  - `launch_browser` - Launch browser instances (Chromium, Firefox, WebKit)
  - `get_page_content` - Get page DOM and metadata
  - `perform_action` - Perform UI actions (click, fill, select, etc.)
  - `execute_test_script` - Execute JavaScript in browser context
  - `capture_screenshot` - Capture page screenshots
  - `run_test_file` - Execute Playwright test files
  - `close_session` - Clean up browser sessions
  - `list_sessions` - List active browser sessions

- ✅ TypeScript build system with strict type checking
- ✅ Comprehensive test suite infrastructure (Jest)
- ✅ CI/CD pipeline with GitHub Actions (multi-OS, multi-Node versions)
- ✅ GitHub Codespaces configuration for instant setup
- ✅ ESLint configuration for code quality
- ✅ Example projects and quick-start guide
- ✅ Contributing guidelines
- ✅ Updated README with 2025 MCP spec references

### Changed
- Updated Node.js requirement from 16+ to 18+ (LTS)
- Improved documentation with status indicators and roadmap
- Enhanced README with better organization and quick-start options

### Fixed
- Browser selection logic in Playwright server (now supports Chromium, Firefox, WebKit)

## [Unreleased]

### Planned
- Jira MCP Server
- Azure DevOps MCP Server
- Selenium MCP Server
- Enhanced error handling and retry logic
- Session persistence and recovery

