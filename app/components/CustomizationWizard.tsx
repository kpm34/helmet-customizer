'use client';

/**
 * Helmet Customization Wizard
 * Procedural flow: Color → Finish → Pattern → Logo Upload
 *
 * Conditional logic: Noisy patterns (tiger, camo, etc.) skip logo upload
 */

import React, { useState } from 'react';
import { Tooltip } from './Tooltip';
import { ZONES_CONFIG, FINISH_TYPES } from '@/lib/constants';
import type { HelmetZone, MaterialFinish } from '@/store/helmetStore';

interface CustomizationState {
  zone: HelmetZone;
  color?: string;
  finish?: MaterialFinish;
  pattern?: string;
  logo?: File;
}

interface WizardStep {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

// Patterns that are too noisy for logos
const NOISY_PATTERNS = ['tiger', 'camo', 'carbon_fiber_heavy', 'cracked'];

export function CustomizationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [customization, setCustomization] = useState<CustomizationState>({
    zone: 'shell',
  });

  // Determine steps based on pattern selection
  const shouldShowLogoStep = !customization.pattern || !NOISY_PATTERNS.includes(customization.pattern);

  const steps: WizardStep[] = [
    {
      id: 0,
      title: 'Select Zone',
      description: 'Choose which part of the helmet to customize',
      component: ZoneSelector,
    },
    {
      id: 1,
      title: 'Pick Color',
      description: 'Choose your base color',
      component: ColorPicker,
    },
    {
      id: 2,
      title: 'Select Finish',
      description: 'Choose material finish (glossy, matte, chrome, etc.)',
      component: FinishSelector,
    },
    {
      id: 3,
      title: 'Add Pattern',
      description: 'Optional: Add a pattern overlay',
      component: PatternSelector,
    },
  ];

  // Conditionally add logo step
  if (shouldShowLogoStep) {
    steps.push({
      id: 4,
      title: 'Upload Logo',
      description: 'Add your team logo to the helmet side',
      component: LogoUploader,
    });
  }

