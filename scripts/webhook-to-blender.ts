/**
 * Webhook-to-Blender Integration
 * ================================
 *
 * This script bridges the webhook API to Blender MCP
 * allowing material property changes to update the 3D model in real-time
 */

// Types
type HelmetZone = 'SHELL' | 'FACEMASK' | 'CHINSTRAP' | 'INTERIOR_PADDING' | 'HARDWARE';

interface MaterialProperties {
  color?: string;
  finish?: 'glossy' | 'matte' | 'chrome' | 'brushed' | 'satin';
  metallic?: number;
  roughness?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
}

interface ZoneUpdate {
  zone: HelmetZone;
  properties: MaterialProperties;
}

/**
 * Send material updates to Blender via MCP
 *
 * This function takes webhook payload and executes the Blender Python script
 * using the Blender MCP server
 */
export async function sendToBlenderMCP(updates: ZoneUpdate[]) {
  // Format updates for Python script
  const pythonUpdates = JSON.stringify(updates, null, 2);

  // Read the Blender script
  const fs = await import('fs/promises');
  const scriptPath = './scripts/blender/update_helmet_materials.py';
  const blenderScript = await fs.readFile(scriptPath, 'utf-8');

  // Combine script with webhook data
  const fullScript = `
${blenderScript}

# Apply webhook updates
webhook_updates = ${pythonUpdates}
apply_webhook_updates(webhook_updates)
`;

  console.log('📤 Sending material updates to Blender MCP...');

  // Execute via Blender MCP
  // Note: This assumes you have blender-mcp running
  // See: https://github.com/your-repo/blender-mcp

  try {
    // Option 1: Direct MCP call (if you have MCP client)
    // const result = await mcp.execute_blender_code({ code: fullScript });

    // Option 2: HTTP call to MCP server
    const response = await fetch('http://localhost:3000/mcp/blender/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: fullScript }),
    });

    if (!response.ok) {
      throw new Error(`Blender MCP failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Blender materials updated:', result);

    return { success: true, result };
  } catch (error) {
    console.error('❌ Blender MCP error:', error);
    return { success: false, error };
  }
}

/**
 * Example: Update helmet materials via webhook → Blender pipeline
 */
async function exampleWebhookToBlender() {
  const updates: ZoneUpdate[] = [
    {
      zone: 'SHELL',
      properties: {
        color: '#FF0000',
        finish: 'glossy',
        metallic: 0.8,
        roughness: 0.2,
      }
    },
    {
      zone: 'FACEMASK',
      properties: {
        color: '#FFFFFF',
        finish: 'chrome',
      }
    },
  ];

  // Step 1: Send to webhook API (validates and processes)
  const webhookResponse = await fetch('/api/webhook/material', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ updates }),
  });

  const webhookData = await webhookResponse.json();

  if (!webhookData.success) {
    console.error('Webhook failed:', webhookData.errors);
    return;
  }

  // Step 2: Send processed updates to Blender MCP
  const blenderResult = await sendToBlenderMCP(webhookData.updates);

  if (blenderResult.success) {
    console.log('🎉 Helmet materials updated in Blender!');
  }
}

// Export for use in other modules
export { exampleWebhookToBlender };
