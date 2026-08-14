import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Bell,
  Sliders,
  Database,
  Users,
  CheckCircle2,
  Lock,
  Cpu,
  RefreshCw,
  ExternalLink,
  Zap
} from 'lucide-react';
import { MOCK_ALERT_THRESHOLDS } from '../../data/mockEnterpriseData';
import { AlertThresholdConfig } from '../../types/enterprise';
import { fetchSettingsData, updateSetting } from '../../services/api';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'thresholds' | 'org' | 'integrations' | 'ai'>('thresholds');
  const [thresholds, setThresholds] = useState<AlertThresholdConfig[]>(MOCK_ALERT_THRESHOLDS);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchSettingsData()
      .then((data) => {
        if (data.thresholds && data.thresholds.length > 0) {
          setThresholds(data.thresholds);
        }
      })
      .catch((err) => {
        console.warn('Fallback to local settings cache:', err);
      });
  }, []);

  const handleToggleThreshold = async (id: string) => {
    const target = thresholds.find((t) => t.id === id);
    const newEnabled = target ? !target.enabled : true;
    setThresholds((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: newEnabled } : t))
    );
    try {
      await updateSetting(id, { enabled: newEnabled });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setSaveSuccess(true);
    try {
      for (const t of thresholds) {
        await updateSetting(t.id, { enabled: t.enabled, currentThreshold: t.currentThreshold });
      }
    } catch (err) {
      console.error(err);
    }
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 lg:p-8 pb-32">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
                Enterprise & System Settings
              </h1>
              <p className="text-xs text-slate-400">
                Configure AI autonomous thresholds, gateway preferences, alert sensitivity, and integration hooks.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-blue-600/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Operational settings saved and distributed across live AI agents.</span>
        </div>
      )}

      {/* SETTINGS TABS */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto">
        {[
          { id: 'thresholds', label: 'Alert & Trigger Thresholds', icon: Sliders },
          { id: 'ai', label: 'Autonomous AI Permissions', icon: Cpu },
          { id: 'integrations', label: 'TMS & Telemetry Integrations', icon: Database },
          { id: 'org', label: 'Organization & Gateways', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: THRESHOLDS */}
      {activeTab === 'thresholds' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800/80 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Live Alert & Automation Triggers</h3>
              <p className="text-xs text-slate-400">Define operational sensitivity boundaries for exception detection</p>
            </div>

            <div className="space-y-3">
              {thresholds.map((th) => (
                <div
                  key={th.id}
                  className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{th.name}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                        th.level === 'High'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : th.level === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {th.level} Severity
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{th.description}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-[#090D16] px-3 py-1.5 rounded-lg border border-slate-700/80">
                      <span className="text-xs font-mono-code font-bold text-white">{th.currentThreshold}</span>
                    </div>

                    <button
                      onClick={() => handleToggleThreshold(th.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        th.enabled ? 'bg-blue-600' : 'bg-slate-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          th.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: AUTONOMOUS AI PERMISSIONS */}
      {activeTab === 'ai' && (
        <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800/80 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Smart Staff AI Governance & Safeguards</h3>
            <p className="text-xs text-slate-400">Configure autonomous action permissions for AI agents</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Autonomous Reroute Execution</span>
                <span className="text-[10px] text-emerald-400 font-medium">Authorized (&lt; $5,000)</span>
              </div>
              <p className="text-[11px] text-slate-400">Permit Sentinel & Optimizer agents to reroute delayed containers automatically when budget impact is within approved limits.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">VIP Pre-Clearance Triggering</span>
                <span className="text-[10px] text-emerald-400 font-medium">Active (Green Lane)</span>
              </div>
              <p className="text-[11px] text-slate-400">Allows digital green lane customs documents to be filed immediately when terminal queues surpass 2 days.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: INTEGRATIONS */}
      {activeTab === 'integrations' && (
        <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800/80 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Connected Systems & Data Connectors</h3>
            <p className="text-xs text-slate-400">Active enterprise TMS, WMS, and satellite AIS feeds</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">SAP Transportation Mgmt</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-[11px] text-slate-400">Syncing active container milestones every 60s.</p>
              <div className="text-[10px] text-slate-500 font-mono-code">Status: Connected (200 OK)</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Satellite AIS Vessel Feed</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-[11px] text-slate-400">Live oceanic vessel coordinates and weather vectors.</p>
              <div className="text-[10px] text-slate-500 font-mono-code">Status: Streaming Live</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Port Community Systems</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-[11px] text-slate-400">Rotterdam, Shanghai, and LAX gate terminal telemetry.</p>
              <div className="text-[10px] text-slate-500 font-mono-code">Status: Polling Active</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ORGANIZATION */}
      {activeTab === 'org' && (
        <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800/80 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Organization Profile & Primary Gateways</h3>
            <p className="text-xs text-slate-400">Enterprise operational headquarters and tenant configurations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Organization Tenant</label>
              <input
                type="text"
                disabled
                value="Odyssey Global Logistics Corp"
                className="w-full px-3 py-2 bg-[#0B0F19] border border-slate-800 rounded-xl text-xs text-slate-300 font-mono-code"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Reporting Currency</label>
              <input
                type="text"
                disabled
                value="USD ($) - United States Dollar"
                className="w-full px-3 py-2 bg-[#0B0F19] border border-slate-800 rounded-xl text-xs text-slate-300 font-mono-code"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
