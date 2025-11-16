# Helmet Customizer - Claude Code Instructions

## API Keys

This project uses the Kernel API for AI-powered features. The API key is stored in `.env`:

```
KERNEL_API_KEY="sk_0496009e-4e79-48fe-afc1-39cf34696d19.Sh412COsZ0sQMsZvTpsuHqK52np0OZ1JAtMKVhTpkgc"
```

## Instructions for Implementing Web App Features

### Using Kernel API

When implementing features that require AI capabilities:

1. **Import the API key** from environment variables:
   ```javascript
   // Node.js / Next.js
   const KERNEL_API_KEY = process.env.KERNEL_API_KEY;

   // Client-side (use NEXT_PUBLIC_ prefix for Next.js)
   const KERNEL_API_KEY = process.env.NEXT_PUBLIC_KERNEL_API_KEY;
   ```

2. **Always validate** the API key exists before making requests:
   ```javascript
   if (!KERNEL_API_KEY) {
     throw new Error('KERNEL_API_KEY is not configured in .env');
   }
   ```

3. **Never expose** API keys in client-side code. Use server-side API routes or backend endpoints.

4. **Use environment variables** for all sensitive configuration:
   - Create `.env.local` for local development overrides
   - Add `.env*.local` to `.gitignore`
   - Use platform-specific environment variable management for production

### Best Practices

- Keep API keys in `.env` and never commit them to version control
- Use server-side API routes to proxy requests and keep keys secure
- Implement proper error handling for API failures
- Add rate limiting and caching where appropriate
- Document any new environment variables in this file

### Required Environment Setup

Before running the application, ensure:
1. `.env` file exists in project root
2. All required API keys are configured
3. Dependencies are installed: `pnpm install`

## Development Workflow

When Claude implements new features:
- Always check `.env` for available API keys first
- Request any missing API keys before implementation
- Validate and analyze requirements before agreeing to changes
- Test API integrations thoroughly
