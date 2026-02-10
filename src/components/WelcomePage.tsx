import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderOpen, 
  X, 
  ChevronDown, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Bug,
  ArrowUpCircle,
  ExternalLink,
  Search,
  Loader2
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

interface WelcomePageProps {
  onSetPath: (path: string) => void;
}

type ValidationStatus = 'idle' | 'valid' | 'warning' | 'error';

interface BugData {
  bugId: string;
  upgradeAnalysisSummary: string;
  detailedSummary: string;
}

// Mock data for demonstration
const mockBugData: BugData[] = [
  { bugId: 'CSCwe07002', upgradeAnalysisSummary: 'Critical downgrade failure detected', detailedSummary: 'Firmware rollback issue affecting version 5.2.x' },
  { bugId: 'CSCwr32767', upgradeAnalysisSummary: 'Auto firmware upgrade failure', detailedSummary: 'Automatic update mechanism fails silently' },
  { bugId: 'CSCws84232', upgradeAnalysisSummary: 'GUI unresponsive after upgrade', detailedSummary: 'APIC management interface freezes post-upgrade' },
  { bugId: 'CSCwq57598', upgradeAnalysisSummary: 'Memory exhaustion in SNMP agent', detailedSummary: 'SNMP polling causes memory leak over time' },
  { bugId: 'CSCwp64296', upgradeAnalysisSummary: 'Rogue endpoint detection gap', detailedSummary: 'Missing MACs in COOP exception list' },
  { bugId: 'CSCwp91550', upgradeAnalysisSummary: 'Port initialization delay', detailedSummary: 'Extended bring-up time for fabric ports' },
  { bugId: 'CSCwq18643', upgradeAnalysisSummary: 'LLDP MAC address mismatch', detailedSummary: 'Incorrect MAC reported in LLDP frames' },
  { bugId: 'CSCwx12345', upgradeAnalysisSummary: 'Config sync failure', detailedSummary: 'Multi-pod configuration synchronization issue' },
  { bugId: 'CSCwy67890', upgradeAnalysisSummary: 'Policy deployment delay', detailedSummary: 'EPG policies take extended time to propagate' },
  { bugId: 'CSCwz11223', upgradeAnalysisSummary: 'Health score calculation error', detailedSummary: 'Incorrect health metrics reported in dashboard' },
];

const RECENT_PATHS_KEY = 'cfd_recent_paths';

