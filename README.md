#  MCP Testing Servers

**Collection of Model Context Protocol (MCP) servers for software testing tools and quality assurance**

[![MCP Protocol](https://img.shields.io/badge/MCP-Protocol-blue)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org/)

> **Enables agentic testing in MCP-native IDEs** like Cursor and GitHub Codespaces. Transform your AI assistant into an intelligent testing agent that can create, execute, and maintain tests autonomously.

##  What Are MCP Testing Servers?

Model Context Protocol (MCP) servers bridge AI agents with testing tools. Instead of manually writing test scripts, your AI assistant can:

- **Execute Playwright tests** in real-time
- **Generate test cases** based on application state
- **Debug failures** by inspecting DOM and logs
- **File bugs** in Jira/ADO directly from test results
- **Self-heal tests** when UI changes break selectors

Read our [research paper](https://elamcb.github.io/research/notebooks/mcp-software-testing.html) on MCP in software testing.

##  Quick Start

### Prerequisites

- Node.js 16+
- An MCP-native IDE (Cursor, Codespaces, or compatible)
- Testing framework installed (Playwright, Selenium, etc.)

### Installation

```bash
# Clone the repository
git clone https://github.com/ElaMCB/mcp-testing-servers.git
cd mcp-testing-servers

# Install dependencies
npm install

# Install Playwright (for Playwright MCP server)
npm install playwright
```

### Configure in Your IDE

**For Cursor:**
1. Open Settings → MCP Servers
2. Add a new server configuration
3. Example for Playwright server:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": ["./servers/playwright/server.js"],
      "env": {
        "PLAYWRIGHT_BROWSERS_PATH": "0"
      }
    }
  }
}
```

**For GitHub Codespaces:**
Add to `.vscode/settings.json`:

```json
{
  "mcp.servers": {
    "playwright": {
      "command": "node",
      "args": ["./servers/playwright/server.js"]
    }
  }
}
```

## Available MCP Servers

###  Playwright Server

**Purpose:** Browser automation and end-to-end testing

**Tools:**
- `launch_browser(url)` - Launch browser and navigate to URL
- `get_page_content(session_id)` - Get current page DOM and state
- `perform_action(session_id, action, selector)` - Click, fill, select elements
- `execute_test_script(session_id, code)` - Run Playwright code in live context
- `capture_screenshot(session_id)` - Take screenshots for debugging
- `run_test_file(file_path)` - Execute a Playwright test file

**Example Usage:**
```javascript
// Your AI agent can now:
// 1. Launch browser: launch_browser("https://app.example.com")
// 2. Inspect page: get_page_content(session_id)
// 3. Perform actions: perform_action(session_id, "click", "#login-button")
// 4. Generate tests based on actual UI structure
```

### Selenium Server

**Purpose:** Cross-browser Selenium automation

**Tools:**
- `create_driver(browser)` - Create WebDriver instance
- `navigate_to(url)` - Navigate to URL
- `find_elements(selector)` - Locate page elements
- `execute_script(js_code)` - Run JavaScript in browser context

###  Jira Server

**Purpose:** Autonomous bug filing and issue management

**Tools:**
- `create_issue(title, description, type)` - Create Jira issue
- `search_issues(jql_query)` - Search using JQL
- `add_comment(issue_key, comment)` - Add comment to issue
- `link_issues(issue_key_1, issue_key_2)` - Link related issues
- `update_issue(issue_key, fields)` - Update issue fields

**Setup:**
```bash
export JIRA_URL="https://your-org.atlassian.net"
export JIRA_EMAIL="your-email@example.com"
export JIRA_API_TOKEN="your-api-token"
```

###  Azure DevOps (ADO) Server

**Purpose:** Work item management and build integration

**Tools:**
- `create_bug(title, description, project)` - Create bug work item
- `get_test_runs(project_id)` - Retrieve test run results
- `get_latest_build(definition_id)` - Get latest build status
- `link_work_items(work_item_id_1, work_item_id_2)` - Link work items
- `update_work_item(id, fields)` - Update work item fields

**Setup:**
```bash
export AZURE_DEVOPS_ORG="your-org"
export AZURE_DEVOPS_PROJECT="your-project"
export AZURE_DEVOPS_PAT="your-personal-access-token"
```

### Test Results Server

**Purpose:** Aggregate and analyze test execution results

**Tools:**
- `get_test_results(suite, time_range)` - Retrieve test results
- `analyze_test_coverage(coverage_file)` - Analyze code coverage
- `compare_test_runs(run_id_1, run_id_2)` - Compare two test runs
- `get_failing_tests(suite)` - List currently failing tests

###  Cypress Server

**Purpose:** Cypress end-to-end testing integration

**Tools:**
- `run_cypress_test(spec_file)` - Execute Cypress test
- `open_cypress()` - Open Cypress Test Runner
- `get_cypress_results()` - Get latest test run results

###  API Testing Server

**Purpose:** REST API testing and validation

**Tools:**
- `make_api_request(method, url, headers, body)` - Execute API calls
- `validate_api_response(response, schema)` - Validate against JSON schema
- `run_api_test_suite(suite_file)` - Run collection of API tests

##  Agentic Testing Workflows

### Pattern 1: Contextual Test Generation

Your AI agent in the IDE can now:

1. **Detect code changes** via MCP file system resources
2. **Analyze related test files** to understand patterns
3. **Explore application UI** using Playwright MCP server
4. **Generate tests** directly into your project
5. **Execute and validate** automatically

**Example Prompt:**
```
"Write a test for the new login feature I just added to login.js"
```

The agent will:
- Read `login.js` to understand the feature
- Check existing test patterns in your project
- Launch browser and explore the login UI
- Generate contextually appropriate Playwright test
- Write it to the correct test file

### Pattern 2: Autonomous Regression Testing

```
"Run the regression suite and file bugs for any failures"
```

The agent will:
1. Execute all Playwright tests
2. On failure: capture screenshots, inspect DOM, check logs
3. Search Jira for duplicate issues
4. Create new bug with detailed reproduction steps
5. Update test code if selector changes (self-heal)

### Pattern 3: Intelligent Test Maintenance

```
"Audit my test suite and fix any broken tests"
```

The agent will:
1. Analyze test files for flaky tests and outdated selectors
2. Validate selectors against current application state
3. Automatically refactor or remove obsolete tests
4. Create PR with improvements

##  Architecture

```
┌─────────────────────────────────────────────────────────┐
│         MCP-Native IDE (Cursor, Codespaces, etc.)        │
│  ┌───────────────────────────────────────────────────┐  │
│  │         AI Agent (Native MCP Client)               │  │
│  │                                                    │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │  │
│  │  │ Playwright│  │  Jira    │  │   ADO    │         │  │
│  │  │MCP Server│  │MCP Server│  │MCP Server│  ...    │  │
│  │  └──────────┘  └──────────┘  └──────────┘         │  │
│  │       │            │            │                   │  │
│  │       └────────────┴────────────┘                   │  │
│  │              (Native MCP Protocol)                  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

