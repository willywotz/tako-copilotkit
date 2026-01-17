# Deploying Tako Research Canvas to Vercel

This guide covers deploying the Tako Research Canvas application to production using Vercel.

## Architecture Overview

The application has two components that need deployment:

1. **Frontend** (React + Vite) → Vercel (easy)
2. **Agent Server** (LangGraph + Express) → Multiple options:
   - Vercel Serverless Functions (Node.js runtime)
   - Railway / Render (free tier available)
   - LangGraph Cloud (official LangGraph hosting)

## Option 1: Full Vercel Deployment (Recommended for Simplicity)

Deploy both frontend and agent to Vercel.

### Step 1: Prepare the Repository

```bash
# Make sure everything is committed
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### Step 2: Deploy Frontend to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   ```
   VITE_AGENT_URL=https://your-project-name.vercel.app/api/copilotkit
   ```
   (Update after deploying the agent)

5. Click "Deploy"

### Step 3: Deploy Agent as Vercel Serverless Function

Create `api/copilotkit.js` in the root:

```javascript
// api/copilotkit.js
import { graph } from '../agents/dist/agent.js';

export default async function handler(req, res) {
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
    res.status(500).json({ error: error.message });
  }
}
```

Add to `vercel.json` in root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "agents/package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/copilotkit",
      "dest": "/api/copilotkit.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ],
  "env": {
    "OPENAI_API_KEY": "@openai-api-key",
    "TAKO_API_TOKEN": "@tako-api-token",
    "TAKO_API_BASE": "https://your-tako-api.com/api/mcp"
  }
}
```

### Step 4: Add Environment Secrets

In Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add:
   - `OPENAI_API_KEY` (your OpenAI key)
   - `TAKO_API_TOKEN` (your Tako token)
   - `TAKO_API_BASE` (Tako API URL)

### Step 5: Redeploy

```bash
vercel --prod
```

---

## Option 2: Vercel Frontend + Railway Backend (Recommended for Production)

This separates concerns and gives you better control over the agent server.

### Step 1: Deploy Agent to Railway

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - **Root Directory**: `agents`
   - **Build Command**: `npm install --legacy-peer-deps && npm run build`
   - **Start Command**: `npm start`

5. Add Environment Variables:
   ```
   PORT=8000
   USE_LOCAL_AGENT=true
   OPENAI_API_KEY=sk-...
   TAKO_API_TOKEN=...
   TAKO_API_BASE=http://localhost:3000/api/mcp
   ```

6. Railway will give you a URL like: `https://your-app.railway.app`

### Step 2: Deploy Frontend to Vercel

1. Go to https://vercel.com/new
2. Import repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Vite

4. Add Environment Variable:
   ```
   VITE_AGENT_URL=https://your-app.railway.app/copilotkit
   ```

5. Deploy

---

## Option 3: LangGraph Cloud + Vercel Frontend (Most Scalable)

Best for production with high traffic.

### Step 1: Deploy to LangGraph Cloud

```bash
cd agents
npm run build

# Install LangGraph CLI
npm install -g langgraph-cli

# Deploy
langgraph deploy
```

This gives you a deployment URL.

### Step 2: Update Frontend Environment

```env
VITE_AGENT_URL=https://your-deployment.langgraph.com/invoke
```

### Step 3: Deploy Frontend to Vercel

Follow same steps as previous options.

---

## Deployment Checklist

Before deploying, ensure:

- [ ] All dependencies are in package.json
- [ ] Environment variables are properly configured
- [ ] API keys have sufficient quota
- [ ] CORS is properly configured
- [ ] Build scripts work: `npm run build`
- [ ] TypeScript compiles without errors: `npm run type-check`
- [ ] Git repository is up to date

## Post-Deployment

### Test the Deployment

1. Visit your Vercel URL
2. Enter a research question
3. Ask the AI to generate a report
4. Verify charts load correctly

### Monitor Performance

- **Vercel Analytics**: Enable in project settings
- **Railway Logs**: View in Railway dashboard
- **OpenAI Usage**: Monitor at https://platform.openai.com/usage

### Common Issues

**Frontend deploys but can't reach agent**
- Check CORS settings in agent server
- Verify `VITE_AGENT_URL` is correct
- Test agent URL directly: `curl -X POST <agent-url>/copilotkit`

**Serverless function timeout**
- Vercel free tier: 10s timeout
- Upgrade to Pro for 60s timeout
- Or use Railway/Render for unlimited timeout

**Build fails on Vercel**
- Check Node.js version (use 18+)
- Try `npm install --legacy-peer-deps`
- Check build logs for specific errors

## Cost Estimates

### Free Tier
- **Vercel**: Free for personal projects
- **Railway**: $5 credit/month (then pay-as-you-go)
- **OpenAI**: Pay per token (~$0.01-0.10 per request with GPT-4)

### Production
- **Vercel Pro**: $20/month
- **Railway**: ~$5-20/month depending on usage
- **LangGraph Cloud**: Contact for pricing
- **OpenAI**: Based on usage

## Scaling Considerations

1. **Cache LLM responses** to reduce API calls
2. **Use GPT-3.5-turbo** for simpler queries
3. **Implement rate limiting** on the agent endpoint
4. **Add Redis** for session management
5. **Use CDN** for Tako chart iframes

## Security

- Never commit API keys to git
- Use environment variables for all secrets
- Enable rate limiting on production
- Implement authentication if needed
- Use HTTPS only (Vercel provides this automatically)

## Updating the Deployment

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push

# Vercel auto-deploys on push
# Railway auto-deploys on push
```

For manual deployment:
```bash
vercel --prod
```

## Rollback

If something goes wrong:

1. Go to Vercel dashboard → Deployments
2. Find the last working deployment
3. Click "..." → "Promote to Production"

---

## Next Steps

After successful deployment:

1. Set up custom domain (in Vercel settings)
2. Configure analytics
3. Add error monitoring (Sentry, LogRocket)
4. Set up CI/CD for automated testing
5. Add end-to-end tests

For questions or issues, check:
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- LangGraph Docs: https://langchain-ai.github.io/langgraph/
