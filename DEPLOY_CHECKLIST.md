# Vercel Deployment Checklist

Quick checklist for deploying Tako Research Canvas to Vercel.

## Pre-Deployment

- [ ] Code is committed to Git
- [ ] Repository is on GitHub
- [ ] OpenAI API key ready (with credits)
- [ ] Tako API token ready
- [ ] Vercel account created

## Files Ready

These files are already configured for Vercel:

- [x] `vercel.json` - Vercel configuration
- [x] `api/copilotkit-handler.js` - Serverless function for agent
- [x] `frontend/.env.production` - Production environment config
- [x] `.vercelignore` - Files to exclude from deployment

## Deployment Steps

### Option 1: Vercel Dashboard (Easiest)

1. **Go to Vercel**
   - Visit https://vercel.com/new
   - Click "Import Git Repository"
   - Select your GitHub repo

2. **Configure Project**
   - Framework: Vite (auto-detected)
   - Root Directory: Leave blank
   - Build settings: Will use vercel.json

3. **Add Environment Variables**
   ```
   OPENAI_API_KEY = sk-your-key-here
   TAKO_API_TOKEN = your-token-here
   TAKO_API_BASE = http://localhost:3000/api/mcp
   USE_LOCAL_AGENT = true
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 3-5 minutes
   - Get your URL: `https://your-project.vercel.app`

### Option 2: Vercel CLI

```bash
# Install CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add OPENAI_API_KEY
vercel env add TAKO_API_TOKEN
vercel env add TAKO_API_BASE
vercel env add USE_LOCAL_AGENT

# Deploy to production
vercel --prod
```

## Post-Deployment

### Test Your Deployment

1. **Visit your Vercel URL**
   - Open `https://your-project.vercel.app`

2. **Test the UI**
   - [ ] Frontend loads correctly
   - [ ] Research question input visible
   - [ ] Chat sidebar appears
   - [ ] No console errors

3. **Test the Agent**
   - [ ] Enter research question: "AI adoption in healthcare"
   - [ ] Send chat message: "Generate a research report"
   - [ ] Wait for response (may take 20-60 seconds)
   - [ ] Check for data questions generation
   - [ ] Verify charts appear in resources section
   - [ ] Check research report displays

### Monitor

1. **Check Function Logs**
   - Vercel Dashboard → Your Project → Functions
   - Click `/api/copilotkit-handler`
   - View invocation logs

2. **Check OpenAI Usage**
   - Visit https://platform.openai.com/usage
   - Monitor API calls and costs

## Common Issues & Fixes

### Build Fails

**Error: "npm install failed"**
```bash
# Check package.json files exist
ls agents/package.json
ls frontend/package.json

# Try building locally first
cd frontend && npm install && npm run build
cd ../agents && npm install --legacy-peer-deps && npm run build
```

### Function Timeout

**Error: "Function exceeded maximum duration"**
- Vercel Free: 10 seconds
- Vercel Pro: 60 seconds

**Fix**: Upgrade to Vercel Pro ($20/month) or optimize:
```typescript
// Use faster model in agents/src/chat.ts
model: "gpt-3.5-turbo"  // Instead of gpt-4o

// Reduce charts in agents/src/search.ts
count: 2  // Instead of 5
```

### Agent Not Working

**Error in logs: "OpenAI API error"**
- Check API key is correct
- Verify OpenAI account has credits
- Test key: https://platform.openai.com/playground

**Error: "Cannot find module"**
- Agent didn't compile
- Check build logs in Vercel
- Make sure `npm run build` works locally in `/agents`

### Frontend Can't Reach Agent

**Error: "Failed to fetch /api/copilotkit"**
- Check `frontend/.env.production` has `VITE_AGENT_URL=/api/copilotkit`
- Redeploy with `vercel --prod`
- Check browser Network tab for actual error

## Upgrade to Pro

If you hit limits on the free tier:

1. Go to Vercel Dashboard → Settings → Billing
2. Upgrade to Pro ($20/month)
3. Benefits:
   - 60 second function timeout (vs 10 seconds)
   - 1TB bandwidth (vs 100GB)
   - Better support

## Update Deployment

When you make changes:

```bash
git add .
git commit -m "Update agent logic"
git push

# Vercel auto-deploys on push to main branch
# Or manually:
vercel --prod
```

## Rollback

If something breaks:

1. Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

## Cost Monitoring

### Vercel
- **Free**: $0/month (hobby use)
- **Pro**: $20/month (production)

### OpenAI
- **GPT-4o**: ~$0.03-0.10 per report
- **GPT-3.5-turbo**: ~$0.001-0.01 per report

### Total Monthly Estimate
- Light use (10 reports/day): $20 Vercel + ~$5 OpenAI = **$25/month**
- Medium use (50 reports/day): $20 Vercel + ~$25 OpenAI = **$45/month**

## Next Steps

After successful deployment:

- [ ] Set up custom domain
- [ ] Enable Vercel Analytics
- [ ] Add error monitoring (Sentry)
- [ ] Set up alerts for function errors
- [ ] Configure rate limiting
- [ ] Add authentication (if needed)
- [ ] Optimize agent performance
- [ ] Add caching layer

## Support

- **Vercel Docs**: https://vercel.com/docs
- **OpenAI Docs**: https://platform.openai.com/docs
- **CopilotKit Docs**: https://docs.copilotkit.ai
- **LangGraph Docs**: https://langchain-ai.github.io/langgraph/

---

✅ **Ready to deploy!**

Run: `vercel` in your terminal or use the Vercel Dashboard.