  const currentStepData = steps[currentStep];
  const StepComponent = currentStepData.component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - apply customization
      applyCustomization();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const applyCustomization = async () => {
    // Send to webhook API
    const updates = [{
      zone: customization.zone.toUpperCase(),
      properties: {
        color: customization.color,
        finish: customization.finish,
      }
    }];

    const response = await fetch('/api/webhook/material', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates, source: 'wizard' }),
    });

    const data = await response.json();
    console.log('✅ Customization applied:', data);

    // TODO: Apply pattern and logo via Spline
  };

  return (
    <div style={styles.container}>
      {/* Progress Stepper */}
      <div style={styles.stepper}>
        {steps.map((step, index) => (
          <div
            key={step.id}
            style={{
              ...styles.stepIndicator,
              ...(index === currentStep ? styles.stepActive : {}),
              ...(index < currentStep ? styles.stepCompleted : {}),
            }}
          >
            <div style={styles.stepNumber}>
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span style={styles.stepLabel}>{step.title}</span>
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <div style={styles.stepContent}>
        <h2 style={styles.stepTitle}>{currentStepData.title}</h2>
        <p style={styles.stepDescription}>{currentStepData.description}</p>

        <StepComponent
          value={customization}
          onChange={setCustomization}
        />
      </div>

      {/* Navigation */}
      <div style={styles.navigation}>
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          style={{
            ...styles.button,
            ...styles.buttonSecondary,
            ...(currentStep === 0 ? styles.buttonDisabled : {}),
          }}
        >
          ← Back
        </button>

        <button
          onClick={handleNext}
          style={{
            ...styles.button,
            ...styles.buttonPrimary,
          }}
        >
          {currentStep === steps.length - 1 ? 'Apply Customization' : 'Next →'}
        </button>
      </div>

      {/* Conditional Message */}
      {customization.pattern && NOISY_PATTERNS.includes(customization.pattern) && (
        <div style={styles.notice}>
          ⚠️ Logo upload skipped - "{customization.pattern}" pattern is too detailed
        </div>
      )}
    </div>
  );
}

// ============================================================
// STEP 1: ZONE SELECTOR
// ============================================================

function ZoneSelector({ value, onChange }: any) {
  return (
    <div style={styles.grid}>
      {ZONES_CONFIG.map((zone) => (
        <Tooltip key={zone.id} content={zone.description} position="top">
          <button
            onClick={() => onChange({ ...value, zone: zone.id })}
            style={{
              ...styles.zoneCard,
              ...(value.zone === zone.id ? styles.zoneCardActive : {}),
            }}
          >
            <div style={styles.zoneIcon}>🎯</div>
            <div style={styles.zoneLabel}>{zone.label}</div>
          </button>
        </Tooltip>
      ))}
    </div>
  );
}

// ============================================================
// STEP 2: COLOR PICKER
// ============================================================

function ColorPicker({ value, onChange }: any) {
  const teamColors = [
    { name: 'Navy Blue', hex: '#001f3f' },
    { name: 'Crimson', hex: '#DC143C' },
    { name: 'Forest Green', hex: '#228B22' },
    { name: 'Gold', hex: '#FFD700' },
    { name: 'Orange', hex: '#FF8C00' },
    { name: 'Purple', hex: '#800080' },
    { name: 'Silver', hex: '#C0C0C0' },
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Maroon', hex: '#800000' },
    { name: 'Royal Blue', hex: '#4169E1' },
    { name: 'Burnt Orange', hex: '#CC5500' },
  ];

  return (
    <div style={styles.colorGrid}>
      {teamColors.map((color) => (
        <Tooltip key={color.hex} content={color.name} position="top">
          <button
            onClick={() => onChange({ ...value, color: color.hex })}
            style={{
              ...styles.colorSwatch,
              background: color.hex,
              border: color.hex === '#FFFFFF' ? '2px solid #ddd' : '2px solid rgba(255,255,255,0.3)',
              ...(value.color === color.hex ? styles.colorSwatchActive : {}),
            }}
          >
            {value.color === color.hex && (
              <span style={styles.checkmark}>✓</span>
            )}
          </button>
        </Tooltip>
      ))}
    </div>
  );
}

// ============================================================
// STEP 3: FINISH SELECTOR (Circular swatches like Spline Copilot)
// ============================================================

function FinishSelector({ value, onChange }: any) {
  const [hoveredFinish, setHoveredFinish] = useState<MaterialFinish | null>(null);

  const finishes: { id: MaterialFinish; label: string; style: React.CSSProperties; variations: any[] }[] = [
    {
      id: 'glossy',
      label: 'Glossy',
      style: {
        background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2), inset 0 2px 3px rgba(255,255,255,0.5)',
      },
      variations: []
    },
    {
      id: 'matte',
      label: 'Matte',
      style: {
        background: '#666',
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)',
      },
      variations: []
    },
    {
      id: 'chrome',
      label: 'Chrome',
      style: {
        background: 'linear-gradient(135deg, #f0f0f0 0%, #999 50%, #666 100%)',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255,255,255,0.7)',
      },
      variations: []
    },
    {
      id: 'brushed',
      label: 'Brushed',
      style: {
        background: 'linear-gradient(90deg, #888 0%, #aaa 50%, #888 100%)',
        backgroundSize: '200% 100%',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
      },
      variations: []
    },
    {
      id: 'satin',
      label: 'Satin',
      style: {
        background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
        backgroundColor: '#999',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255,255,255,0.3)',
      },
      variations: []
    },
  ];

  return (
    <div style={styles.finishContainer}>
      {finishes.map((finish) => (
        <div
          key={finish.id}
          style={styles.finishWrapper}
          onMouseEnter={() => setHoveredFinish(finish.id)}
          onMouseLeave={() => setHoveredFinish(null)}
        >
          <Tooltip content={finish.label} position="top">
            <button
              onClick={() => onChange({ ...value, finish: finish.id })}
              style={{
                ...styles.finishSwatch,
                ...finish.style,
                ...(value.finish === finish.id ? styles.finishSwatchActive : {}),
              }}
            >
              {value.finish === finish.id && (
                <div style={styles.activeIndicator}>✓</div>
              )}
            </button>
          </Tooltip>
          <span style={styles.finishLabel}>{finish.label}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// STEP 4: PATTERN SELECTOR
// ============================================================

function PatternSelector({ value, onChange }: any) {
  const patterns = [
    { id: 'none', label: 'No Pattern', noisy: false },
    { id: 'stripes', label: 'Stripes', noisy: false },
    { id: 'chevron', label: 'Chevron', noisy: false },
    { id: 'tiger', label: 'Tiger Stripes', noisy: true },
    { id: 'camo', label: 'Camouflage', noisy: true },
    { id: 'carbon_fiber', label: 'Carbon Fiber', noisy: false },
    { id: 'carbon_fiber_heavy', label: 'Carbon Fiber (Heavy)', noisy: true },
    { id: 'flames', label: 'Flames', noisy: false },
    { id: 'cracked', label: 'Cracked', noisy: true },
    { id: 'geometric', label: 'Geometric', noisy: false },
  ];

  return (
    <div style={styles.patternGrid}>
      {patterns.map((pattern) => (
        <Tooltip
          key={pattern.id}
          content={pattern.noisy ? `${pattern.label} (Logo will be skipped)` : pattern.label}
          position="top"
        >
          <button
            onClick={() => onChange({ ...value, pattern: pattern.id })}
            style={{
              ...styles.patternCard,
              ...(value.pattern === pattern.id ? styles.patternCardActive : {}),
              ...(pattern.noisy ? styles.patternCardNoisy : {}),
            }}
          >
            <div style={styles.patternPreview}>
              {pattern.id === 'none' ? '○' : '▦'}
            </div>
            <div style={styles.patternLabel}>
              {pattern.label}
              {pattern.noisy && <span style={styles.noisyBadge}>⚠️</span>}
            </div>
          </button>
        </Tooltip>
      ))}
    </div>
  );
}

// ============================================================
// STEP 5: LOGO UPLOADER
// ============================================================

function LogoUploader({ value, onChange }: any) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange({ ...value, logo: file });
    }
  };

  return (
    <div style={styles.logoUploader}>
      <div style={styles.logoDropzone}>
        {value.logo ? (
          <div style={styles.logoPreview}>
            <div style={styles.logoIcon}>📷</div>
            <div style={styles.logoName}>{value.logo.name}</div>
            <button
              onClick={() => onChange({ ...value, logo: undefined })}
              style={styles.logoRemove}
            >
              Remove
            </button>
          </div>
        ) : (
          <label htmlFor="logo-upload" style={styles.logoLabel}>
            <div style={styles.logoIcon}>⬆️</div>
            <div style={styles.logoText}>Click to upload logo</div>
            <div style={styles.logoHint}>PNG, JPG, SVG (max 2MB)</div>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={styles.logoInput}
            />
          </label>
        )}
      </div>

      <div style={styles.logoPosition}>
        <h4 style={styles.logoPositionTitle}>Logo Position</h4>
        <div style={styles.logoPositionGrid}>
          {['left', 'right', 'both'].map((pos) => (
            <button key={pos} style={styles.logoPositionButton}>
              {pos.charAt(0).toUpperCase() + pos.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '32px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  // Stepper
  stepper: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '48px',
    position: 'relative',
  },

  stepIndicator: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    position: 'relative',
    opacity: 0.4,
    transition: 'opacity 0.3s ease',
  },

  stepActive: {
    opacity: 1,
  },

  stepCompleted: {
    opacity: 0.7,
  },

  stepNumber: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#ddd',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: '16px',
  },

  stepLabel: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#666',
    textAlign: 'center',
  },

  // Step Content
  stepContent: {
    minHeight: '400px',
    marginBottom: '32px',
  },

  stepTitle: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '8px',
    color: '#1a1a1a',
  },

  stepDescription: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '32px',
  },

  // Zone Selector
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '16px',
  },

  zoneCard: {
    padding: '24px',
    border: '2px solid #ddd',
    borderRadius: '12px',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },

  zoneCardActive: {
    borderColor: '#001f3f',
    background: '#f0f8ff',
    transform: 'scale(1.05)',
  },

  zoneIcon: {
    fontSize: '32px',
  },

  zoneLabel: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1a1a1a',
  },

  // Color Picker
  colorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
    gap: '16px',
    maxWidth: '600px',
  },

  colorSwatch: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },

  colorSwatchActive: {
    transform: 'scale(1.15)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.3), 0 0 0 4px rgba(0, 31, 63, 0.2)',
  },

  checkmark: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
  },

  // Finish Selector
  finishContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    paddingTop: '40px',
    flexWrap: 'wrap',
  },

  finishWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },

  finishSwatch: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '3px solid #ddd',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  finishSwatchActive: {
    transform: 'scale(1.2)',
    borderColor: '#001f3f',
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
  },

  finishLabel: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#666',
  },

  activeIndicator: {
    position: 'absolute',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
  },

  // Pattern Selector
  patternGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '16px',
  },

  patternCard: {
    padding: '20px',
    border: '2px solid #ddd',
    borderRadius: '12px',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },

  patternCardActive: {
    borderColor: '#001f3f',
    background: '#f0f8ff',
  },

  patternCardNoisy: {
    borderColor: '#ff9800',
  },

  patternPreview: {
    fontSize: '48px',
    opacity: 0.6,
  },

  patternLabel: {
    fontSize: '13px',
    fontWeight: 500,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  noisyBadge: {
    fontSize: '12px',
  },

  // Logo Uploader
  logoUploader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },

  logoDropzone: {
    border: '2px dashed #ddd',
    borderRadius: '12px',
    padding: '48px',
    textAlign: 'center',
    background: '#fafafa',
  },

  logoLabel: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },

  logoIcon: {
    fontSize: '48px',
  },

  logoText: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#1a1a1a',
  },

  logoHint: {
    fontSize: '12px',
    color: '#999',
  },

  logoInput: {
    display: 'none',
  },

  logoPreview: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },

  logoName: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#666',
  },

  logoRemove: {
    padding: '8px 16px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '13px',
  },

  logoPosition: {
    padding: '24px',
    border: '1px solid #ddd',
    borderRadius: '12px',
    background: 'white',
  },

  logoPositionTitle: {
    margin: '0 0 16px 0',
    fontSize: '14px',
    fontWeight: 600,
    color: '#1a1a1a',
  },

  logoPositionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },

  logoPositionButton: {
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },

  // Navigation
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
  },

  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
  },

  buttonPrimary: {
    background: '#001f3f',
    color: 'white',
  },

  buttonSecondary: {
    background: 'white',
    color: '#001f3f',
    border: '2px solid #001f3f',
  },

  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  // Notice
  notice: {
    marginTop: '24px',
    padding: '16px',
    background: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#856404',
    textAlign: 'center',
  },
};
