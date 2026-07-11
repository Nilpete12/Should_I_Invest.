'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown'; // Run: npm install react-markdown

export default function Home() {
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleResearch = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong while compiling the report.');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Autonomous AI Investment Agent
          </h1>
          <p className="text-slate-400 text-lg">
            Powered by LangGraph.js & Gemini 2.5 Flash
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleResearch} className="flex gap-4 bg-slate-800 p-4 rounded-xl shadow-md">
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name or ticker (e.g., Apple, Tesla, NVDA)..."
            disabled={loading}
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? 'Analyzing...' : 'Run Analysis'}
          </button>
        </form>

        {/* Error State Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State Skeleton */}
        {loading && (
          <div className="bg-slate-800 p-6 rounded-xl animate-pulse space-y-4">
            <div className="h-6 bg-slate-700 rounded w-1/4"></div>
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-700 rounded w-5/6"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
          </div>
        )}

        {/* Results Render Area */}
        {result && (
          <div className="space-y-6">
            {/* Top Insight Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Resolved Ticker</span>
                <span className="text-2xl font-bold text-teal-400">{result.ticker}</span>
              </div>
              
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center md:col-span-2">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Final Thesis Verdict</span>
                <span className={`text-2xl font-black ${result.decision === 'INVEST' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {result.decision}
                </span>
              </div>
            </div>

            {/* Comprehensive Intelligence Brief (Markdown Output) */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 prose prose-invert max-w-none shadow-xl">
              <ReactMarkdown>{result.report}</ReactMarkdown>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}