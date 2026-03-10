# Deployment Guide - Vercel

## Prerequisites
1. **Vercel Account** - Sign up at https://vercel.com
2. **Git Repository** - Push your code to GitHub, GitLab, or Bitbucket
3. **API Keys** - Have your Google GenAI and OpenAI API keys ready

## Step-by-Step Deployment

### 1. Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/ai-website-xray.git
git branch -M main
git push -u origin main
```

### 2. Connect to Vercel
- Visit https://vercel.com/dashboard
- Click "Add New" → "Project"
- Select your GitHub repository
- Click "Import"

### 3. Configure Environment Variables
In the Vercel dashboard **Environment Variables** section, add:
- `GOOGLE_API_KEY`: Your Google GenAI API key
- `OPENAI_API_KEY`: Your OpenAI API key

### 4. Deploy
- Click "Deploy"
- Wait for the build to complete (2-3 minutes)
- Your app will be live at `https://your-project.vercel.app`

## Getting Your API Keys

### Google GenAI API Key
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy and paste in Vercel environment variables

### OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy and paste in Vercel environment variables

## Important Notes

⚠️ **Puppeteer Limitations on Vercel**:
- Screenshots may take longer or fail due to Vercel's serverless environment
- For better performance, consider **Railway** or **Render** instead
- If screenshots don't work, you may need to use a headless browser service API

## Troubleshooting

**Build fails with Puppeteer error:**
- Add to `vercel.json` under env: `"PUPPETEER_SKIP_CHROMIUM_DOWNLOAD": "true"`
- Or use a browser API service instead

**Screenshots not generating:**
- Check browser compatibility settings
- Consider using a screenshot API service

## Local Testing Before Deploy
```bash
npm install
npm start
```
Then visit: http://localhost:3000

## Next Steps After Deployment
1. Test all API endpoints
2. Monitor logs in Vercel dashboard
3. Set up error tracking (optional)
4. Configure custom domain (optional)
