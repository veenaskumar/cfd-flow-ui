import React, { useState } from 'react';

const CFDAnalysis = () => {
  const [inputType, setInputType] = useState('ids'); // 'ids' or 'directory'
  const [cfdIds, setCfdIds] = useState('');
  const [directoryPath, setDirectoryPath] = useState('');
  const [analysisState, setAnalysisState] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [analysisResult, setAnalysisResult] = useState(null);

  const currentInput = inputType === 'ids' ? cfdIds : directoryPath;
  const isInputEmpty = currentInput.trim() === '';

  const runAnalysis = () => {
    setAnalysisState('loading');
    setAnalysisResult(null);

    // Mock analysis with 2-second timeout
    setTimeout(() => {
      // Simulate 80% success rate for demo
      const isSuccess = Math.random() > 0.2;

      if (isSuccess) {
        setAnalysisResult({
          timestamp: new Date().toLocaleString(),
          inputType: inputType === 'ids' ? 'CFD IDs' : 'Directory Path',
          input: currentInput,
          summary: 'Analysis completed successfully',
          details: [
            { label: 'Total CFD files processed', value: Math.floor(Math.random() * 50) + 10 },
            { label: 'Convergence rate', value: `${(Math.random() * 20 + 80).toFixed(1)}%` },
            { label: 'Average iterations', value: Math.floor(Math.random() * 1000) + 500 },
            { label: 'Max residual', value: (Math.random() * 0.001).toExponential(3) },
          ],
        });
        setAnalysisState('success');
      } else {
        setAnalysisState('error');
      }
    }, 2000);
  };

  const resetAnalysis = () => {
    setAnalysisState('idle');
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Header */}
      <div className="w-full max-w-2xl mb-8 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
          <AnalysisIcon className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
          CFD Analysis
        </h1>
        <p className="text-muted-foreground">
          Run computational fluid dynamics analysis on your data
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-2xl bg-card rounded-xl shadow-card border border-border overflow-hidden animate-slide-up">
        {analysisState === 'idle' && (
          <InputSection
            inputType={inputType}
            setInputType={setInputType}
            cfdIds={cfdIds}
            setCfdIds={setCfdIds}
            directoryPath={directoryPath}
            setDirectoryPath={setDirectoryPath}
            isInputEmpty={isInputEmpty}
            onRunAnalysis={runAnalysis}
          />
        )}

        {analysisState === 'loading' && <LoadingSection />}

        {analysisState === 'success' && (
          <ResultSection result={analysisResult} onNewAnalysis={resetAnalysis} />
        )}

        {analysisState === 'error' && (
          <ErrorSection onRetry={runAnalysis} onReset={resetAnalysis} />
        )}
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-muted-foreground animate-fade-in">
        Powered by advanced CFD simulation engine
      </p>
    </div>
  );
};

// Input Section Component
const InputSection = ({
  inputType,
  setInputType,
  cfdIds,
  setCfdIds,
  directoryPath,
  setDirectoryPath,
  isInputEmpty,
  onRunAnalysis,
}) => {
  return (
    <div className="p-6 sm:p-8">
      {/* Toggle */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">
          Input Method
        </label>
        <div className="flex bg-secondary rounded-lg p-1">
          <ToggleButton
            active={inputType === 'ids'}
            onClick={() => setInputType('ids')}
          >
            <FileIcon className="w-4 h-4 mr-2" />
            CFD IDs
          </ToggleButton>
          <ToggleButton
            active={inputType === 'directory'}
            onClick={() => setInputType('directory')}
          >
            <FolderIcon className="w-4 h-4 mr-2" />
            Directory Path
          </ToggleButton>
        </div>
      </div>

      {/* Input Fields */}
      <div className="mb-6">
        {inputType === 'ids' ? (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              CFD IDs
            </label>
            <textarea
              value={cfdIds}
              onChange={(e) => setCfdIds(e.target.value)}
              placeholder="Enter CFD IDs (comma or newline separated)"
              className="w-full h-32 px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none transition-smooth"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Directory Path
            </label>
            <input
              type="text"
              value={directoryPath}
              onChange={(e) => setDirectoryPath(e.target.value)}
              placeholder="/path/to/cfd/directory"
              className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
            />
          </div>
        )}
      </div>

      {/* Run Button */}
      <button
        onClick={onRunAnalysis}
        disabled={isInputEmpty}
        className="w-full py-3 px-6 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth flex items-center justify-center"
      >
        <PlayIcon className="w-5 h-5 mr-2" />
        Run Analysis
      </button>
    </div>
  );
};

// Toggle Button Component
const ToggleButton = ({ active, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-smooth flex items-center justify-center ${
        active
          ? 'bg-card text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
};

// Loading Section Component
const LoadingSection = () => {
  return (
    <div className="p-12 flex flex-col items-center justify-center animate-fade-in">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-4 border-secondary"></div>
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      <p className="text-lg font-medium text-foreground mb-2">Analyzing CFD data…</p>
      <p className="text-sm text-muted-foreground">This may take a moment</p>
    </div>
  );
};

// Result Section Component
const ResultSection = ({ result, onNewAnalysis }) => {
  return (
    <div className="animate-fade-in">
      {/* Success Header */}
      <div className="p-6 bg-success/10 border-b border-success/20 flex items-center">
        <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center mr-4">
          <CheckIcon className="w-5 h-5 text-success" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Analysis Complete</h3>
          <p className="text-sm text-muted-foreground">{result.timestamp}</p>
        </div>
      </div>

      {/* Result Details */}
      <div className="p-6 sm:p-8">
        <div className="mb-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Input</h4>
          <p className="text-foreground bg-secondary px-3 py-2 rounded-md text-sm font-mono break-all">
            {result.input.length > 100 ? result.input.substring(0, 100) + '...' : result.input}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {result.details.map((detail, index) => (
            <div key={index} className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">{detail.label}</p>
              <p className="text-lg font-semibold text-foreground">{detail.value}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onNewAnalysis}
          className="w-full py-3 px-6 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-smooth flex items-center justify-center"
        >
          <RefreshIcon className="w-5 h-5 mr-2" />
          New Analysis
        </button>
      </div>
    </div>
  );
};

// Error Section Component
const ErrorSection = ({ onRetry, onReset }) => {
  return (
    <div className="p-8 flex flex-col items-center justify-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <ErrorIcon className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Analysis Failed</h3>
      <p className="text-muted-foreground text-center mb-6">
        An error occurred during analysis. Please retry.
      </p>
      <div className="flex gap-3 w-full max-w-xs">
        <button
          onClick={onReset}
          className="flex-1 py-3 px-4 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-smooth"
        >
          Back
        </button>
        <button
          onClick={onRetry}
          className="flex-1 py-3 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-smooth flex items-center justify-center"
        >
          <RefreshIcon className="w-4 h-4 mr-2" />
          Retry
        </button>
      </div>
    </div>
  );
};

// Icons
const AnalysisIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const FileIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const FolderIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const PlayIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ErrorIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RefreshIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

export default CFDAnalysis;
