import { NextRequest, NextResponse } from 'next/server';
import { FINISH_PRESETS, isValidZone, isValidFinish, isValidHexColor, isValidNumber } from '@/lib/constants';
import type { HelmetZone, MaterialFinish } from '@/store/helmetStore';

// ============================================================
// MATERIAL PROPERTY WEBHOOK
// ============================================================
// Receives material property updates and returns formatted data
// for Spline runtime application

interface MaterialProperties {
  color?: string; // Hex color (e.g., "#FF0000")
  finish?: MaterialFinish;
  metalness?: number; // 0.0 - 1.0
  roughness?: number; // 0.0 - 1.0
  clearcoat?: number; // 0.0 - 1.0
  clearcoatRoughness?: number; // 0.0 - 1.0
  emissive?: string; // Hex color for glow
  emissiveIntensity?: number; // 0.0+
}

interface ZoneMaterialUpdate {
  zone: HelmetZone;
  properties: MaterialProperties;
}

interface WebhookPayload {
  updates: ZoneMaterialUpdate[];
  timestamp?: string;
  source?: string; // e.g., "blender", "ui", "external"
}

// ============================================================
// VALIDATION (using centralized validation from constants)
// ============================================================

function validatePayload(body: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!body.updates || !Array.isArray(body.updates)) {
    errors.push('Missing or invalid "updates" array');
    return { valid: false, errors };
  }

  body.updates.forEach((update: any, index: number) => {
    if (!update.zone || !isValidZone(update.zone)) {
      errors.push(`Update ${index}: Invalid zone "${update.zone}"`);
    }

    if (!update.properties || typeof update.properties !== 'object') {
      errors.push(`Update ${index}: Missing or invalid properties`);
      return;
    }

    const props = update.properties;

    // Validate color
    if (props.color !== undefined && !isValidHexColor(props.color)) {
      errors.push(`Update ${index}: Invalid color format "${props.color}"`);
    }

    // Validate finish
    if (props.finish !== undefined && !isValidFinish(props.finish)) {
      errors.push(`Update ${index}: Invalid finish "${props.finish}"`);
    }

    // Validate metalness
    if (props.metalness !== undefined && !isValidNumber(props.metalness)) {
      errors.push(`Update ${index}: Metalness must be 0.0-1.0`);
    }

    // Validate roughness
    if (props.roughness !== undefined && !isValidNumber(props.roughness)) {
      errors.push(`Update ${index}: Roughness must be 0.0-1.0`);
    }

    // Validate clearcoat
    if (props.clearcoat !== undefined && !isValidNumber(props.clearcoat)) {
      errors.push(`Update ${index}: Clearcoat must be 0.0-1.0`);
    }

    // Validate clearcoatRoughness
    if (props.clearcoatRoughness !== undefined && !isValidNumber(props.clearcoatRoughness)) {
      errors.push(`Update ${index}: ClearcoatRoughness must be 0.0-1.0`);
    }

    // Validate emissive
    if (props.emissive !== undefined && !isValidHexColor(props.emissive)) {
      errors.push(`Update ${index}: Invalid emissive color "${props.emissive}"`);
    }

    // Validate emissiveIntensity
    if (props.emissiveIntensity !== undefined && !isValidNumber(props.emissiveIntensity, 0, 100)) {
      errors.push(`Update ${index}: EmissiveIntensity must be 0.0+`);
    }
  });

  return { valid: errors.length === 0, errors };
}

// ============================================================
// WEBHOOK HANDLERS
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate payload
    const validation = validatePayload(body);
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        errors: validation.errors,
      }, { status: 400 });
    }

    const payload: WebhookPayload = body;

    // Process each zone update and apply finish presets if specified
    const processedUpdates = payload.updates.map(update => {
      const processed = { ...update };

      // If finish is specified, merge in preset values
      if (update.properties.finish) {
        const preset = FINISH_PRESETS[update.properties.finish];
        processed.properties = {
          ...processed.properties,
          metalness: processed.properties.metalness ?? preset.metalness,
          roughness: processed.properties.roughness ?? preset.roughness,
        };
      }

      return processed;
    });

    // Return processed updates ready for Spline application
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      updates: processedUpdates,
      source: payload.source || 'webhook',
      message: `${processedUpdates.length} material update(s) processed`,
    });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    }, { status: 500 });
  }
}

// ============================================================
// GET - Retrieve Current Material State
// ============================================================

export async function GET(request: NextRequest) {
  try {
    // Return default material state for all zones
    // In a real app, this would fetch from database/storage
    const defaultState: ZoneMaterialUpdate[] = [
      {
        zone: 'shell',
        properties: {
          color: '#1E3A8A',
          finish: 'glossy',
          metalness: 0.8,
          roughness: 0.2,
        }
      },
      {
        zone: 'facemask',
        properties: {
          color: '#C0C0C0',
          finish: 'chrome',
          metalness: 1.0,
          roughness: 0.05,
        }
      },
      {
        zone: 'chinstrap',
        properties: {
          color: '#1F2937',
          finish: 'matte',
          metalness: 0.0,
          roughness: 0.8,
        }
      },
      {
        zone: 'padding',
        properties: {
          color: '#F3F4F6',
          finish: 'matte',
          metalness: 0.0,
          roughness: 0.9,
        }
      },
      {
        zone: 'hardware',
        properties: {
          color: '#FCD34D',
          finish: 'brushed',
          metalness: 0.9,
          roughness: 0.35,
        }
      },
    ];

    return NextResponse.json({
      success: true,
      state: defaultState,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
