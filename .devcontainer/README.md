# GitHub Codespaces Setup

This repository includes a pre-configured GitHub Codespaces environment that allows you to:

1. **Try MCP servers instantly** - No local setup required
2. **Test in a consistent environment** - Same setup for everyone
3. **Collaborate easily** - Share Codespaces with team members

## Quick Start

1. Click "Code" → "Codespaces" → "Create codespace on main"
2. Wait for the environment to build (takes ~2 minutes)
3. The Playwright MCP server is ready to use!

## What's Included

- Node.js 20.x
- TypeScript
- Playwright with Chromium
- ESLint and Prettier
- VS Code extensions for MCP development

## Using MCP Servers in Codespaces

The MCP servers are automatically available in the Codespaces environment. You can:

1. Build the project: `npm run build`
2. Run tests: `npm test`
3. Start a server: `npm run start:playwright`

## Configuration

MCP server configuration is in `.vscode/settings.json` and is automatically loaded in Codespaces.

