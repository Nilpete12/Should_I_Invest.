'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

// Utility helper to clean up raw figures into professional Wall Street notation
function formatFinancialMetric(value, type) {
  if (value === 'N/A' || value === undefined || value === null) return 'N/A';
  const num = Number(value);
  if (isNaN(num)) return value;

  if (type === 'currency') {
    if (num >= 1.0e12) return `$ ${(num / 1.0e12).toFixed(2)} T`;
    if (num >= 1.0e9) return `$ ${(num / 1.0e9).toFixed(2)} B`;
    if (num >= 1.0e6) return `$ ${(num / 1.0e6).toFixed(2)} M`;
    return `$ ${num.toLocaleString()}`;
  }
  
  if (type === 'percentage') {
    // Corrects for decimals (0.15 -> 15.00%) vs pre-formatted rates
    const multiplier = Math.abs(num) < 1 ? 100 : 1;
    return `${(num * multiplier).toFixed(2)}%`;
  }

  if (type === 'ratio') {
    return num.toFixed(2);
  }

  return num.toLocaleString();
}

export default function Home() {
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  // Market Ticker State
  const [marketWatch, setMarketWatch] = useState([]);

  // Fetch real-time values from our watch endpoint on load
  useEffect(() => {
    fetch('/api/market-watch')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setMarketWatch(data.marketData);
      })
      .catch((err) => console.error("Market watch retrieval error:", err));
  }, []);

  const handleResearch = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setLoading(true);
    setHasSearched(true); // Triggers the animated layout transition upwards
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to compute research graph payload.');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-400">
      
      {/* Seamless Custom Infinite Loop Ticker Ribbon */}
      <div className="w-full bg-[#131a2e] border-b border-slate-800 text-xs py-2.5 overflow-hidden shadow-sm flex">
        {marketWatch.length > 0 ? (
          /* 
            The Seamless Magic: We adjust animation duration to 45s to account for the wider list.
            We use flex-nowrap and duplicate the array inline inside the flex row.
          */
          <div className="flex flex-nowrap whitespace-nowrap gap-8 animate-[marquee_45s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer pr-8">
            
            {/* Set 1: The Initial 10 Companies */}
            {marketWatch.map((stock) => (
              <div key={`set1-${stock.ticker}`} className="flex items-center gap-2 bg-[#1b243d] px-3 py-1 rounded-md border border-slate-700/40 shrink-0">
                <span className="font-bold text-slate-300">{stock.ticker}</span>
                <span className="font-mono text-slate-200">${stock.price.toFixed(2)}</span>
                <span className={`font-mono text-xs ${stock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stock.changePercent >= 0 ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
                </span>
              </div>
            ))}

            {/* Set 2: The Carbon Copy Duplicate for Seamless Transition */}
            {marketWatch.map((stock) => (
              <div key={`set2-${stock.ticker}`} className="flex items-center gap-2 bg-[#1b243d] px-3 py-1 rounded-md border border-slate-700/40 shrink-0">
                <span className="font-bold text-slate-300">{stock.ticker}</span>
                <span className="font-mono text-slate-200">${stock.price.toFixed(2)}</span>
                <span className={`font-mono text-xs ${stock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stock.changePercent >= 0 ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
                </span>
              </div>
            ))}

          </div>
        ) : (
          <div className="text-slate-500 italic px-4 py-1">Streaming core market indexes from Yahoo Finance...</div>
        )}
      </div>

      {/* Main Structural Space with Conditional Spacing Transformations */}
      <div className={`flex-1 flex flex-col items-center transition-all duration-700 ease-in-out px-4 pb-12 ${
        hasSearched ? 'pt-8 justify-start' : 'justify-center -mt-16'
      }`}>
        
        {/* Platform Hero Area */}
        <div className={`text-center space-y-3 transition-all duration-700 max-w-2xl ${
          hasSearched ? 'opacity-0 h-0 overflow-hidden scale-95 mb-0' : 'opacity-100 mb-8 scale-100'
        }`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide">
            STATEFUL AGENT WORKFLOW ENGINE
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Should - I - Invest?
          </h1>
          <p className="text-slate-400 text-base md:text-lg font-medium">
            Autonomous AI investment agent
          </p>
          <p className="text-slate-400 text-base md:text-sm font-medium max-w-lg mx-auto leading-relaxed">
            Submit any enterprise asset to command an autonomous multi-agent analysis loop executing real-time data auditing.
          </p>
        </div>

        {/* Animated Elastic Search Console Container */}
        <div className="w-full max-w-3xl transition-all duration-500">
          <form onSubmit={handleResearch} className="relative group bg-[#131a2e]/80 backdrop-blur-xl p-2 rounded-2xl border border-slate-800 hover:border-slate-700 shadow-2xl focus-within:ring-2 focus-within:ring-emerald-500/40 transition-all">
            <div className="flex items-center">
              <div className="pl-4 text-slate-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Audit a market equity... (e.g., Apple, Microsoft, Tesla)"
                disabled={loading}
                className="w-full bg-transparent border-0 outline-none text-slate-100 placeholder-slate-500 px-4 py-3.5 font-medium text-base disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !companyName.trim()}
                className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </div>
                ) : 'Run Audit'}
              </button>
            </div>
          </form>
        </div>

        {/* Error Feedback Panel */}
        {error && (
          <div className="w-full max-w-3xl mt-6 bg-rose-950/30 border border-rose-800/50 text-rose-300 p-4 rounded-xl text-sm font-medium animate-fadeIn">
            ⚠️ <strong>Execution Halt:</strong> {error}
          </div>
        )}

        {/* Loading Progress State Skeleton */}
        {loading && (
          <div className="w-full max-w-3xl mt-8 space-y-4 animate-pulse">
            <div className="h-4 bg-slate-800 rounded w-1/3"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-slate-800 rounded-xl"></div>)}
            </div>
            <div className="h-64 bg-slate-800 rounded-xl"></div>
          </div>
        )}

        {/* Finished Compilation Analysis Output Area */}
        {result && !loading && (
          <div className="w-full max-w-3xl mt-8 space-y-6 animate-fadeIn">
            
            {/* Verdict Headline Section */}
            <div className="bg-[#131a2e]/50 backdrop-blur-md rounded-2xl border border-slate-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <h2 className="text-xl font-black text-slate-200">Audit Dossier: Summary Metrics</h2>
                <p className="text-xs font-semibold text-slate-500 tracking-wide mt-0.5">TARGET EQUITY RESOLVED: <span className="text-teal-400 font-mono text-sm">{result.ticker}</span></p>
              </div>
              <div className="flex items-center gap-3 bg-[#0b0f19] px-5 py-3 rounded-xl border border-slate-800">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Verdict</span>
                <span className={`text-xl font-black px-3 py-1 rounded-md ${
                  result.decision === 'INVEST' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {result.decision}
                </span>
              </div>
            </div>

            {/* Quantitative Analytical Cards Metric Layout Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="bg-[#131a2e]/40 p-4 rounded-xl border border-slate-800/60 transition-all hover:border-slate-700/60">
                <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">Market Cap</span>
                <span className="text-lg font-bold font-mono mt-1 block text-slate-200">
                  {formatFinancialMetric(result.financials?.marketCap, 'currency')}
                </span>
              </div>

              <div className="bg-[#131a2e]/40 p-4 rounded-xl border border-slate-800/60 transition-all hover:border-slate-700/60">
                <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">Trailing P/E</span>
                <span className="text-lg font-bold font-mono mt-1 block text-slate-200">
                  {formatFinancialMetric(result.financials?.peRatio, 'ratio')}
                </span>
              </div>

              <div className="bg-[#131a2e]/40 p-4 rounded-xl border border-slate-800/60 transition-all hover:border-slate-700/60">
                <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">Revenue Growth</span>
                <span className={`text-lg font-bold font-mono mt-1 block ${
                  Number(result.financials?.revenueGrowth) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {formatFinancialMetric(result.financials?.revenueGrowth, 'percentage')}
                </span>
              </div>

              <div className="bg-[#131a2e]/40 p-4 rounded-xl border border-slate-800/60 transition-all hover:border-slate-700/60">
                <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">Free Cash Flow</span>
                <span className="text-lg font-bold font-mono mt-1 block text-slate-200">
                  {formatFinancialMetric(result.financials?.freeCashFlow, 'currency')}
                </span>
              </div>

            </div>

            {/* Qualitative Executive Context Output Brief */}
            <div className="bg-[#131a2e]/60 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-2xl prose prose-invert max-w-none">
              <ReactMarkdown>{result.report}</ReactMarkdown>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}