const WelcomePage: React.FC<WelcomePageProps> = ({ onSetPath }) => {
  const navigate = useNavigate();
  const [directoryPath, setDirectoryPath] = useState('');
  const [recentPaths, setRecentPaths] = useState<string[]>([]);
  const [showRecentPaths, setShowRecentPaths] = useState(false);
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>('idle');
  const [validationMessage, setValidationMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [bugData, setBugData] = useState<BugData[]>([]);
  const [userQuery, setUserQuery] = useState('');
  const [bugIdQuery, setBugIdQuery] = useState('');
  const [bemsPath, setBemsPath] = useState('');
  const [isQueryLoading, setIsQueryLoading] = useState(false);

  // Load recent paths from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_PATHS_KEY);
    if (stored) {
      try {
        setRecentPaths(JSON.parse(stored));
      } catch {
        setRecentPaths([]);
      }
    }
  }, []);

  // Save path to recent paths
  const saveToRecentPaths = (path: string) => {
    const updated = [path, ...recentPaths.filter(p => p !== path)].slice(0, 5);
    setRecentPaths(updated);
    localStorage.setItem(RECENT_PATHS_KEY, JSON.stringify(updated));
  };

  // Validate directory path
  const validatePath = (path: string) => {
    if (!path.trim()) {
      setValidationStatus('idle');
      setValidationMessage('');
      return;
    }

    // Simulate path validation
    if (path.startsWith('/') || path.match(/^[A-Za-z]:\\/)) {
      if (path.includes('unsupported')) {
        setValidationStatus('warning');
        setValidationMessage('Path exists but contains unsupported file types');
      } else if (path.includes('invalid')) {
        setValidationStatus('error');
        setValidationMessage('Invalid directory path');
      } else {
        setValidationStatus('valid');
        setValidationMessage('Valid directory');
      }
    } else {
      setValidationStatus('error');
      setValidationMessage('Invalid path format');
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => validatePath(directoryPath), 300);
    return () => clearTimeout(timeout);
  }, [directoryPath]);

  const handleBrowse = () => {
    // Simulate folder selection - in real implementation, use file system API
    const mockPath = '/home/user/projects/cisco-aci/defects';
    setDirectoryPath(mockPath);
    saveToRecentPaths(mockPath);
  };

  const handleClearInput = () => {
    setDirectoryPath('');
    setValidationStatus('idle');
    setValidationMessage('');
  };

  const handleSelectRecentPath = (path: string) => {
    setDirectoryPath(path);
    setShowRecentPaths(false);
  };

  const handleScan = async () => {
    if (!directoryPath.trim() || validationStatus === 'error') return;

    setIsScanning(true);
    setBugData([]);
    saveToRecentPaths(directoryPath.trim());

    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setBugData(mockBugData);
    setIsScanning(false);
  };

  const handleViewDetails = (bugId: string) => {
    onSetPath(directoryPath.trim());
    navigate(`/analysis/${bugId}`);
  };

  const handleQuerySubmit = async () => {
    if (!userQuery.trim()) return;
    onSetPath(directoryPath.trim());
    navigate(`/chat?query=${encodeURIComponent(userQuery)}`);
  };

  const getValidationIcon = () => {
    switch (validationStatus) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getValidationColor = () => {
    switch (validationStatus) {
      case 'valid':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">CFD Analysis Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Analyze defects and upgrade impacts</p>
        </div>

        {/* Top Section - Directory Input & Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Directory Path Input */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Directory Path
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={directoryPath}
                  onChange={(e) => setDirectoryPath(e.target.value)}
                  onFocus={() => recentPaths.length > 0 && setShowRecentPaths(true)}
                  onBlur={() => setTimeout(() => setShowRecentPaths(false), 200)}
                  placeholder="Enter project directory path…"
                  className="w-full h-11 pl-11 pr-20 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-mono text-sm"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {directoryPath && (
                    <button
                      onClick={handleClearInput}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                  {recentPaths.length > 0 && (
                    <button
                      onClick={() => setShowRecentPaths(!showRecentPaths)}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors"
                    >
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>

                {/* Recent Paths Dropdown */}
                {showRecentPaths && recentPaths.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                    <div className="py-1">
                      <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Recent Paths
                      </div>
                      {recentPaths.map((path, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelectRecentPath(path)}
                          className="w-full px-3 py-2 text-left text-sm font-mono hover:bg-muted transition-colors truncate"
                        >
                          {path}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={handleBrowse}
                className="h-11 px-4"
              >
                Browse
              </Button>
              <Button 
                onClick={handleScan}
                disabled={!directoryPath.trim() || validationStatus === 'error' || isScanning}
                className="h-11 px-6"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  'Scan'
                )}
              </Button>
            </div>

            {/* Validation Message */}
            {validationMessage && (
              <div className={`flex items-center gap-2 mt-3 text-sm ${getValidationColor()}`}>
                {getValidationIcon()}
                <span>{validationMessage}</span>
              </div>
            )}
          </div>

          {/* BEMS Path Input */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              BEMS Path
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={bemsPath}
                  onChange={(e) => setBemsPath(e.target.value)}
                  placeholder="Enter BEMS directory path…"
                  className="w-full h-11 pl-11 pr-10 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-mono text-sm"
                />
                {bemsPath && (
                  <button
                    onClick={() => setBemsPath('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted rounded-md transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              <Button variant="outline" className="h-11 px-4">
                Browse
              </Button>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {/* Total Bugs Card */}
            <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bug className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Bugs</p>
                <p className="text-2xl font-bold text-foreground">{bugData.length}</p>
              </div>
            </div>

            {/* Upgrade Candidates Card */}
            <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                <ArrowUpCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upgrade Candidates</p>
                <p className="text-2xl font-bold text-foreground">
                  {bugData.length > 0 ? Math.ceil(bugData.length * 0.6) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bug Analysis Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Bug Analysis</h2>
          </div>
          
          <ScrollArea className="h-[400px]">
            {isScanning ? (
              <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
                <p className="text-sm">Scanning directory for bugs...</p>
              </div>
            ) : bugData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
                <FolderOpen className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-sm">No bug data available</p>
                <p className="text-xs mt-1">Enter a directory path and click Scan to analyze</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold">Bug ID</TableHead>
                    <TableHead className="font-semibold">Upgrade Analysis Summary</TableHead>
                    <TableHead className="font-semibold">Detailed Summary</TableHead>
                    <TableHead className="w-[80px] text-center font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bugData.map((bug, index) => (
                    <TableRow 
                      key={bug.bugId} 
                      className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}
                    >
                      <TableCell className="font-mono text-primary font-medium">
                        {bug.bugId}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {bug.upgradeAnalysisSummary}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {bug.detailedSummary}
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={() => handleViewDetails(bug.bugId)}
                          className="text-primary hover:underline inline-flex items-center gap-1 text-sm"
                        >
                          View Details
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </div>

        {/* User Query & Bug ID Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Query */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              User Query
            </label>
            <div className="space-y-3">
              <Textarea
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Ask about a specific bug or upgrade scenario…"
                className="min-h-[100px] resize-none"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleQuerySubmit}
                  disabled={!userQuery.trim()}
                  className="px-6"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              </div>
            </div>
          </div>

          {/* Bug ID Input */}
          <div className="bg-card border border-border rounded-xl p-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Bug ID
            </label>
            <div className="space-y-3">
              <div className="relative">
                <Bug className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={bugIdQuery}
                  onChange={(e) => setBugIdQuery(e.target.value)}
                  placeholder="e.g. CSCwe07002"
                  className="w-full h-11 pl-11 pr-10 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-mono text-sm"
                />
                {bugIdQuery && (
                  <button
                    onClick={() => setBugIdQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted rounded-md transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    if (bugIdQuery.trim()) {
                      onSetPath(directoryPath.trim());
                      navigate(`/analysis/${encodeURIComponent(bugIdQuery.trim())}`);
                    }
                  }}
                  disabled={!bugIdQuery.trim()}
                  className="px-6"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Lookup
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
