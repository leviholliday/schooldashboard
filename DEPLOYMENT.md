# Deployment Guide for Levi's Course Dashboard

## 🚀 Deploy to Netlify

### Option 1: Drag & Drop (Quick Deploy)
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Drag and drop your project folder directly onto the Netlify dashboard
3. Your site will be deployed instantly with a random URL
4. Click "Site settings" → "Change site name" to customize the URL

### Option 2: GitHub Integration (Recommended)
1. Push your code to GitHub (see GitHub setup below)
2. In Netlify, click "New site from Git"
3. Choose GitHub and authorize Netlify
4. Select your repository
5. Configure build settings:
   - **Build command**: Leave empty (static site)
   - **Publish directory**: `.` (root directory)
6. Click "Deploy site"

## 🔗 GitHub Setup

### 1. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Course Dashboard"
```

### 2. Create GitHub Repository
1. Go to [github.com](https://github.com) and create a new repository
2. Don't initialize with README (we already have one)
3. Copy the repository URL

### 3. Connect and Push
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## 📁 Project Structure
```
levi-course-dashboard/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All CSS styles
├── js/
│   └── script.js       # All JavaScript functionality
├── netlify.toml        # Netlify configuration
├── package.json        # Project metadata
├── README.md           # Project documentation
├── .gitignore          # Git ignore rules
└── DEPLOYMENT.md       # This file
```

## ⚙️ Netlify Configuration

The `netlify.toml` file is already configured for you:
- **Build directory**: `.` (current directory)
- **Publish directory**: `.` (current directory)

## 🔄 Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch automatically triggers a new deployment
- Netlify will show build status and deployment logs
- You can preview changes before they go live

## 🌐 Custom Domain (Optional)

1. In Netlify, go to "Domain settings"
2. Click "Add custom domain"
3. Follow the DNS configuration instructions
4. Your dashboard will be available at your custom domain

## 📱 Testing

After deployment:
1. Test all three views (Dashboard, Schedule, Calendar)
2. Verify course filtering works
3. Check that task completion saves properly
4. Test on mobile devices for responsiveness

## 🐛 Troubleshooting

### Common Issues:
- **404 errors**: Ensure `index.html` is in the root directory
- **CSS not loading**: Check that `css/styles.css` exists and is linked correctly
- **JavaScript not working**: Verify `js/script.js` exists and is linked correctly
- **Build failures**: Ensure all files are committed and pushed to GitHub

### Local Testing:
```bash
# Test locally before deploying
python3 -m http.server 8000
# Then open http://localhost:8000 in your browser
```

## 🎉 Success!

Your course dashboard is now live and will automatically update whenever you push changes to GitHub!
