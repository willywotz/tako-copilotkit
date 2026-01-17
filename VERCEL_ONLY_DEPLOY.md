# Deploy Tako Research Canvas to Vercel (Full Stack)

This guide shows you how to deploy the entire Tako Research Canvas application to Vercel - both frontend and backend.

## Overview

We'll deploy:
1. **Frontend** → Vercel static hosting
2. **Agent Server** → Vercel Serverless Function (Node.js runtime)

Everything runs on Vercel!

## Prerequisites

- Vercel account (free): https://vercel.com/signup
- GitHub account
- OpenAI API key (with credits)
- Tako API token

## Step 1: Prepare Repository

First, push your code to GitHub:

```bash
cd /Users/robertabbott/Desktop/tako-copilotkit

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - Tako Research Canvas"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/tako-research-canvas.git
git push -u origin main
```

## Step 2: Create Vercel Configuration

Create `vercel.json` in the root directory:

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build && cd ../agents && npm install --legacy-peer-deps && npm run build",
  "outputDirectory": "frontend/dist",
  "framework": null,
  "rewrites": [
    {
      "source": "/api/copilotkit",
      "destination": "/api/copilotkit-handler.js"
    },
    {
      "source": "/(.*)",
      "destination": "/frontend/dist/$1"
    }
  ],
  "functions": {
    "api/copilotkit-handler.js": {
      "runtime": "nodejs18.x",
      "maxDuration": 60
    }
  }
}
```

## Step 3: Create Serverless Function Handler

Create `api/copilotkit-handler.js` in the root:

```javascript
// api/copilotkit-handler.js
const { graph } = require('../agents/dist/agent.js');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await graph.invoke(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Agent error:', error);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
```

## Step 4: Update Frontend Environment Variable

The frontend needs to know where the agent server is. Since everything is on Vercel, update the build:

Create `frontend/.env.production`:

```env
VITE_AGENT_URL=/api/copilotkit
```

This makes the frontend call the same domain (Vercel) for the agent API.

## Step 5: Deploy to Vercel

### Option A: Vercel Dashboard (Recommended for first time)

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repo
4. Configure:
   - **Framework Preset**: Other (we have custom config)
   - **Root Directory**: Leave blank (we use vercel.json)
   - **Build Command**: (leave default, vercel.json handles it)
   - **Output Directory**: frontend/dist

5. **Add Environment Variables**:
   Click "Environment Variables" and add:

   ```
   OPENAI_API_KEY = sk-your-actual-key-here
   TAKO_API_TOKEN = your-tako-token-here
   TAKO_API_BASE = http://localhost:3000/api/mcp
   USE_LOCAL_AGENT = true
   ```

6. Click **Deploy**

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? tako-research-canvas
# - Directory? ./ (root)
# - Override settings? No

# Set environment variables
vercel env add OPENAI_API_KEY
# Paste your OpenAI key when prompted

vercel env add TAKO_API_TOKEN
# Paste your Tako token

vercel env add TAKO_API_BASE
# Enter: http://localhost:3000/api/mcp

vercel env add USE_LOCAL_AGENT
# Enter: true

# Deploy to production
vercel --prod
```

## Step 6: Verify Deployment

After deployment, Vercel will give you a URL like:
```
https://tako-research-canvas.vercel.app
```

Test it:
1. Visit the URL
2. Enter a research question
3. Ask the AI to generate a report
4. Check that charts load

## Troubleshooting

### Build Fails

**Error**: "Module not found"
- Check that both `frontend/package.json` and `agents/package.json` exist
- Verify `vercel.json` buildCommand is correct

**Error**: "Build timeout"
- Upgrade to Vercel Pro for longer build times
- Or optimize build by pre-compiling agents locally

### Serverless Function Timeout

**Error**: "Function exceeded maximum duration"
- Free tier: 10 seconds max
- Pro tier: 60 seconds max
- Upgrade to Pro for longer agent processing

**Solution**: Optimize the agent:
- Use `gpt-3.5-turbo` instead of `gpt-4o` for faster responses
- Reduce number of charts searched (edit `agents/src/search.ts`)

### Agent Not Responding

**Check logs**:
1. Go to Vercel Dashboard
2. Select your project
3. Click "Functions" tab
4. Click on `/api/copilotkit-handler`
5. View logs

**Common issues**:
- Environment variables not set
- OpenAI API key invalid or no credits
- CORS issues (check headers in handler)

### Frontend Can't Connect to Agent

**Error in browser console**: "Failed to fetch"

**Solution**:
- Check that `VITE_AGENT_URL=/api/copilotkit` in `frontend/.env.production`
- Rebuild and redeploy: `vercel --prod`

## Alternative: Simplified Structure

If you have issues with the complex setup, here's a simpler approach using Next.js:

### Convert to Next.js (Optional)

1. Create a new Next.js app:
```bash
npx create-next-app@latest tako-research-nextjs --typescript --tailwind --app
```

2. Move components:
```bash
cp -r frontend/src/components tako-research-nextjs/src/
cp -r frontend/src/lib tako-research-nextjs/src/
```

3. Create API route:
```bash
# tako-research-nextjs/src/app/api/copilotkit/route.ts
import { graph } from '../../../agents/agent';

export async function POST(req: Request) {
  const body = await req.json();
  const result = await graph.invoke(body);
  return Response.json(result);
}
```

4. Deploy:
```bash
cd tako-research-nextjs
vercel
```

This gives you a cleaner Next.js structure that Vercel handles natively.

## Cost Estimates

### Vercel Pricing

**Hobby (Free)**:
- 100GB bandwidth/month
- Unlimited sites
- 10 second function timeout
- Good for: Testing, personal projects

**Pro ($20/month)**:
- 1TB bandwidth/month
- 60 second function timeout
- Custom domains
- Good for: Production apps

### OpenAI API Costs

With GPT-4:
- ~$0.03-0.10 per research report
- Depends on length and number of charts

With GPT-3.5-turbo:
- ~$0.001-0.01 per research report
- Faster and cheaper

## Optimization Tips

### Reduce Costs

1. **Use GPT-3.5-turbo** for development:
```typescript
// agents/src/chat.ts
const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",  // Instead of gpt-4o
  temperature: 0.7,
});
```

2. **Cache agent responses**:
Add Redis caching for repeated queries (advanced)

3. **Limit chart searches**:
```typescript
// agents/src/search.ts
const results = await searchTakoCharts(question, 2);  // Instead of 5
```

### Improve Performance

1. **Precompile agent**:
```bash
cd agents
npm run build
# Commit dist/ to git
```

2. **Use edge functions** (Vercel Edge):
Convert to edge-compatible code for faster cold starts

3. **Enable caching**:
Add cache headers to static assets

## Monitoring

### View Logs

Vercel Dashboard → Your Project → Functions → View Invocations

### Add Analytics

1. Enable Vercel Analytics in dashboard
2. Add error tracking (Sentry):
```bash
npm install @sentry/nextjs
```

### Monitor OpenAI Usage

Check usage at: https://platform.openai.com/usage

## Custom Domain (Optional)

1. Buy domain (Namecheap, Google Domains, etc.)
2. Vercel Dashboard → Your Project → Settings → Domains
3. Add domain and follow DNS instructions
4. SSL automatically configured

## Rollback

If something breaks:

1. Vercel Dashboard → Your Project → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

## Next Steps

After successful deployment:

- [ ] Test with real research queries
- [ ] Set up monitoring/alerts
- [ ] Add custom domain
- [ ] Configure analytics
- [ ] Set up CI/CD for automatic deployments
- [ ] Add error tracking (Sentry)
- [ ] Optimize agent performance
- [ ] Add rate limiting for production

## Getting Help

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: support@vercel.com (Pro plans)
- **Vercel Community**: https://github.com/vercel/vercel/discussions

---

**You're now deployed! 🎉**
