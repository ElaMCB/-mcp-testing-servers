/**
 * Example: Basic Playwright MCP Server Usage
 *
 * This example demonstrates how to use the Playwright MCP server
 * programmatically (though typically you'd use it through an MCP client).
 */
// Note: In practice, you'd use an MCP client library to interact with the server.
// This is just for demonstration purposes.
export const exampleWorkflow = {
    // Step 1: Launch browser
    launch: {
        url: 'https://example.com',
        headless: false,
        browser: 'chromium',
    },
    // Step 2: Get page content
    inspect: {
        session_id: 'session_1',
    },
    // Step 3: Perform actions
    actions: [
        {
            session_id: 'session_1',
            action: 'fill',
            selector: '#email',
            value: 'user@example.com',
        },
        {
            session_id: 'session_1',
            action: 'fill',
            selector: '#password',
            value: 'password123',
        },
        {
            session_id: 'session_1',
            action: 'click',
            selector: 'button[type="submit"]',
        },
    ],
    // Step 4: Capture evidence
    screenshot: {
        session_id: 'session_1',
        fullPage: true,
    },
    // Step 5: Clean up
    close: {
        session_id: 'session_1',
    },
};
/**
 * Example: Testing a login flow
 */
export const loginTestExample = {
    description: 'Test login functionality',
    steps: [
        'Launch browser to login page',
        'Fill in email and password',
        'Click submit button',
        'Verify redirect to dashboard',
        'Capture screenshot as evidence',
        'Close session',
    ],
};
/**
 * Example: Form validation testing
 */
export const formValidationExample = {
    description: 'Test form validation',
    steps: [
        'Launch browser to form page',
        'Try submitting empty form',
        'Verify error messages appear',
        'Fill form with invalid data',
        'Verify validation messages',
        'Fill form with valid data',
        'Verify successful submission',
    ],
};
//# sourceMappingURL=basic-usage.js.map