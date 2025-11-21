'use client';

import { useHelmetStore, type HelmetZone } from '@/store/helmetStore';
import { ZONE_LABELS, ZONE_DESCRIPTIONS } from '@/lib/constants';
import { Tooltip } from './Tooltip';
import { tokens } from '@/lib/design/tokens';

interface ZoneTabsProps {
  activeZone: HelmetZone;
  onZoneChange: (zone: HelmetZone) => void;
  currentStep?: number; // Optional: filter zones based on step
}

export function ZoneTabs({ activeZone, onZoneChange, currentStep }: ZoneTabsProps) {
  const { config } = useHelmetStore();

  // All zones for steps 1-2 (Color, Finish), limited zones for steps 3-4 (Pattern, Logo)
  const allZones: HelmetZone[] = ['shell', 'facemask', 'chinstrap', 'padding', 'hardware'];
  const limitedZones: HelmetZone[] = ['shell', 'facemask', 'chinstrap'];

  // If currentStep is 3 or 4, only show shell, facemask, chinstrap
  const zones: HelmetZone[] = currentStep && currentStep >= 3 ? limitedZones : allZones;

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide">
        Select Zone to Customize
      </label>

      <div className="grid grid-cols-2 gap-2">
        {zones.map((zone) => {
          const isActive = activeZone === zone;
          const zoneColor = config[zone].color;
          const zoneFinish = config[zone].finish;

          return (
            <Tooltip
              key={zone}
              content={
                <div className="space-y-1">
                  <div className="font-semibold">{ZONE_LABELS[zone]}</div>
                  <div className="text-[11px] opacity-90">{ZONE_DESCRIPTIONS[zone]}</div>
                  <div className="text-[10px] opacity-75 border-t border-white/20 pt-1 mt-1">
                    Finish: {zoneFinish}
                  </div>
                </div>
              }
              position="top"
            >
              <button
                onClick={() => onZoneChange(zone)}
                className={`
                  relative w-full px-3 py-3 rounded-lg text-xs font-medium transition-all duration-200
                  border-2 group overflow-hidden
                  ${
                    isActive
                      ? 'border-blue-500 bg-blue-500/10 text-white shadow-lg shadow-blue-500/20 scale-105'
                      : 'border-gray-700 bg-gray-800/30 text-gray-400 hover:border-gray-600 hover:bg-gray-800/50 hover:scale-102'
                  }
                `}
                style={{
                  boxShadow: isActive ? `0 0 20px ${tokens.colors.accent.blue}30` : undefined,
                }}
              >
                {/* Color indicator */}
                <div
                  className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-white/20"
                  style={{
                    backgroundColor: zoneColor,
                    boxShadow: `0 0 8px ${zoneColor}40`,
                  }}
                />

                {/* Zone label */}
                <div className={`text-left ${isActive ? 'font-semibold' : ''}`}>
                  {ZONE_LABELS[zone]}
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-b-md" />
                )}
              </button>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
