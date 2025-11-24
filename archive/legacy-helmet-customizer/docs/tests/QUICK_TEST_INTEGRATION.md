# Quick Test Integration - Material Finishes

## Step 1: Add Test Component to Your Page

Open `app/page.tsx` and add the FinishTest component:

```typescript
// At the top with other imports
import { FinishTest } from './components/FinishTest';

// In your render, add this component
<FinishTest splineApp={splineRef.current} />
```

## Full Integration Example

```typescript
// app/page.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import type { Application } from '@splinetool/runtime';
import ConsolePanel from './components/ConsolePanel';
import { CustomizationPanel } from './components/CustomizationPanel';
import { CustomizationWizard } from './components/CustomizationWizard';
import { FinishTest } from './components/FinishTest';  // ← ADD THIS
import { useHelmetStore } from '@/store/helmetStore';

export default function Home() {
  const splineRef = useRef<Application>();
  const [helmetLoaded, setHelmetLoaded] = useState(false);

  // ... rest of your existing code ...

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Your existing layout */}
      <div className="flex-1 relative">
        <Spline
          scene="YOUR_SCENE_URL"
          onLoad={onLoad}
        />

        {/* ADD TEST COMPONENT HERE */}
        <FinishTest splineApp={splineRef.current} />
      </div>

      {/* Rest of your UI */}
    </div>
  );
}
```

## Step 2: Test It Live

```bash
npm run dev
```

Open http://localhost:3000

You should see:
- 🪖 Your helmet in the Spline canvas
- 🧪 A "Finish Test" panel in the bottom-right corner
- 6 buttons for different finishes

## Step 3: Click Through Finishes

Click each button to test:
1. **Glossy** - High shine (R:0.1, M:0.0)
2. **Matte** - No shine (R:1.0, M:0.0)
3. **Chrome** - Mirror metal (R:0.0, M:1.0)
4. **Brushed Metal** - Anisotropic (R:0.4, M:1.0)
5. **Satin** - Semi-gloss (R:0.5, M:0.0)
6. **Metallic Paint** - Sparkle (R:0.3, M:0.6)

## Expected Behavior

✅ **When it works:**
- Clicking a button updates the helmet material instantly
- Status shows "✅ Applied [Finish Name]"
- Helmet appearance changes (shine, reflection)
- Color stays the same

❌ **If you see errors:**
- "⚠️ Could not find helmet object" → Check object name in Spline
- "⚠️ Object has no material" → Object might not have a material
- "❌ Spline not loaded" → Wait for Spline to load first

## Step 4: Adjust Object Names (If Needed)

If you see "Could not find helmet object", update the object name:

```typescript
// In FinishTest.tsx, line 35
const helmetObject = splineApp.findObjectByName('YOUR_ACTUAL_HELMET_NAME');
```

To find your object name:
1. Open browser console (F12)
2. Type: `splineRef.current.findObjectByName('Helmet')`
3. Try different names until you find it

Common names:
- `HelmetShell`
- `Helmet`
- `helmet`
- `Helmet_Shell`
- `Shell`

## Step 5: Verify Shared Package Import

Check the console for:
```
Import from @blender-workspace/shared-3d ✅
```

This confirms the shared package is working!

## Next Steps After Testing

Once the test component works:

1. **Remove test component** from page.tsx
2. **Integrate into CustomizationPanel** for production
3. **Replace existing finish system** with shared package finishes
4. **Add to your existing UI** with proper styling

## Integration into Production CustomizationPanel

See `src/components/FinishSelector.tsx` for the production-ready component with:
- Full UI with visual indicators
- Smooth transitions
- Proper TypeScript types
- Error handling
- Accessible design

---

**Ready to test?** Just add `<FinishTest splineApp={splineRef.current} />` to your page and run `npm run dev`!
