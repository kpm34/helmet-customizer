'use client';

import { useState } from 'react';
import { useHelmetStore, type HelmetZone } from '@/store/helmetStore';
import { ColorPicker } from './ColorPicker';
import { FinishSelector } from './FinishSelector';
import { ZONE_LABELS, ZONE_DESCRIPTIONS } from '@/lib/helmetConfig';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';

type TabId = 'colors' | 'finishes' | 'patterns' | 'presets';

interface TabConfig {
  id: TabId;
  label: string;
}

const tabs: TabConfig[] = [
  { id: 'colors', label: 'Colors' },
  { id: 'finishes', label: 'Finishes' },
  { id: 'patterns', label: 'Patterns' },
  { id: 'presets', label: 'Presets' },
];

export function CustomizationPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('colors');
  const [activeZone, setActiveZone] = useState<HelmetZone>('shell');

  const { config, setZoneColor, setZoneFinish } = useHelmetStore();

  const zones: HelmetZone[] = ['shell', 'facemask', 'chinstrap', 'padding', 'hardware'];

  if (isCollapsed) {
    return (
      <div className="fixed right-0 top-0 h-full z-20 flex items-center">
        <button
          onClick={() => setIsCollapsed(false)}
          className="bg-gray-900 border-l border-gray-700 p-3 rounded-l-lg hover:bg-gray-800 transition-colors"
          title="Open customization panel"
        >
          <PanelRightOpen className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    );
  }

  const currentZoneConfig = config[activeZone];

  return (
    <div
      className="fixed right-0 top-0 h-full w-96 z-20 flex flex-col shadow-2xl"
      style={{
        background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)',
      }}
    >
      {/* Header */}
      <header className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
        <h1
          className="text-xl font-semibold m-0"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Helmet Customizer
        </h1>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          title="Collapse panel"
        >
          <PanelRightClose className="w-5 h-5 text-gray-400" />
        </button>
      </header>

      {/* Tab Navigation - Pill Style */}
      <nav
        className="flex gap-1 p-3 m-4 rounded-full shadow-md"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        }}
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            className="flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all duration-200"
            style={{
              background: activeTab === tab.id ? '#87CEEB' : 'transparent',
              color: activeTab === tab.id ? '#001f3f' : '#ffffff',
              opacity: activeTab === tab.id ? 1 : 0.6,
              fontWeight: activeTab === tab.id ? 600 : 500,
              boxShadow:
                activeTab === tab.id ? '0 2px 6px rgba(135, 206, 235, 0.4)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Zone Selector - Horizontal Pills */}
      <div className="px-4 pb-4">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
          Select Zone
        </div>
        <div className="flex flex-wrap gap-2">
          {zones.map((zone) => (
            <button
              key={zone}
              onClick={() => setActiveZone(zone)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border"
              style={{
                background: activeZone === zone ? config[zone].color : 'rgba(255, 255, 255, 0.05)',
                borderColor: activeZone === zone ? config[zone].color : 'rgba(255, 255, 255, 0.1)',
                color: activeZone === zone ? '#000000' : '#ffffff',
                boxShadow:
                  activeZone === zone
                    ? `0 0 10px ${config[zone].color}40`
                    : 'none',
              }}
            >
              {ZONE_LABELS[zone]}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <main
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-24"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#4a5568 #1a202c',
        }}
      >
        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div className="space-y-4">
            <div className="bg-gray-900/30 rounded-lg p-4 border border-gray-700/50">
              <div className="text-sm font-medium text-gray-300 mb-1">
                {ZONE_LABELS[activeZone]}
              </div>
              <div className="text-xs text-gray-500 mb-4">
                {ZONE_DESCRIPTIONS[activeZone]}
              </div>
              <ColorPicker
                value={currentZoneConfig.color}
                onChange={(color) => setZoneColor(activeZone, color)}
              />
            </div>
          </div>
        )}

        {/* Finishes Tab */}
        {activeTab === 'finishes' && (
          <div className="space-y-4">
            <div className="bg-gray-900/30 rounded-lg p-4 border border-gray-700/50">
              <div className="text-sm font-medium text-gray-300 mb-1">
                {ZONE_LABELS[activeZone]}
              </div>
              <div className="text-xs text-gray-500 mb-4">
                {ZONE_DESCRIPTIONS[activeZone]}
              </div>
              <FinishSelector
                value={currentZoneConfig.finish}
                onChange={(finish) => setZoneFinish(activeZone, finish)}
              />
            </div>
          </div>
        )}

        {/* Patterns Tab */}
        {activeTab === 'patterns' && (
          <div className="bg-gray-900/30 rounded-lg p-4 border border-gray-700/50">
            <div className="text-sm text-gray-400 text-center py-8">
              Pattern system coming soon...
            </div>
          </div>
        )}

        {/* Presets Tab */}
        {activeTab === 'presets' && (
          <div className="bg-gray-900/30 rounded-lg p-4 border border-gray-700/50">
            <div className="text-sm text-gray-400 text-center py-8">
              Team presets coming soon...
            </div>
          </div>
        )}
      </main>

      {/* Footer Actions - Fixed */}
      <div
        className="p-4 border-t border-gray-700"
        style={{
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <button
          onClick={() => useHelmetStore.getState().resetToDefaults()}
          className="w-full px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-600 transition-all duration-200 font-medium text-sm"
        >
          Reset to Defaults
        </button>
        <div className="text-xs text-gray-500 text-center mt-2">
          5-Zone Customization System
        </div>
      </div>
    </div>
  );
}
