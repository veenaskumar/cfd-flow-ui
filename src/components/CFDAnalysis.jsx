import React, { useState, useRef, useEffect } from 'react';
import AnalysisResult from './AnalysisResult';

// Mock defect data generator
const generateMockDefects = () => {
  return {
    summary: {
      total: 13,
      affectingUpgrade: 10,
      criticalSevere: 5,
      moderate: 4,
      minor: 1,
    },
    criticalDefects: [
      {
        id: 'CSCwe07002',
        title: 'Downgrade Failure (APIC)',
        severity: 'Moderate',
        status: 'Verified',
        component: 'ifc-upgrade',
        impact: 'DIRECT UPGRADE IMPACT',
        description: 'Downgrade from L++ to KMR6 fails with "Installer Exited - Pre-upgrade callbacks were not completed"',
        rootCause: 'APIC AE is stuck in infinite retry loop trying to download a deleted snapshot file, preventing upgrade completion',
        affectedVersions: '5.2(5c), 6.0(1.177b)',
        workaround: 'Restart AE on each APIC one at a time',
        riskLevel: 'HIGH',
      },
      {
        id: 'CSCwr32767',
        title: 'Auto Firmware Upgrade Failure (APIC)',
        severity: 'Moderate',
        status: 'Verified',
        component: 'ifc-upgrade',
        impact: 'DIRECT UPGRADE IMPACT',
        description: 'Auto Firmware Upgrade not working for version 16.0(5h) during discovery or rediscovery of switch',
        rootCause: 'Race condition between AFU trigger and catalog loading. When switch running 16.0(5h) is discovered, the catalog doesn\'t have entries for newer versions, causing AFU to fail with "SwitchFwMo not Found"',
        affectedVersions: '16.0(5h)',
        workaround: 'Perform stateful reload of switch where AFU failed',
        riskLevel: 'HIGH',
      },
    ],
    highSeverityDefects: [
      {
        id: 'CSCws84232',
        title: 'APIC GUI Unresponsive (APIC)',
        severity: 'Severe',
        status: 'More Info Needed',
        component: 'ui',
        impact: 'INDIRECT UPGRADE IMPACT',
        description: 'APIC GUI dashboards stuck in "Loading..." due to svccoreCtrlr or svccoreNode returning over 32K entries',
        affectedVersions: '6.1(4h)',
        workaround: 'Clean content of svccoreCtrlr or svccoreNode, use CLI instead',
        riskLevel: 'MEDIUM',
      },
    ],
    stabilityDefects: [
      {
        id: 'CSCwp64296',
        title: 'Rogue EP/COOP Exception MACs Missing (APIC)',
        severity: 'Moderate',
        status: 'Verified',
        component: 'policymgr-epg',
        description: 'Rogue EP/COOP Exception MACs missing after stateless reload of spine',
        riskLevel: 'MEDIUM',
      },
      {
        id: 'CSCwq57598',
        title: 'SNMP Memory Exhaustion (Fabric-SW)',
        severity: 'Severe',
        status: 'Verified',
        component: 'snmp-agent',
        description: 'Hundreds of snmpd processes exhaust memory and lead to kernel panic with OOM',
        riskLevel: 'HIGH',
      },
    ],
    lowerRiskDefects: [
      {
        id: 'CSCwp91550',
        title: 'Port Bring-up Delay (Fabric-SW)',
        severity: 'Moderate',
        component: 'sdk-platform',
        description: 'Port bring up delay with 25G-CU*M on specific hardware',
        riskLevel: 'LOW',
      },
      {
        id: 'CSCwq18643',
        title: 'LLDP Wrong MAC (Fabric-SW)',
        severity: 'Minor',
        component: 'pfm',
        description: 'LLDP reporting wrong MAC on TLVs for OOB Interface',
        riskLevel: 'LOW',
      },
    ],
    recommendations: {
      before: [
        'Check for deleted snapshot files causing AE busy loops (CSCwe07002)',
        'Verify catalog compatibility for switches on 16.0(5h) (CSCwr32767)',
        'Monitor SNMP process counts (CSCwq57598)',
      ],
      during: [
        'Use CLI for monitoring if GUI becomes unresponsive (CSCws84232)',
        'Monitor spine stability (CSCwq52224)',
      ],
      after: [
        'Verify EP/COOP MAC entries (CSCwp64296)',
        'Check contract deployment status (CSCwp99433)',
        'Validate fabric convergence',
      ],
    },
  };
};

