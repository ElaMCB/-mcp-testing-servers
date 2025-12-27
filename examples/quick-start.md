# Quick Start Guide

This guide will help you get started with the Playwright MCP server in just 5 minutes.

## Prerequisites

- Node.js 18+ installed
- An MCP-compatible IDE (Cursor, VS Code with MCP extension, or GitHub Codespaces)

## Step 1: Install Dependencies

```bash
npm install
npx playwright install chromium
```

## Step 2: Build the Project

```bash
npm run build
```

## Step 3: Configure Your IDE

### For Cursor

Add to your Cursor settings (Settings → MCP Servers):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": ["./dist/servers/playwright/server.js"],
      "env": {
        "PLAYWRIGHT_BROWSERS_PATH": "0"
      }
    }
  }
}
```

### For VS Code

The configuration is already in `.vscode/settings.json` if you're using the MCP extension.

## Step 4: Test It Out

Try these prompts in your AI assistant:

1. **"Launch a browser and navigate to https://example.com"**
   - The agent will use `launch_browser` tool

2. **"Take a screenshot of the current page"**
   - The agent will use `capture_screenshot` tool

3. **"Get the page content and show me the title"**
   - The agent will use `get_page_content` tool

## Example Workflow

Here's a complete example of what your AI agent can do:

```
You: "Test the login form on https://example.com/login"

Agent will:
1. Launch browser → https://example.com/login
2. Get page content → Understand the form structure
3. Fill email field → user@example.com
4. Fill password field → password123
5. Click submit button
6. Capture screenshot → Verify success
7. Report results
```

## Troubleshooting

### Browser doesn't launch
- Make sure Playwright browsers are installed: `npx playwright install chromium`
- Check that `PLAYWRIGHT_BROWSERS_PATH` is set correctly

### MCP server not found
- Verify the build completed: `npm run build`
- Check the path in your IDE configuration matches `dist/servers/playwright/server.js`

### Permission errors
- On Linux, you may need: `sudo npx playwright install-deps`

## Next Steps

- Read the [full documentation](../README.md)
- Check out [example projects](./examples/)
- Join our [Discussions](https://github.com/ElaMCB/mcp-testing-servers/discussions)

