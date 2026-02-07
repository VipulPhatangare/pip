// Repository Analyzer Component
import React, { useState } from 'react';
import { GitBranch, Search, Loader, AlertCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

const RepoAnalyzer = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    // Basic GitHub URL validation
    if (!repoUrl.includes('github.com')) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch('https://synthomind.cloud/webhook-test/pip-repo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl: repoUrl.trim() })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received response:', data);
      
      // Handle different response formats
      let analysisData;
      if (Array.isArray(data)) {
        analysisData = data[0];
      } else if (data && typeof data === 'object') {
        analysisData = data;
      } else {
        throw new Error('Invalid response format received');
      }
      
      console.log('Analysis data:', analysisData);
      
      if (!analysisData || !analysisData.summary) {
        throw new Error('Invalid analysis data structure received');
      }
      
      setAnalysis(analysisData);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze repository. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getReadinessColor = (readiness) => {
    switch (readiness?.toLowerCase()) {
      case 'high': return 'text-green-400 bg-green-900/30 border-green-600';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30 border-yellow-600';
      case 'low': return 'text-red-400 bg-red-900/30 border-red-600';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-600';
    }
  };

  const getTierColor = (tier) => {
    const colors = {
      'A': 'border-indigo-500 bg-indigo-900/20',
      'B': 'border-purple-500 bg-purple-900/20',
      'C': 'border-pink-500 bg-pink-900/20',
      'D': 'border-red-500 bg-red-900/20'
    };
    return colors[tier] || 'border-gray-500 bg-gray-900/20';
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <GitBranch className="w-6 h-6 text-white" />
          </div>
          Repository Analyzer
        </h2>
        <p className="text-gray-400 text-sm">
          Analyze any public GitHub repository to get Protean Interface Protocol conversion suggestions
        </p>
      </div>

      {/* Input Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          GitHub Repository URL
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            placeholder="https://github.com/username/repository"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            disabled={loading}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-semibold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Analyze
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-900/30 border-2 border-red-500 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-300 mb-1">Analysis Error</h4>
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Loading Animation */}
      {loading && (
        <div className="mb-6 bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-12 h-12 text-cyan-400 animate-spin" />
            <p className="text-gray-300 font-medium">Analyzing repository structure...</p>
            <p className="text-gray-500 text-sm">This may take a few moments</p>
          </div>
        </div>
      )}

      {/* Debug Info (only show in development) */}
      {analysis && import.meta.env.DEV && (
        <div className="mb-4 p-3 bg-blue-900/30 border border-blue-500 rounded-lg text-xs">
          <details>
            <summary className="cursor-pointer font-semibold text-blue-300">Debug: Raw Response Data</summary>
            <pre className="mt-2 overflow-auto text-blue-200 max-h-64">
              {JSON.stringify(analysis, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && analysis.summary && (
        <div className="space-y-6">
          {/* Summary Section */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              Analysis Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Project Type</label>
                <div className="bg-gray-900 rounded px-3 py-2 font-medium text-cyan-300">
                  {analysis.summary.projectType || 'Unknown'}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Protean Readiness</label>
                <div className={`rounded px-3 py-2 font-bold uppercase border-2 ${getReadinessColor(analysis.summary.proteanReadiness)}`}>
                  {analysis.summary.proteanReadiness || 'Unknown'}
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Overall Assessment</label>
              <div className="bg-gray-900 rounded p-4 text-sm text-gray-300 leading-relaxed">
                {analysis.summary.overallAssessment || 'No assessment available'}
              </div>
            </div>
          </div>

          {/* Architecture Assessment */}
          {analysis.architectureAssessment && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('architecture')}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-750 transition-colors"
              >
                <h3 className="text-lg font-bold flex items-center gap-2">
                  Architecture Assessment
                </h3>
                {expandedSections.architecture ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              
              {expandedSections.architecture && (
                <div className="px-5 pb-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Frontend Stack</label>
                      <div className="bg-gray-900 rounded px-3 py-2 text-sm">{analysis.architectureAssessment.frontendStack || 'N/A'}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">UI Complexity</label>
                      <div className="bg-gray-900 rounded px-3 py-2 text-sm capitalize">{analysis.architectureAssessment.uiComplexity || 'N/A'}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Routing Complexity</label>
                      <div className="bg-gray-900 rounded px-3 py-2 text-sm capitalize">{analysis.architectureAssessment.routingComplexity || 'N/A'}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Asset Weight Risk</label>
                      <div className={`rounded px-3 py-2 text-sm font-semibold capitalize ${
                        analysis.architectureAssessment.assetWeightRisk === 'high' ? 'bg-red-900/30 text-red-300' :
                        analysis.architectureAssessment.assetWeightRisk === 'medium' ? 'bg-yellow-900/30 text-yellow-300' :
                        'bg-green-900/30 text-green-300'
                      }`}>
                        {analysis.architectureAssessment.assetWeightRisk || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {analysis.architectureAssessment.notableObservations && analysis.architectureAssessment.notableObservations.length > 0 && (
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Notable Observations</label>
                      <ul className="bg-gray-900 rounded p-4 space-y-2">
                        {analysis.architectureAssessment.notableObservations.map((obs, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex gap-2">
                            <span className="text-cyan-400">•</span>
                            <span>{obs}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tier Analysis */}
          {analysis.tierAnalysis && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('tiers')}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-750 transition-colors"
              >
                <h3 className="text-lg font-bold flex items-center gap-2">
                  Tier-by-Tier Recommendations
                </h3>
                {expandedSections.tiers ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              
              {expandedSections.tiers && (
                <div className="px-5 pb-5 space-y-4">
                  {['A', 'B', 'C', 'D'].map((tier) => {
                    const tierData = analysis.tierAnalysis[tier];
                    if (!tierData) return null;
                    
                    return (
                      <div key={tier} className={`border-2 rounded-lg p-4 ${getTierColor(tier)}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center font-bold text-xl">
                            {tier}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">{tierData.description}</h4>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {tierData.retain && tierData.retain.length > 0 && (
                            <div>
                              <label className="text-xs font-semibold text-green-300 mb-1 block">✓ RETAIN</label>
                              <ul className="bg-gray-900/50 rounded p-3 space-y-1">
                                {tierData.retain.map((item, idx) => (
                                  <li key={idx} className="text-sm text-gray-300 flex gap-2">
                                    <span className="text-green-400">▸</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {tierData.reduceOrDisable && tierData.reduceOrDisable.length > 0 && (
                            <div>
                              <label className="text-xs font-semibold text-orange-300 mb-1 block">⚠ REDUCE OR DISABLE</label>
                              <ul className="bg-gray-900/50 rounded p-3 space-y-1">
                                {tierData.reduceOrDisable.map((item, idx) => (
                                  <li key={idx} className="text-sm text-gray-300 flex gap-2">
                                    <span className="text-orange-400">▸</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {tierData.notes && (
                            <div className="bg-gray-900/50 rounded p-3 text-sm text-gray-400 italic">
                              💡 {tierData.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Risks */}
          {analysis.risks && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('risks')}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-750 transition-colors"
              >
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                  Risk Assessment
                </h3>
                {expandedSections.risks ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              
              {expandedSections.risks && (
                <div className="px-5 pb-5 space-y-4">
                  {Object.entries(analysis.risks).map(([category, items]) => (
                    <div key={category}>
                      <label className="text-sm font-semibold text-orange-300 mb-2 block capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <ul className="bg-gray-900 rounded p-4 space-y-2">
                        {items.map((risk, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex gap-2">
                            <span className="text-orange-400">⚠</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Assumptions */}
          {analysis.assumptions && analysis.assumptions.length > 0 && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('assumptions')}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-750 transition-colors"
              >
                <h3 className="text-lg font-bold">Analysis Assumptions</h3>
                {expandedSections.assumptions ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              
              {expandedSections.assumptions && (
                <div className="px-5 pb-5">
                  <ul className="bg-gray-900 rounded p-4 space-y-2">
                    {analysis.assumptions.map((assumption, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex gap-2">
                        <span className="text-blue-400">ℹ</span>
                        <span>{assumption}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RepoAnalyzer;
