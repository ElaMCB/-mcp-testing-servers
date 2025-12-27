#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { chromium, firefox, webkit, Browser, BrowserContext, Page } from 'playwright';
import * as fs from 'fs/promises';
import * as path from 'path';

interface BrowserSession {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  id: string;
  createdAt: Date;
}

class PlaywrightMCPServer {
  private server: Server;
  private sessions: Map<string, BrowserSession> = new Map();
  private sessionCounter = 0;

  constructor() {
    this.server = new Server(
      {
        name: 'playwright-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'launch_browser',
          description:
            'Launch a browser instance and navigate to a URL. Returns a session ID for subsequent operations.',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'The URL to navigate to',
              },
              headless: {
                type: 'boolean',
                description: 'Whether to run in headless mode (default: true)',
                default: true,
              },
              browser: {
                type: 'string',
                enum: ['chromium', 'firefox', 'webkit'],
                description: 'Browser to use (default: chromium)',
                default: 'chromium',
              },
            },
            required: ['url'],
          },
        },
        {
          name: 'get_page_content',
          description:
            'Get the current page DOM content, title, URL, and other metadata.',
          inputSchema: {
            type: 'object',
            properties: {
              session_id: {
                type: 'string',
                description: 'The browser session ID',
              },
            },
            required: ['session_id'],
          },
        },
        {
          name: 'perform_action',
          description:
            'Perform an action on a page element (click, fill, select, etc.)',
          inputSchema: {
            type: 'object',
            properties: {
              session_id: {
                type: 'string',
                description: 'The browser session ID',
              },
              action: {
                type: 'string',
                enum: ['click', 'fill', 'select', 'check', 'uncheck', 'hover', 'press'],
                description: 'The action to perform',
              },
              selector: {
                type: 'string',
                description: 'CSS selector or text to locate the element',
              },
              value: {
                type: 'string',
                description: 'Value for fill/select actions',
              },
              key: {
                type: 'string',
                description: 'Key to press for press action',
              },
            },
            required: ['session_id', 'action', 'selector'],
          },
        },
        {
          name: 'execute_test_script',
          description:
            'Execute Playwright code in the current browser context. Useful for complex interactions.',
          inputSchema: {
            type: 'object',
            properties: {
              session_id: {
                type: 'string',
                description: 'The browser session ID',
              },
              code: {
                type: 'string',
                description: 'JavaScript code to execute in the browser context',
              },
            },
            required: ['session_id', 'code'],
          },
        },
        {
          name: 'capture_screenshot',
          description:
            'Capture a screenshot of the current page. Returns base64 encoded image.',
          inputSchema: {
            type: 'object',
            properties: {
              session_id: {
                type: 'string',
                description: 'The browser session ID',
              },
              fullPage: {
                type: 'boolean',
                description: 'Whether to capture the full page (default: false)',
                default: false,
              },
            },
            required: ['session_id'],
          },
        },
        {
          name: 'run_test_file',
          description:
            'Execute a Playwright test file and return the results.',
          inputSchema: {
            type: 'object',
            properties: {
              file_path: {
                type: 'string',
                description: 'Path to the Playwright test file',
              },
            },
            required: ['file_path'],
          },
        },
        {
          name: 'close_session',
          description: 'Close a browser session and clean up resources.',
          inputSchema: {
            type: 'object',
            properties: {
              session_id: {
                type: 'string',
                description: 'The browser session ID to close',
              },
            },
            required: ['session_id'],
          },
        },
        {
          name: 'list_sessions',
          description: 'List all active browser sessions.',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'launch_browser':
            return await this.handleLaunchBrowser(args as any);
          case 'get_page_content':
            return await this.handleGetPageContent(args as any);
          case 'perform_action':
            return await this.handlePerformAction(args as any);
          case 'execute_test_script':
            return await this.handleExecuteTestScript(args as any);
          case 'capture_screenshot':
            return await this.handleCaptureScreenshot(args as any);
          case 'run_test_file':
            return await this.handleRunTestFile(args as any);
          case 'close_session':
            return await this.handleCloseSession(args as any);
          case 'list_sessions':
            return await this.handleListSessions();
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async handleLaunchBrowser(args: {
    url: string;
    headless?: boolean;
    browser?: 'chromium' | 'firefox' | 'webkit';
  }): Promise<{ content: Array<{ type: string; text: string }> }> {
    const { url, headless = true, browser = 'chromium' } = args;

    const browserType =
      browser === 'firefox'
        ? firefox
        : browser === 'webkit'
          ? webkit
          : chromium;

    const browserInstance = await browserType.launch({ headless });
    const context = await browserInstance.newContext({
      viewport: { width: 1280, height: 720 },
    });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });

    const sessionId = `session_${++this.sessionCounter}_${Date.now()}`;
    this.sessions.set(sessionId, {
      browser: browserInstance,
      context,
      page,
      id: sessionId,
      createdAt: new Date(),
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              session_id: sessionId,
              url: page.url(),
              title: await page.title(),
              status: 'success',
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private getSession(sessionId: string): BrowserSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    return session;
  }

  private async handleGetPageContent(args: {
    session_id: string;
  }): Promise<{ content: Array<{ type: string; text: string }> }> {
    const session = this.getSession(args.session_id);
    const { page } = session;

    const content = await page.content();
    const title = await page.title();
    const url = page.url();
    const viewport = page.viewportSize();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              url,
              title,
              viewport,
              html: content.substring(0, 50000), // Limit HTML size
              timestamp: new Date().toISOString(),
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private async handlePerformAction(args: {
    session_id: string;
    action: string;
    selector: string;
    value?: string;
    key?: string;
  }): Promise<{ content: Array<{ type: string; text: string }> }> {
    const session = this.getSession(args.session_id);
    const { page } = session;
    const { action, selector, value, key } = args;

    let result: any = { success: true };

    switch (action) {
      case 'click':
        await page.click(selector);
        result.message = `Clicked element: ${selector}`;
        break;
      case 'fill':
        if (!value) throw new Error('Value is required for fill action');
        await page.fill(selector, value);
        result.message = `Filled ${selector} with: ${value}`;
        break;
      case 'select':
        if (!value) throw new Error('Value is required for select action');
        await page.selectOption(selector, value);
        result.message = `Selected ${value} in ${selector}`;
        break;
      case 'check':
        await page.check(selector);
        result.message = `Checked ${selector}`;
        break;
      case 'uncheck':
        await page.uncheck(selector);
        result.message = `Unchecked ${selector}`;
        break;
      case 'hover':
        await page.hover(selector);
        result.message = `Hovered over ${selector}`;
        break;
      case 'press':
        if (!key) throw new Error('Key is required for press action');
        await page.press(selector, key);
        result.message = `Pressed ${key} on ${selector}`;
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Wait for any navigation or network activity
    await page.waitForTimeout(500);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleExecuteTestScript(args: {
    session_id: string;
    code: string;
  }): Promise<{ content: Array<{ type: string; text: string }> }> {
    const session = this.getSession(args.session_id);
    const { page } = session;

    try {
      const result = await page.evaluate((code) => {
        // eslint-disable-next-line no-eval
        return eval(code);
      }, args.code);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                result: result,
              },
              null,
            2
            ),
          },
        ],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: false,
                error: errorMessage,
              },
              null,
            2
            ),
          },
        ],
      };
    }
  }

  private async handleCaptureScreenshot(args: {
    session_id: string;
    fullPage?: boolean;
  }): Promise<{ content: Array<{ type: string; text: string }> }> {
    const session = this.getSession(args.session_id);
    const { page } = session;
    const { fullPage = false } = args;

    const screenshot = await page.screenshot({
      fullPage,
      type: 'png',
    });

    const base64 = screenshot.toString('base64');

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              success: true,
              screenshot: `data:image/png;base64,${base64}`,
              fullPage,
              timestamp: new Date().toISOString(),
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private async handleRunTestFile(args: {
    file_path: string;
  }): Promise<{ content: Array<{ type: string; text: string }> }> {
    const { file_path } = args;

    // Check if file exists
    try {
      await fs.access(file_path);
    } catch {
      throw new Error(`Test file not found: ${file_path}`);
    }

    // This is a simplified implementation
    // In production, you'd want to use Playwright's test runner
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              success: true,
              message:
                'Test file execution requires Playwright test runner. Use `npx playwright test` for full test execution.',
              file_path,
              note: 'This tool is a placeholder. For full test execution, use Playwright CLI.',
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private async handleCloseSession(args: {
    session_id: string;
  }): Promise<{ content: Array<{ type: string; text: string }> }> {
    const session = this.getSession(args.session_id);

    await session.page.close();
    await session.context.close();
    await session.browser.close();

    this.sessions.delete(args.session_id);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              success: true,
              message: `Session ${args.session_id} closed successfully`,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private async handleListSessions(): Promise<{
    content: Array<{ type: string; text: string }>;
  }> {
    const sessionsList = Array.from(this.sessions.values()).map((session) => ({
      session_id: session.id,
      url: session.page.url(),
      createdAt: session.createdAt.toISOString(),
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              sessions: sessionsList,
              count: sessionsList.length,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Playwright MCP server running on stdio');
  }
}

// Start the server if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new PlaywrightMCPServer();
  server.run().catch(console.error);
}

export { PlaywrightMCPServer };