##  Usage Examples

### Basic Playwright Workflow

```javascript
// Your AI agent uses these tools automatically, but here's what happens:

// 1. Launch browser
const session = await mcp.callTool('playwright', 'launch_browser', {
  url: 'https://app.example.com'
});

// 2. Get page content
const content = await mcp.callTool('playwright', 'get_page_content', {
  session_id: session.id
});

// 3. Perform actions
await mcp.callTool('playwright', 'perform_action', {
  session_id: session.id,
  action: 'fill',
  selector: '#email',
  value: 'user@example.com'
});

// 4. Capture evidence
const screenshot = await mcp.callTool('playwright', 'capture_screenshot', {
  session_id: session.id
});
```

### Autonomous Bug Filing

```javascript
// After a test failure, agent automatically:

// 1. Capture failure evidence
const screenshot = await playwright.capture_screenshot();
const pageState = await playwright.get_page_content();

// 2. Check for duplicates
const duplicates = await jira.search_issues(
  `summary ~ "Login button not clickable" AND status != Closed`
);

// 3. Create bug if no duplicate
if (duplicates.length === 0) {
  await jira.create_issue({
    title: 'Login button not clickable on /login page',
    description: `Test failed at ${new Date()}\n\nScreenshot: ${screenshot}\n\nPage state: ${JSON.stringify(pageState)}`,
    type: 'Bug',
    priority: 'High'
  });
}
```

##  Security Best Practices

1. **Credentials Management:**
   - Never commit API keys or tokens
   - Use environment variables or IDE secrets
   - Rotate credentials regularly

2. **Permission Scoping:**
   - Grant MCP servers minimum required permissions
   - Use read-only credentials when possible
   - Audit MCP tool usage logs

3. **Network Security:**
   - Run MCP servers on localhost in development
   - Use TLS for remote MCP servers
   - Restrict network access in CI/CD

4. **Test Data Isolation:**
   - Use separate test environments
   - Clean up test data after runs
   - Never access production data

## Testing the Servers

```bash
# Run all server tests
npm test

# Test specific server
npm test -- playwright
npm test -- jira
npm test -- azure-devops

# Run with coverage
npm run test:coverage
```

##  Documentation

- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [Research Paper: MCP in Software Testing](https://elamcb.github.io/research/notebooks/mcp-software-testing.html)
- [Playwright Documentation](https://playwright.dev)
- [Jira REST API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [Azure DevOps REST API](https://learn.microsoft.com/en-us/rest/api/azure/devops/)

##  Contributing

We welcome contributions! This is foundational infrastructure for agentic testing.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-mcp-server`)
3. Implement your MCP server following the existing patterns
4. Add tests and documentation
5. Submit a pull request

### Adding a New MCP Server

1. Create directory: `servers/your-server/`
2. Implement server following MCP protocol
3. Export `ToolsMCPServer` class
4. Add tests in `servers/your-server/__tests__/`
5. Document tools in README

##  Roadmap

- [x] Playwright MCP Server
- [x] Jira MCP Server
- [x] Azure DevOps MCP Server
- [ ] Selenium MCP Server
- [ ] Cypress MCP Server
- [ ] API Testing MCP Server
- [ ] Test Results Aggregator Server
- [ ] Performance Testing Server
- [ ] Security Scanning Server
- [ ] Database Testing Server

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

##  Author

**Ela MCB** - AI-First Quality Engineer

- Portfolio: [https://elamcb.github.io](https://elamcb.github.io)
- Research: [https://elamcb.github.io/research](https://elamcb.github.io/research)
- GitHub: [https://github.com/ElaMCB](https://github.com/ElaMCB)

## Acknowledgments

- [Anthropic](https://anthropic.com) for the Model Context Protocol
- [Playwright Team](https://playwright.dev) for excellent browser automation
- [Atlassian](https://atlassian.com) and [Microsoft](https://microsoft.com) for API access

---

**Transform your IDE into an intelligent testing agent.** 

**Built for the age of agentic testing.** 

