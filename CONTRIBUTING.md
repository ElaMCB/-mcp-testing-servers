# Contributing to MCP Testing Servers

Thank you for your interest in contributing! This project is foundational infrastructure for agentic testing, and we welcome contributions of all kinds.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/YOUR_USERNAME/mcp-testing-servers.git`
3. **Create a branch**: `git checkout -b feature/your-feature-name`
4. **Install dependencies**: `npm install`
5. **Build the project**: `npm run build`

## Development Workflow

### Adding a New MCP Server

1. Create a new directory: `src/servers/your-server/`
2. Implement the server following the MCP protocol
3. Export a server class similar to `PlaywrightMCPServer`
4. Add tests in `src/servers/your-server/__tests__/`
5. Update the README with your server's documentation
6. Add configuration examples

### Code Style

- Use TypeScript with strict mode
- Follow ESLint rules (run `npm run lint`)
- Write tests for new features
- Update documentation

### Testing

```bash
# Run all tests
npm test

# Run tests for a specific server
npm test -- playwright

# Run with coverage
npm run test:coverage
```

### Submitting Changes

1. **Write tests** for your changes
2. **Update documentation** if needed
3. **Run linting**: `npm run lint`
4. **Ensure tests pass**: `npm test`
5. **Commit your changes**: Use clear, descriptive commit messages
6. **Push to your fork**: `git push origin feature/your-feature-name`
7. **Create a Pull Request** with a clear description

## Pull Request Guidelines

- **Title**: Clear and descriptive
- **Description**: Explain what and why, not just how
- **Tests**: Include tests for new features
- **Documentation**: Update README if adding new servers or features
- **Breaking Changes**: Clearly mark any breaking changes

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

## Questions?

- Open a [GitHub Discussion](https://github.com/ElaMCB/mcp-testing-servers/discussions)
- Check existing [Issues](https://github.com/ElaMCB/mcp-testing-servers/issues)
- Review the [README](README.md) for documentation

Thank you for contributing to the future of agentic testing! 🚀

