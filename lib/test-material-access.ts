/**
 * Material Access Test Utility
 *
 * Run this in your browser console to test what material properties are available
 *
 * Usage:
 * 1. Open your app in browser
 * 2. Open console
 * 3. Copy this code and run it after scene loads
 */

import type { Application } from '@splinetool/runtime';

export function testMaterialAccess(spline: Application) {
  console.group('🔬 Material Property Test');

  const allObjects = spline.getAllObjects?.() || [];
  console.log(`Total objects in scene: ${allObjects.length}`);

  // Find helmet shell for testing
  const shell = allObjects.find(obj => obj.name?.includes('Shell'));

  if (!shell) {
    console.error('❌ Could not find Shell object');
    console.groupEnd();
    return;
  }

  console.log('✅ Found Shell object:', shell.name);

  // Test 1: Does it have a material?
  console.log('\n📋 Test 1: Material existence');
  console.log('Has material:', !!shell.material);

  if (!shell.material) {
    console.error('❌ No material found on object');
    console.groupEnd();
    return;
  }

  // Test 2: What type of material?
  console.log('\n📋 Test 2: Material type');
  console.log('Material type:', shell.material.type);
  console.log('Material constructor:', shell.material.constructor.name);

  // Test 3: Available properties
  console.log('\n📋 Test 3: Available properties');
  console.log('Has color:', 'color' in shell.material);
  console.log('Has metalness:', 'metalness' in shell.material);
  console.log('Has roughness:', 'roughness' in shell.material);
  console.log('Has clearcoat:', 'clearcoat' in shell.material);
  console.log('Has emissive:', 'emissive' in shell.material);

  // Test 4: Try to read values
  console.log('\n📋 Test 4: Current values');
  try {
    if ('color' in shell.material) {
      console.log('color:', shell.material.color);
    }
    if ('metalness' in shell.material) {
      console.log('metalness:', (shell.material as any).metalness);
    }
    if ('roughness' in shell.material) {
      console.log('roughness:', (shell.material as any).roughness);
    }
  } catch (err) {
    console.error('❌ Error reading values:', err);
  }

  // Test 5: Try to WRITE values
  console.log('\n📋 Test 5: Write test');

  // Test color change (Spline API)
  try {
    const originalColor = shell.material.color?.getHexString?.();
    console.log('Original color:', originalColor);

    shell.material.color?.set?.('#FF0000');
    console.log('✅ Spline color API works!');

    // Restore
    setTimeout(() => {
      shell.material.color?.set?.(`#${originalColor}`);
      console.log('Restored original color');
    }, 1000);
  } catch (err) {
    console.error('❌ Spline color API failed:', err);
  }

  // Test metalness/roughness (Three.js API)
  try {
    if ('metalness' in shell.material) {
      const original = (shell.material as any).metalness;
      console.log('Original metalness:', original);

      (shell.material as any).metalness = 1.0;
      console.log('✅ metalness write succeeded');

      // Check if it actually changed
      const newValue = (shell.material as any).metalness;
      if (newValue === 1.0) {
        console.log('✅ metalness change took effect!');
      } else {
        console.warn('⚠️ metalness written but value unchanged:', newValue);
      }

      // Restore
      setTimeout(() => {
        (shell.material as any).metalness = original;
        console.log('Restored original metalness');
      }, 1000);
    } else {
      console.warn('⚠️ metalness property not found');
    }
  } catch (err) {
    console.error('❌ metalness access failed:', err);
  }

  // Test 6: Check if it's a Spline custom material
  console.log('\n📋 Test 6: Material system detection');

  // @ts-ignore
  const isThreeJsMaterial = shell.material.isMe shStandardMaterial ||
                           shell.material.isMeshPhysicalMaterial ||
                           shell.material.isMeshBasicMaterial;

  if (isThreeJsMaterial) {
    console.log('✅ Standard Three.js material - Direct property access should work');
    console.log('   Recommendation: Use awwwards-rig approach (direct access)');
  } else {
    console.log('⚠️ Custom Spline material detected');
    console.log('   Recommendation: Use Spline Variables approach');
  }

  // Test 7: List all properties
  console.log('\n📋 Test 7: All material properties');
  console.log('Available properties:', Object.keys(shell.material));

  console.groupEnd();

  return {
    hasColor: 'color' in shell.material,
    hasMetalness: 'metalness' in shell.material,
    hasRoughness: 'roughness' in shell.material,
    isStandardMaterial: isThreeJsMaterial,
    recommendation: isThreeJsMaterial
      ? 'Use direct property access (awwwards-rig approach)'
      : 'Use Spline Variables approach'
  };
}

// Export for browser console testing
if (typeof window !== 'undefined') {
  (window as any).testMaterialAccess = testMaterialAccess;
}
