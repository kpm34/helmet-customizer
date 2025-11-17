'use client';

import { useRef, useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import type { Application } from '@splinetool/runtime';
import ConsolePanel from './components/ConsolePanel';
import { CustomizationPanel } from './components/CustomizationPanel';
import { CustomizationWizard } from './components/CustomizationWizard';
import { useHelmetStore } from '@/store/helmetStore';
import { changeZoneColor, applyZoneFinish, setVariable, getVariable } from '@/lib/spline-helmet';
import {
  changeZoneColorDirect,
  applyZoneFinishDirect,
  forceHelmetOpacityDirect,
  startOpacityEnforcement,
} from '@/lib/spline-helmet-hybrid';

export default function Home() {
  const splineRef = useRef<Application>();
  const [helmetLoaded, setHelmetLoaded] = useState(false);
  const [showHelmet, setShowHelmet] = useState(true);
  const [showWizard, setShowWizard] = useState(false);

  // Get Zustand store config
  const config = useHelmetStore((state) => state.config);

  // Sync Zustand store changes to Spline (using direct THREE.js access)
  useEffect(() => {
    if (!splineRef.current || !helmetLoaded) return;

    console.log('🔄 Syncing Zustand state to THREE.js scene (direct access)...');

    // Update all zone colors using direct THREE.js manipulation
    Object.entries(config).forEach(([zone, zoneConfig]) => {
      changeZoneColorDirect(splineRef.current!, zone as any, zoneConfig.color);
      applyZoneFinishDirect(splineRef.current!, zone as any, zoneConfig.finish);
    });
  }, [config, helmetLoaded]);

  function onLoad(spline: Application) {
    splineRef.current = spline;
    console.log('🎬 Spline scene loaded');

    // AUTO-TEST VARIABLES AND SEND TO WEBHOOK
    setTimeout(async () => {
      const testResults = {
        test: 'Spline Variables',
        timestamp: new Date().toISOString(),
        tests: [] as any[]
      };

      try {
        // Test 1: Get initial value
        const initialValue = getVariable(spline, 'testVar');
        testResults.tests.push({
          name: 'Get initial testVar',
          success: initialValue !== undefined,
          value: initialValue
        });

        // Test 2: Set to 0
        setVariable(spline, 'testVar', 0);
        await new Promise(r => setTimeout(r, 100));
        const value0 = getVariable(spline, 'testVar');
        testResults.tests.push({
          name: 'Set testVar = 0',
          success: value0 === 0,
          expected: 0,
          actual: value0
        });

        // Test 3: Set to 50
        setVariable(spline, 'testVar', 50);
        await new Promise(r => setTimeout(r, 100));
        const value50 = getVariable(spline, 'testVar');
        testResults.tests.push({
          name: 'Set testVar = 50',
          success: value50 === 50,
          expected: 50,
          actual: value50
        });

        // Test 4: Set to 100
        setVariable(spline, 'testVar', 100);
        await new Promise(r => setTimeout(r, 100));
        const value100 = getVariable(spline, 'testVar');
        testResults.tests.push({
          name: 'Set testVar = 100',
          success: value100 === 100,
          expected: 100,
          actual: value100
        });

        // Reset to initial
        setVariable(spline, 'testVar', initialValue);

        testResults.tests.push({
          name: 'Overall',
          allPassed: testResults.tests.every(t => t.success)
        });

        // Send to Spline webhook
        await fetch('https://hooks.spline.design/0E4D-2QTq6o', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Q98JSNjUobcbKxqOcsYpSnf0sLMhmLBZC7agQxihEjM',
            'Accept': 'application/json'
          },
          body: JSON.stringify(testResults)
        });

        console.log('✅ Variable test results sent to Spline webhook:', testResults);
      } catch (error) {
        console.error('❌ Variable test failed:', error);
        await fetch('https://hooks.spline.design/0E4D-2QTq6o', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Q98JSNjUobcbKxqOcsYpSnf0sLMhmLBZC7agQxihEjM',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ error: String(error), tests: testResults.tests })
        });
      }
    }, 2000); // Wait 2 seconds for scene to fully initialize

    // List all objects in scene for debugging
    console.log('=== ALL SCENE OBJECTS ===');
    const allObjects = spline.getAllObjects();
    allObjects.forEach(obj => {
      console.log(`  - ${obj.name} (${obj.uuid})`);
    });

    // DEEP ANALYSIS: Extract all available material/texture/node data
    console.log('\n🔬 === DEEP MATERIAL ANALYSIS ===\n');

    const helmetParts = allObjects.filter(obj =>
      obj.name && (
        obj.name.includes('UV') ||
        obj.name.includes('Facemask') ||
        obj.name.includes('Hardware') ||
        obj.name.includes('Chinstrap') ||
        obj.name.includes('Padding')
      )
    );

    helmetParts.forEach(obj => {
      console.log(`\n📦 ${obj.name}:`);
      console.log('  Available properties:', Object.keys(obj));

      const typedObj = obj as any;

      // Check for material
      if (typedObj.material) {
        console.log('  ✅ Material exists:', typedObj.material);
        console.log('  Material keys:', Object.keys(typedObj.material));
        console.log('  Material type:', typedObj.material.type);

        // Try to access material properties
        const matProps = ['color', 'emissive', 'metalness', 'roughness', 'opacity', 'map', 'emissiveMap', 'normalMap', 'roughnessMap', 'metalnessMap'];
        matProps.forEach(prop => {
          if (typedObj.material[prop] !== undefined) {
            console.log(`  - ${prop}:`, typedObj.material[prop]);
          }
        });
      } else {
        console.log('  ❌ No material property');
      }

      // Check for mesh/geometry
      if (typedObj.geometry) {
        console.log('  ✅ Geometry exists');
        console.log('  Geometry type:', typedObj.geometry.type);
        console.log('  Vertices:', typedObj.geometry.attributes?.position?.count || 'unknown');
        console.log('  Has UV:', !!typedObj.geometry.attributes?.uv);
        console.log('  Has Color:', !!typedObj.geometry.attributes?.color);
      }

      // Check for color property
      if (typedObj.color !== undefined) {
        console.log('  Color property:', typedObj.color);
      }

      // Check for visible/opacity
      console.log('  Visible:', typedObj.visible);
      if (typedObj.opacity !== undefined) {
        console.log('  Opacity:', typedObj.opacity);
      }

      // Check parent/children
      if (typedObj.parent) {
        console.log('  Parent:', typedObj.parent.name);
      }
      if (typedObj.children && typedObj.children.length > 0) {
        console.log('  Children:', typedObj.children.map((c: any) => c.name).join(', '));
      }

      // Check for texture maps
      if (typedObj.textures) {
        console.log('  ✅ Textures:', typedObj.textures);
      }

      // SPLINE-SPECIFIC: Check for layer-based material properties
      console.log('\n  🎭 SPLINE LAYER PROPERTIES (Multiple Formats):');

      // Try multiple naming conventions for layer stacks
      const layerStackVariants = [
        'layers', 'Layers', 'LAYERS',
        'materialLayers', 'MaterialLayers', 'material_layers',
        'layerStack', 'LayerStack', 'layer_stack',
        '_layers', '__layers', 'splineLayers',
        'materials', 'Materials', 'materialStack'
      ];

      console.log('  Checking for layer stack arrays...');
      layerStackVariants.forEach(prop => {
        if (typedObj[prop] !== undefined) {
          console.log(`  ✅ ${prop}:`, typedObj[prop]);
          if (Array.isArray(typedObj[prop])) {
            console.log(`    → Array with ${typedObj[prop].length} items`);
          }
        }
        // Also check in material
        if (typedObj.material && typedObj.material[prop] !== undefined) {
          console.log(`  ✅ material.${prop}:`, typedObj.material[prop]);
          if (Array.isArray(typedObj.material[prop])) {
            console.log(`    → Array with ${typedObj.material[prop].length} items`);
          }
        }
      });

      // Check for individual layer properties with multiple naming conventions
      const layerPropertyVariants = {
        // Noise layer
        noise: ['noise', 'Noise', 'noiseLayer', 'NoiseLayer'],
        // Fresnel layer
        fresnel: ['fresnel', 'Fresnel', 'fresnelLayer', 'FresnelLayer'],
        // Matcap
        matcap: ['matcap', 'Matcap', 'MatCap', 'matcapLayer', 'mat_cap'],
        // Glass
        glass: ['glass', 'Glass', 'glassLayer', 'GlassLayer'],
        // Displace
        displace: ['displace', 'Displace', 'displaceLayer', 'DisplaceLayer'],
        // Pattern
        pattern: ['pattern', 'Pattern', 'patternLayer', 'PatternLayer'],
        // Gradient
        gradient: ['gradient', 'Gradient', 'gradientLayer', 'GradientLayer']
      };

      console.log('\n  Checking for individual layer types...');
      Object.entries(layerPropertyVariants).forEach(([layerName, variants]) => {
        variants.forEach(variant => {
          if (typedObj[variant] !== undefined) {
            console.log(`  ✅ ${variant}:`, typedObj[variant]);
          }
          if (typedObj.material && typedObj.material[variant] !== undefined) {
            console.log(`  ✅ material.${variant}:`, typedObj.material[variant]);
          }
        });
      });

      // Check for property value formats
      const propertyVariants = {
        // Scale/Size properties
        scale: ['scale', 'Scale', 'SCALE', 's', 'S', '_scale'],
        size: ['size', 'Size', 'SIZE', '_size'],
        // Color properties
        hue: ['hue', 'Hue', 'HUE', 'h', 'H'],
        saturation: ['saturation', 'Saturation', 'sat', 'Sat'],
        brightness: ['brightness', 'Brightness', 'bright'],
        // PBR properties
        roughness: ['roughness', 'Roughness', 'rough', 'r'],
        metalness: ['metalness', 'Metalness', 'metallic', 'Metallic', 'metal'],
        reflectiveness: ['reflectiveness', 'Reflectiveness', 'reflective', 'reflection'],
        ior: ['ior', 'IOR', 'Ior', 'indexOfRefraction', 'refractionIndex'],
        // Intensity/Strength
        intensity: ['intensity', 'Intensity', 'strength', 'Strength', 'amount'],
        // Mode/Type
        mode: ['mode', 'Mode', 'MODE', 'blendMode', 'BlendMode'],
        type: ['type', 'Type', 'TYPE', 'layerType', 'LayerType']
      };

      console.log('\n  Checking for property values...');
      Object.entries(propertyVariants).forEach(([propName, variants]) => {
        variants.forEach(variant => {
          if (typedObj[variant] !== undefined) {
            console.log(`  ✅ ${variant}: ${typedObj[variant]}`);
          }
          if (typedObj.material && typedObj.material[variant] !== undefined) {
            console.log(`  ✅ material.${variant}: ${typedObj.material[variant]}`);
          }
        });
      });

      // Check for private/internal properties
      console.log('\n  Checking for private/internal properties...');
      const privateVariants = [
        '_material', '__material', '_splineMaterial',
        '_layers', '__layers', '_layerStack',
        '_uniforms', '__uniforms', '_shader'
      ];

      privateVariants.forEach(prop => {
        if (typedObj[prop] !== undefined) {
          console.log(`  ✅ ${prop}:`, typeof typedObj[prop]);
        }
      });

      // Check for THREE.js uniforms (NodeMaterial pattern)
      if (typedObj.material && typedObj.material.uniforms) {
        console.log('  ✅ Material has uniforms!');
        const uniformKeys = Object.keys(typedObj.material.uniforms);
        console.log(`  Found ${uniformKeys.length} uniforms:`, uniformKeys.slice(0, 10).join(', '));

        // Look for color uniforms (nodeU*)
        const colorUniforms = uniformKeys.filter(key =>
          key.startsWith('nodeU') &&
          typedObj.material.uniforms[key].value?.isColor
        );
        if (colorUniforms.length > 0) {
          console.log(`  🎨 Color uniforms found:`, colorUniforms);
        }
      }

      // Object UUID for precise targeting
      console.log(`  🆔 UUID: ${obj.uuid}`);

      // DEEP PROPERTY SCAN: Iterate through ALL properties (including getters/setters)
      console.log('\n  🔍 COMPLETE PROPERTY SCAN:');
      try {
        const allProps = Object.getOwnPropertyNames(typedObj);
        console.log(`  Total properties found: ${allProps.length}`);

        // Group properties by type
        const propsGrouped = {
          functions: [] as string[],
          objects: [] as string[],
          primitives: [] as string[],
          arrays: [] as string[]
        };

        allProps.forEach(prop => {
          try {
            const value = typedObj[prop];
            if (typeof value === 'function') {
              propsGrouped.functions.push(prop);
            } else if (Array.isArray(value)) {
              propsGrouped.arrays.push(prop);
            } else if (typeof value === 'object' && value !== null) {
              propsGrouped.objects.push(prop);
            } else {
              propsGrouped.primitives.push(prop);
            }
          } catch (e) {
            // Property might be a getter that throws
          }
        });

        console.log(`  Arrays (${propsGrouped.arrays.length}):`, propsGrouped.arrays.slice(0, 10).join(', '));
        console.log(`  Objects (${propsGrouped.objects.length}):`, propsGrouped.objects.slice(0, 10).join(', '));
        console.log(`  Primitives (${propsGrouped.primitives.length}):`, propsGrouped.primitives.slice(0, 10).join(', '));

        // Look for material-related property names
        const materialRelated = allProps.filter(p =>
          p.toLowerCase().includes('material') ||
          p.toLowerCase().includes('layer') ||
          p.toLowerCase().includes('texture') ||
          p.toLowerCase().includes('color') ||
          p.toLowerCase().includes('shader')
        );

        if (materialRelated.length > 0) {
          console.log(`  🎨 Material-related properties:`, materialRelated);
        }
      } catch (e) {
        console.log('  ⚠️ Property scan failed:', e);
      }

      // Check prototype chain for inherited properties
      console.log('\n  🧬 PROTOTYPE CHAIN SCAN:');
      try {
        let proto = Object.getPrototypeOf(typedObj);
        let depth = 0;
        while (proto && depth < 5) {
          const protoProps = Object.getOwnPropertyNames(proto);
          const relevantProps = protoProps.filter(p =>
            !p.startsWith('__') &&
            typeof proto[p] !== 'function' &&
            (p.includes('material') || p.includes('layer') || p.includes('color'))
          );

          if (relevantProps.length > 0) {
            console.log(`  Prototype level ${depth}:`, relevantProps.slice(0, 5));
          }

          proto = Object.getPrototypeOf(proto);
          depth++;
        }
      } catch (e) {
        console.log('  ⚠️ Prototype scan failed:', e);
      }
    });

    console.log('\n🎨 === MATERIAL PROPERTY DETECTION TEST ===\n');
    const testObj = spline.findObjectByName('UV01_Shell');
    if (testObj) {
      const typed = testObj as any;
      console.log('Testing UV01_Shell property access:');
      console.log(`  Object name: ${testObj.name}`);
      console.log(`  Object UUID: ${testObj.uuid}`);

      // Test 1: Access by UUID
      try {
        const objByUuid = spline.findObjectById(testObj.uuid);
        console.log('✓ Test 1 (access by UUID):', objByUuid ? 'SUCCESS' : 'FAILED');
      } catch (e) {
        console.log('✗ Test 1 failed:', e);
      }

      // Test 2: Direct color property
      try {
        console.log('  Current color:', typed.color);
        typed.color = '#FF0000';
        console.log('✓ Test 2 (direct color): SUCCESS - set to red');
      } catch (e) {
        console.log('✗ Test 2 failed:', e);
      }

      // Test 3: Matcap property (from Spline UI screenshots)
      try {
        if (typed.matcap !== undefined) {
          console.log('✓ Test 3 (matcap property exists):', typed.matcap);
        } else if (typed.material?.matcap !== undefined) {
          console.log('✓ Test 3 (material.matcap exists):', typed.material.matcap);
        } else {
          console.log('✗ Test 3: No matcap property found');
        }
      } catch (e) {
        console.log('✗ Test 3 failed:', e);
      }

      // Test 4: Lighting property (from Spline UI screenshots)
      try {
        if (typed.lighting !== undefined) {
          console.log('✓ Test 4 (lighting property exists):', typed.lighting);
        } else if (typed.material?.lighting !== undefined) {
          console.log('✓ Test 4 (material.lighting exists):', typed.material.lighting);
        } else {
          console.log('✗ Test 4: No lighting property found');
        }
      } catch (e) {
        console.log('✗ Test 4 failed:', e);
      }

      // Test 5: Material uniforms (NodeMaterial pattern)
      try {
        if (typed.material?.uniforms) {
          const uniformCount = Object.keys(typed.material.uniforms).length;
          console.log(`✓ Test 5 (material.uniforms): Found ${uniformCount} uniforms`);

          // Try to modify a nodeU uniform
          const nodeColors = Object.keys(typed.material.uniforms).filter(key =>
            key.startsWith('nodeU') && typed.material.uniforms[key].value?.isColor
          );

          if (nodeColors.length > 0) {
            console.log(`  Found ${nodeColors.length} color uniforms:`, nodeColors);
          }
        } else {
          console.log('✗ Test 5: No material.uniforms found');
        }
      } catch (e) {
        console.log('✗ Test 5 failed:', e);
      }

      // Test 6: Spline setColor API
      try {
        (spline as any).setColor(testObj, '#FF0000');
        console.log('✓ Test 6 (spline.setColor): SUCCESS');
      } catch (e) {
        console.log('✗ Test 6 failed:', e);
      }

      // Test 7: Check for material layers array
      try {
        if (typed.layers !== undefined) {
          console.log('✓ Test 7 (layers property):', typed.layers);
          if (Array.isArray(typed.layers)) {
            console.log(`  Found ${typed.layers.length} material layers`);
          }
        } else if (typed.materialLayers !== undefined) {
          console.log('✓ Test 7 (materialLayers property):', typed.materialLayers);
        } else {
          console.log('✗ Test 7: No layers property found');
        }
      } catch (e) {
        console.log('✗ Test 7 failed:', e);
      }

      // Test 8: Try modifying Noise layer properties (if exists)
      try {
        if (typed.noise !== undefined || typed.material?.noise !== undefined) {
          const noiseObj = typed.noise || typed.material.noise;
          console.log('✓ Test 8 (noise layer found):', noiseObj);

          // Try to modify noise properties (Size, Scale, Movement from screenshot)
          if (noiseObj.scale !== undefined) {
            console.log(`  Current scale: ${noiseObj.scale}`);
          }
          if (noiseObj.size !== undefined) {
            console.log(`  Current size:`, noiseObj.size);
          }
        } else {
          console.log('✗ Test 8: No noise layer found');
        }
      } catch (e) {
        console.log('✗ Test 8 failed:', e);
      }

      // Test 9: Try modifying Fresnel layer properties (if exists)
      try {
        if (typed.fresnel !== undefined || typed.material?.fresnel !== undefined) {
          const fresnelObj = typed.fresnel || typed.material.fresnel;
          console.log('✓ Test 9 (fresnel layer found):', fresnelObj);

          // Try to modify fresnel properties (Bias, Scale, Intensity, Factor)
          if (fresnelObj.bias !== undefined) {
            console.log(`  Current bias: ${fresnelObj.bias}`);
          }
          if (fresnelObj.intensity !== undefined) {
            console.log(`  Current intensity: ${fresnelObj.intensity}`);
          }
        } else {
          console.log('✗ Test 9: No fresnel layer found');
        }
      } catch (e) {
        console.log('✗ Test 9 failed:', e);
      }

      // Test 10: Try accessing layer properties via index (if layers array exists)
      try {
        if (Array.isArray(typed.layers) && typed.layers.length > 0) {
          console.log('✓ Test 10 (access layers by index):');
          typed.layers.forEach((layer: any, i: number) => {
            console.log(`  Layer ${i}:`, {
              type: layer.type || 'unknown',
              mode: layer.mode,
              keys: Object.keys(layer).slice(0, 5)
            });
          });
        } else {
          console.log('✗ Test 10: No layers array to iterate');
        }
      } catch (e) {
        console.log('✗ Test 10 failed:', e);
      }
    }

    console.log('\n=== END DEEP ANALYSIS ===\n');

    // Camera controls are disabled in Spline Editor - no lock needed!
    const camera = spline.findObjectByName('Camera');
    if (camera) {
      console.log('✓ Camera found - controls disabled in Spline');
    }

    // Hide specific decorative elements based on actual scene hierarchy
    // Reference: See SPLINE_SCENE_HIERARCHY.md for complete scene mapping

    // Hide floating decorative rings (ellipse objects NOT in Floor/Roof groups)
    console.log('\n🔍 Searching for decorative rings to hide...');
    const floorGroupNames = ['Floor', 'Bottom Floating', 'Platform floor'];
    const roofGroupNames = ['roof', 'platform roof', 'smallest platform roof'];

    let hiddenCount = 0;
    allObjects.forEach(obj => {
      const typedObj = obj as any;

      // Check if this is an ellipse geometry object
      const isEllipse = typedObj.geometry &&
                       (typedObj.geometry.type === 'EllipseGeometry' ||
                        typedObj.geometry.constructor?.name === 'EllipseGeometry');

      if (isEllipse) {
        // Check if it's NOT part of Floor or Roof groups
        const isFloorOrRoof = floorGroupNames.includes(obj.name) ||
                             roofGroupNames.includes(obj.name);

        if (!isFloorOrRoof) {
          // This is a decorative ring - hide it!
          obj.visible = false;
          hiddenCount++;
          console.log(`🙈 Hidden decorative ring: ${obj.name} (EllipseGeometry)`);
        }
      }
    });

    console.log(`✅ Total decorative objects hidden: ${hiddenCount}`);

    // Find the helmet (should be in scene now)
    const helmet = spline.findObjectByName('x helmet best')
                || spline.findObjectByName('helmet_for_spline')
                || spline.findObjectByName('Helmet_Parent')
                || spline.findObjectByName('Helmet')
                || spline.findObjectByName('helmet');

    // Find the placeholder football
    const placeholder = spline.findObjectByName('Mesh_0')
                     || spline.findObjectByName('football')
                     || spline.findObjectByName('mesh_0');

    if (placeholder) {
      console.log('✓ Football found:', placeholder.name);
      console.log('  - Initial visibility:', placeholder.visible);
    }

    if (!helmet) {
      console.error('❌ Helmet not found in scene');
      console.log('💡 Available objects:', allObjects.map(o => o.name).join(', '));
      setHelmetLoaded(false);
      return;
    }

    console.log('✓ Helmet found:', helmet.name);
    console.log('  - Position:', helmet.position);
    console.log('  - Initial visibility:', helmet.visible);

    // Set initial visibility: Show helmet, hide football
    helmet.visible = true;
    console.log('✅ Helmet is now visible!');

    if (placeholder) {
      placeholder.visible = false;
      console.log('👁️ Football hidden:', placeholder.name);
    } else {
      console.log('⚠️ Football object not found - check object name in console list above');
    }

    // CRITICAL: Force 100% opacity using direct THREE.js access
    console.log('\n🔧 Setting initial opacity to 100% via direct THREE.js access...');
    const opacityCount = forceHelmetOpacityDirect(spline);
    console.log(`🎨 Opacity forced to 100% for ${opacityCount} materials`);

    // CRITICAL: Start continuous opacity enforcement to prevent resets
    console.log('🔄 Starting continuous opacity monitoring...');
    const stopEnforcement = startOpacityEnforcement(spline);

    // Store cleanup function for unmount
    (window as any).__stopOpacityEnforcement = stopEnforcement;

    // Log available Spline events (if any are configured in editor)
    try {
      const splineEvents = spline.getSplineEvents();
      if (splineEvents && Object.keys(splineEvents).length > 0) {
        console.log('🎬 Available Spline Events:', splineEvents);
      } else {
        console.log('ℹ️ No Spline events configured in editor (can add in Spline Editor → Events panel)');
      }
    } catch (e) {
      console.log('ℹ️ Spline events not available');
    }

    // Listen to any Spline events
    spline.addEventListener('mouseDown', (e) => {
      console.log('🖱️ Spline mouseDown event:', e.target.name);
    });

    setHelmetLoaded(true);
  }

  function toggleView() {
    if (!splineRef.current) return;

    const helmet = splineRef.current.findObjectByName('helmet_for_spline')
                || splineRef.current.findObjectByName('Helmet')
                || splineRef.current.findObjectByName('helmet');

    const football = splineRef.current.findObjectByName('Mesh_0')
                  || splineRef.current.findObjectByName('football')
                  || splineRef.current.findObjectByName('mesh_0');

    const newShowHelmet = !showHelmet;

    // Option 1: Try to trigger Spline event (if set up in editor)
    try {
      if (helmet) {
        splineRef.current.emitEvent('mouseDown', helmet.name);
        console.log('🎬 Triggered Spline event on helmet');
      }
    } catch (e) {
      console.log('ℹ️ No Spline event configured, using manual control');
    }

    // Option 2: Manual control (fallback or additional control)
    if (helmet) {
      helmet.visible = newShowHelmet;
      console.log(`👁️ Helmet ${newShowHelmet ? 'shown' : 'hidden'}`);
    }

    if (football) {
      football.visible = !newShowHelmet;
      console.log(`🏈 Football ${!newShowHelmet ? 'shown' : 'hidden'}`);
    }

    setShowHelmet(newShowHelmet);
  }

  return (
    <main className="w-full h-screen overflow-hidden relative" suppressHydrationWarning>
      <Spline
        scene="/scene.splinecode"
        wasmPath="/"
        onLoad={onLoad}
      />

      {/* Customization Panel */}
      {helmetLoaded && <CustomizationPanel />}

      {/* Console Panel for debugging */}
      <ConsolePanel />
    </main>
  );
}