const CFDAnalysis = ({ initialPath = '' }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'system',
      content: 'Welcome to CFD Analysis. Enter comma-separated CFD IDs or attach a directory path using the + button.',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [attachedPath, setAttachedPath] = useState(initialPath);
  const [isPathDialogOpen, setIsPathDialogOpen] = useState(false);
  const [pathInput, setPathInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const runAnalysis = (input, path) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input || null,
      path: path || null,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Add loading message
    const loadingId = Date.now() + 1;
    setMessages((prev) => [
      ...prev,
      { id: loadingId, type: 'loading', content: 'Analyzing CFD data…' },
    ]);
    setIsAnalyzing(true);

    // Mock analysis
    setTimeout(() => {
      const isSuccess = Math.random() > 0.15;

      setMessages((prev) => prev.filter((m) => m.id !== loadingId));

      if (isSuccess) {
        const resultMessage = {
          id: Date.now() + 2,
          type: 'result',
          success: true,
          retryData: { input, path },
          data: generateMockDefects(),
        };
        setMessages((prev) => [...prev, resultMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 2,
          type: 'result',
          success: false,
          error: 'Analysis failed. Please check your inputs and try again.',
          retryData: { input, path },
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
      setIsAnalyzing(false);
    }, 2500);
  };

  const handleSubmit = () => {
    if ((!inputValue.trim() && !attachedPath) || isAnalyzing) return;

    runAnalysis(inputValue.trim(), attachedPath);
    setInputValue('');
    setAttachedPath('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePathSubmit = () => {
    if (pathInput.trim()) {
      setAttachedPath(pathInput.trim());
      setPathInput('');
      setIsPathDialogOpen(false);
    }
  };

  const handleRetry = (retryData) => {
    runAnalysis(retryData.input, retryData.path);
  };

  const removeAttachment = () => {
    setAttachedPath('');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-4 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <AnalysisIcon className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">CFD Analysis</h1>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onRetry={handleRetry}
              isAnalyzing={isAnalyzing}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4">
        <div className="max-w-3xl mx-auto">
          {/* Attached Path Preview */}
          {attachedPath && (
            <div className="mb-3 flex items-center gap-2 animate-fade-in">
              <div className="flex items-center gap-2 bg-accent text-accent-foreground px-3 py-2 rounded-lg text-sm">
                <FolderIcon className="w-4 h-4" />
                <span className="font-mono text-xs max-w-xs truncate">{attachedPath}</span>
                <button
                  onClick={removeAttachment}
                  className="ml-1 hover:text-destructive transition-colors"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Input Bar */}
          <div className="flex items-end gap-2 bg-secondary rounded-2xl p-2 border border-border focus-within:border-primary transition-colors">
            {/* Plus Button */}
            <button
              onClick={() => setIsPathDialogOpen(true)}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-card hover:bg-accent flex items-center justify-center transition-colors border border-border"
              title="Attach directory path"
            >
              <PlusIcon className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Text Input */}
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter CFD IDs (comma separated)..."
              rows={1}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground resize-none py-2.5 px-2 focus:outline-none min-h-[40px] max-h-32"
              style={{ height: 'auto' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
              }}
            />

            {/* Send Button */}
            <button
              onClick={handleSubmit}
              disabled={(!inputValue.trim() && !attachedPath) || isAnalyzing}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <SendIcon className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-3">
            Use + to attach a CFD directory path, or enter comma-separated IDs directly
          </p>
        </div>
      </div>

      {/* Path Dialog */}
      {isPathDialogOpen && (
        <PathDialog
          value={pathInput}
          onChange={setPathInput}
          onSubmit={handlePathSubmit}
          onClose={() => {
            setIsPathDialogOpen(false);
            setPathInput('');
          }}
        />
      )}
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ message, onRetry, isAnalyzing }) => {
  if (message.type === 'system') {
    return (
      <div className="flex justify-center animate-fade-in">
        <div className="bg-accent text-accent-foreground px-4 py-3 rounded-xl text-sm text-center max-w-md">
          {message.content}
        </div>
      </div>
    );
  }

  if (message.type === 'user') {
    return (
      <div className="flex justify-end items-start gap-2 animate-slide-up group">
        <button
          onClick={() => onRetry({ input: message.content, path: message.path })}
          className="opacity-0 group-hover:opacity-100 mt-3 p-1.5 rounded-lg hover:bg-secondary transition-all"
          title="Retry this analysis"
        >
          <RefreshIcon className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-br-md max-w-lg">
          {message.path && (
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-primary-foreground/20">
              <FolderIcon className="w-4 h-4" />
              <span className="font-mono text-xs opacity-90">{message.path}</span>
            </div>
          )}
          {message.content && (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
      </div>
    );
  }

  if (message.type === 'loading') {
    return (
      <div className="flex justify-start animate-fade-in">
        <div className="bg-card border border-border px-4 py-4 rounded-2xl rounded-bl-md flex items-center gap-3">
          <div className="relative w-5 h-5">
            <div className="absolute inset-0 rounded-full border-2 border-muted"></div>
            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </div>
          <span className="text-sm text-muted-foreground">{message.content}</span>
        </div>
      </div>
    );
  }

  if (message.type === 'result') {
    if (message.success) {
      return (
        <div className="animate-slide-up group">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
              <CheckIcon className="w-4 h-4 text-success" />
            </div>
            <span className="font-medium text-sm text-foreground">Analysis Complete</span>
            <button
              onClick={() => onRetry(message.retryData)}
              disabled={isAnalyzing}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-secondary disabled:opacity-50 transition-all ml-auto"
              title="Re-run this analysis"
            >
              <RefreshIcon className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <AnalysisResult data={message.data} />
        </div>
      );
    } else {
      return (
        <div className="flex justify-start animate-slide-up">
          <div className="bg-card border border-destructive/30 rounded-2xl rounded-bl-md max-w-lg overflow-hidden">
            <div className="bg-destructive/10 px-4 py-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center">
                <ErrorIcon className="w-4 h-4 text-destructive" />
              </div>
              <span className="font-medium text-sm text-foreground">Analysis Failed</span>
            </div>
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-3">{message.error}</p>
              <button
                onClick={() => onRetry(message.retryData)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium rounded-lg transition-colors"
              >
                <RefreshIcon className="w-4 h-4" />
                Retry Analysis
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return null;
};

// Path Dialog Component
const PathDialog = ({ value, onChange, onSubmit, onClose }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-card border border-border rounded-2xl shadow-elevated w-full max-w-md animate-slide-up">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FolderIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Attach Directory Path</h2>
              <p className="text-sm text-muted-foreground">Enter the path to your CFD directory</p>
            </div>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="/path/to/cfd/directory"
            className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-mono text-sm"
          />

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-secondary text-secondary-foreground font-medium rounded-xl hover:bg-secondary/80 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={!value.trim()}
              className="flex-1 py-3 px-4 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <CheckIcon className="w-4 h-4" />
              Attach
            </button>
          </div>
        </div>
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

const FolderIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const SendIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
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

const CloseIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default CFDAnalysis;
