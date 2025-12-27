/**
 * Example: Basic Playwright MCP Server Usage
 *
 * This example demonstrates how to use the Playwright MCP server
 * programmatically (though typically you'd use it through an MCP client).
 */
export declare const exampleWorkflow: {
    launch: {
        url: string;
        headless: boolean;
        browser: string;
    };
    inspect: {
        session_id: string;
    };
    actions: ({
        session_id: string;
        action: string;
        selector: string;
        value: string;
    } | {
        session_id: string;
        action: string;
        selector: string;
        value?: undefined;
    })[];
    screenshot: {
        session_id: string;
        fullPage: boolean;
    };
    close: {
        session_id: string;
    };
};
/**
 * Example: Testing a login flow
 */
export declare const loginTestExample: {
    description: string;
    steps: string[];
};
/**
 * Example: Form validation testing
 */
export declare const formValidationExample: {
    description: string;
    steps: string[];
};
//# sourceMappingURL=basic-usage.d.ts.map