# Testing Production Deployment

## 🚀 Deployment Status

**Latest Production URL:** https://helmet-customizer-qes2duw9a-kpm34s-projects.vercel.app

**Status:** ✅ Deployed and Ready (deployed 2 minutes ago)

---

## ⚠️ Vercel Protection Notice

The deployment has Vercel authentication protection enabled. You have two options:

### Option 1: Open in Browser (Easiest)

Just open this URL in your browser (you'll be logged into Vercel):
- **Main App:** https://helmet-customizer-qes2duw9a-kpm34s-projects.vercel.app
- **Webhook API:** https://helmet-customizer-qes2duw9a-kpm34s-projects.vercel.app/api/webhook/material

### Option 2: Disable Protection (For Public Testing)

1. Go to Vercel Dashboard: https://vercel.com/kpm34s-projects/helmet-customizer
2. Settings → Deployment Protection
3. Disable protection for preview deployments

---

## 🧪 Testing the Webhook in Production

### Method 1: Browser Console

Open the app in your browser and run in the console:

```javascript
// Test GET current material state
fetch('/api/webhook/material')
  .then(r => r.json())
  .then(console.log);

// Test POST update
fetch('/api/webhook/material', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    updates: [
      {
        zone: 'SHELL',
        properties: {
          color: '#FF0000',
          finish: 'glossy'
        }
      }
    ]
  })
}).then(r => r.json()).then(console.log);
```

### Method 2: Vercel Functions Log

1. Go to: https://vercel.com/kpm34s-projects/helmet-customizer/deployments
2. Click on the latest deployment
3. Go to "Functions" tab
4. Click on `/api/webhook/material`
5. View real-time logs

---

## 🎨 Testing Spline Integration

Once you open the app:

1. **Wait for Spline to load** (you'll see the helmet)
2. **Open browser console** (F12 or Cmd+Option+I)
3. **Run test command:**

```javascript
// The spline instance is available globally
// Test changing shell color
window.splineApp && changeZoneColor(window.splineApp, 'shell', '#FF0000');

// Or test webhook integration
window.splineApp && fetchAndApplyWebhookUpdates(
  window.splineApp,
  '/api/webhook/material',
  [
    { zone: 'shell', properties: { color: '#0066FF', finish: 'glossy' } },
    { zone: 'facemask', properties: { color: '#FFFFFF', finish: 'chrome' } }
  ]
);
```

---

## 📊 Expected Results

### Successful GET Response:
```json
{
  "success": true,
  "state": [
    {
      "zone": "SHELL",
      "properties": {
        "color": "#1E3A8A",
        "finish": "glossy",
        "metallic": 0.8,
        "roughness": 0.2
      }
    },
    // ... other zones
  ],
  "timestamp": "2024-11-16T..."
}
```

### Successful POST Response:
```json
{
  "success": true,
  "timestamp": "2024-11-16T...",
  "updates": [...],
  "source": "spline-ui",
  "message": "2 material update(s) processed"
}
```

### Error Response (Invalid Zone):
```json
{
  "success": false,
  "errors": [
    "Update 0: Invalid zone \"INVALID_ZONE\""
  ]
}
```

---

## 🔍 Troubleshooting

### Can't access the URL
- Make sure you're logged into Vercel in your browser
- Try the direct SSO link from the authentication page

### Webhook returns 401 Unauthorized
- The API routes don't use authentication
- This shouldn't happen for webhook endpoints
- Check Vercel function logs for details

### Spline not loading
- Check browser console for errors
- Verify `scene.splinecode` file exists in `/public/`
- Check Network tab for failed requests

### Material updates not visible
- Open browser console to see debug logs
- Check that Spline object names match ZONE_PATTERNS
- Verify the helmet model has the correct vertex colors

---

## 📝 Quick Test Checklist

- [ ] App loads in browser
- [ ] Spline helmet scene renders
- [ ] GET `/api/webhook/material` returns default state
- [ ] POST update changes helmet color
- [ ] Browser console shows success logs
- [ ] No errors in Vercel function logs

---

## 🎯 Next Steps After Testing

Once you confirm everything works:

1. **Test all 5 zones:** SHELL, FACEMASK, CHINSTRAP, INTERIOR_PADDING, HARDWARE
2. **Test all material properties:** color, finish, metallic, roughness, clearcoat, emissive
3. **Test batch updates:** Multiple zones in one request
4. **Test validation:** Send invalid data to verify error handling
5. **Connect to Blender:** Test Blender MCP integration

---

**Production URL (Open in Browser):**
🔗 https://helmet-customizer-qes2duw9a-kpm34s-projects.vercel.app

**Deployment successful! Ready to test!** ✅
