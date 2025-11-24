/**
 * Inspect Spline Scene - Extract actual object hierarchy
 * Run this in the browser console on the live site to get real object names
 */

// Wait for Spline to load
setTimeout(() => {
  console.log('🔍 Inspecting Spline Scene...\n');

  // Get the Spline application instance
  const canvas = document.querySelector('canvas');
  if (!canvas) {
    console.error('❌ No canvas found');
    return;
  }

  // Access the Spline runtime
  const spline = canvas.spline || canvas._spline || window.spline;
  if (!spline) {
    console.error('❌ Spline runtime not found');
    return;
  }

  // Get all objects
  const allObjects = spline.getAllObjects();
  console.log(`📊 Total objects in scene: ${allObjects.length}\n`);

  // Group objects by type
  const grouped = {};
  allObjects.forEach(obj => {
    const type = obj.type || 'unknown';
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(obj.name || 'unnamed');
  });

  // Print grouped objects
  console.log('📁 OBJECTS BY TYPE:\n');
  Object.keys(grouped).sort().forEach(type => {
    console.log(`\n${type} (${grouped[type].length}):`);
    grouped[type].forEach(name => console.log(`  - ${name}`));
  });

  // Find helmet-related objects
  console.log('\n\n🎯 HELMET-RELATED OBJECTS:\n');

  const helmetPatterns = [
    'helmet', 'Helmet',
    'facemask', 'Facemask', 'face', 'Face',
    'chinstrap', 'Chinstrap', 'chin', 'Chin',
    'padding', 'Padding', 'pad', 'Pad',
    'hardware', 'Hardware',
    'UV01', 'UV02', 'UV03',
    'shell', 'Shell'
  ];

  const helmetObjects = allObjects.filter(obj => {
    const name = obj.name || '';
    return helmetPatterns.some(pattern => name.includes(pattern));
  });

  helmetObjects.forEach(obj => {
    console.log(`\n📦 ${obj.name}`);
    console.log(`   Type: ${obj.type}`);
    console.log(`   UUID: ${obj.uuid}`);
    if (obj.parent) console.log(`   Parent: ${obj.parent.name || 'unnamed'}`);

    // Check for children
    const children = allObjects.filter(child => child.parent?.uuid === obj.uuid);
    if (children.length > 0) {
      console.log(`   Children (${children.length}):`);
      children.forEach(child => console.log(`     - ${child.name}`));
    }
  });

  // Try to find the main helmet parent
  console.log('\n\n🔎 SEARCHING FOR MAIN HELMET PARENT:\n');
  const possibleParents = allObjects.filter(obj => {
    const name = (obj.name || '').toLowerCase();
    return name.includes('helmet') && name.includes('spline');
  });

  possibleParents.forEach(obj => {
    const children = allObjects.filter(child => child.parent?.uuid === obj.uuid);
    console.log(`\n✨ ${obj.name} has ${children.length} children:`);
    children.forEach(child => console.log(`   - ${child.name}`));
  });

  console.log('\n\n✅ Inspection complete!');
  console.log('Copy this output to create accurate ZONE_PATTERNS');

}, 3000);
