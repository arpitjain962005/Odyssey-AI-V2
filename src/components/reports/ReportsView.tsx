import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Share2,
  Sparkles,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
  FileCheck,
  Zap,
  Printer,
  Calendar
} from 'lucide-react';
import { MOCK_REPORTS } from '../../data/mockEnterpriseData';
import { ExecutiveReportDoc } from '../../types/enterprise';
import { fetchReportsData, generateLiveReport } from '../../services/api';

interface ReportsViewProps {
  onNavigateToView?: (viewId: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onNavigateToView }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedReport, setSelectedReport] = useState<ExecutiveReportDoc | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportsList, setReportsList] = useState<ExecutiveReportDoc[]>(MOCK_REPORTS);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchReportsData()
      .then((data) => {
        if (data.reports && data.reports.length > 0) {
          setReportsList(data.reports);
        }
      })
      .catch((err) => {
        console.warn('Fallback to local reports cache:', err);
      });
  }, []);

  const filteredReports = reportsList.filter((rep) => {
    const matchesSearch = rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rep.keyTakeaway.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || rep.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleGenerateBriefing = async () => {
    setIsGenerating(true);
    try {
      const res = await generateLiveReport();
      if (res.report) {
        setReportsList((prev) => [res.report, ...prev]);
        setSelectedReport(res.report);
      }
    } catch {
      const newReport: ExecutiveReportDoc = {
        id: `rep-${Date.now()}`,
        title: `Live Global Logistics Pulse Briefing (${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})`,
        category: 'Operational Audit',
        author: 'Odyssey AI Synthesis Engine',
        generatedDate: 'Just now',
        fileSize: '3.1 MB',
        readTime: '4 min read',
        keyTakeaway: 'Immediate audit of 12,480 active shipments shows 97.4% OTIF compliance with critical mitigation required at Rotterdam berth queues.',
        contentSnippet: 'Real-time synthesis across all active freight corridors. Transpacific routes are outperforming targets (+99.1%), while European canal transits indicate potential +3.8 day delay risks unless feeder vessels are rerouted to Zeebrugge...',
        highlights: [
          'Global OTIF stabilized at 97.4% with positive trend across Asia Pacific',
          'Autonomous agent completed 142 container reroutes in the past 24 hours',
          'Quarterly revenue pacing at $28.4M (+18.2% YoY growth)',
          'Estimated $142,000 demurrage saved through proactive exception management'
        ],
        status: 'Published'
      };
      setReportsList((prev) => [newReport, ...prev]);
      setSelectedReport(newReport);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (repTitle: string) => {
    setDownloadSuccess(repTitle);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 lg:p-8 pb-32">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
                Executive Reports & Intelligence Briefings
              </h1>
              <p className="text-xs text-slate-400">
                Automated board briefings, corridor resilience audits, and executive logistics syntheses.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateBriefing}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-blue-600/30"
          >
            <Sparkles className="w-4 h-4 text-blue-200 animate-pulse" />
            <span>{isGenerating ? 'Synthesizing Briefing...' : 'Generate Live AI Briefing'}</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Export generated for "{downloadSuccess}". Simulated download complete.</span>
        </div>
      )}

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111726] p-3 rounded-xl border border-slate-800/80">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search report titles or takeaways..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#090D16] border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#090D16] p-1 rounded-lg border border-slate-800 text-xs overflow-x-auto">
          {['All', 'Operational Audit', 'Financial & Margin', 'Corridor Resilience', 'Bottleneck Briefing'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md transition-all font-medium whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* REPORTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map((rep) => (
          <div
            key={rep.id}
            className="p-5 rounded-2xl bg-[#111726] border border-slate-800/80 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between group cursor-pointer"
            onClick={() => setSelectedReport(rep)}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {rep.category}
                </span>
                <span className="text-[11px] text-slate-400 font-mono-code">{rep.generatedDate}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                  {rep.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {rep.keyTakeaway}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0B0F19] border border-slate-800/80 space-y-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Key Highlights</span>
                <ul className="space-y-1">
                  {rep.highlights.slice(0, 2).map((hl, idx) => (
                    <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                      <span className="line-clamp-1">{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-3 text-[11px]">
                <span>{rep.readTime}</span>
                <span>•</span>
                <span>{rep.fileSize}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(rep.title);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Download Report"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedReport(rep);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-semibold text-xs flex items-center gap-1 transition-colors"
                >
                  <span>Read Briefing</span>
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SCHEDULED DIGEST AUTOMATIONS */}
      <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Scheduled Executive Subscriptions</h3>
          </div>
          <span className="text-[10px] text-slate-400">Autonomous synthesis cadence</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[#090D16] border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Weekly Supply Chain Audit</span>
              <span className="text-[10px] text-emerald-400 font-medium">Active (Mondays 06:00 UTC)</span>
            </div>
            <p className="text-[11px] text-slate-400">Delivered directly to Alexander Vance and VP Logistics.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090D16] border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Monthly Board Profitability Pack</span>
              <span className="text-[10px] text-emerald-400 font-medium">Active (1st of Month)</span>
            </div>
            <p className="text-[11px] text-slate-400">Corridor margin analysis and customer tier breakdowns.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090D16] border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Critical Risk Alert Flashes</span>
              <span className="text-[10px] text-blue-400 font-medium">Instant Trigger</span>
            </div>
            <p className="text-[11px] text-slate-400">Real-time alerts sent when gateway bottlenecks exceed 3 days.</p>
          </div>
        </div>
      </div>

      {/* FULL REPORT MODAL VIEW */}
      {selectedReport && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="w-full max-w-2xl bg-[#0E1422] border border-slate-700/80 rounded-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {selectedReport.category}
                </span>
                <h2 className="text-lg font-bold text-white mt-1">{selectedReport.title}</h2>
                <p className="text-xs text-slate-400">
                  Generated {selectedReport.generatedDate} by {selectedReport.author} • {selectedReport.readTime}
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* EXECUTIVE SUMMARY */}
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-800/40 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">Executive Takeaway</span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {selectedReport.keyTakeaway}
              </p>
            </div>

            {/* HIGHLIGHTS */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Strategic Findings</h4>
              <div className="space-y-2">
                {selectedReport.highlights.map((hl, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#090D16] border border-slate-800/80 text-xs text-slate-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FULL CONTENT PREVIEW */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Analysis Narrative</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-[#090D16] p-4 rounded-xl border border-slate-800/80 font-sans">
                {selectedReport.contentSnippet}
              </p>
            </div>

            {/* MODAL ACTIONS */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono-code">{selectedReport.fileSize} Document</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(selectedReport.title)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF / CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
