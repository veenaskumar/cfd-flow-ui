import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bug, AlertTriangle, CheckCircle, Info, FileText, Wrench, Server } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface DetailedAnalysisProps {
  directoryPath: string;
}

// Mock detailed analysis data
const mockAnalysisData: Record<string, {
  bugId: string;
  severity: 'Critical' | 'Severe' | 'Moderate' | 'Minor';
  status: string;
  component: string;
  description: string;
  rootCause: string;
  affectedVersions: string[];
  affectedHardware: string[];
  workaround: string;
  riskLevel: string;
  upgradeAnalysis: string;
  recommendations: string[];
}> = {
  'CSCwe07002': {
    bugId: 'CSCwe07002',
    severity: 'Critical',
    status: 'Verified',
    component: 'ifc-upgrade',
    description: 'Downgrade Failure - Firmware rollback operation fails during maintenance window causing extended downtime.',
    rootCause: 'Race condition in firmware validation module during rollback sequence. The validation checksum is calculated before the firmware image is fully written to flash memory.',
    affectedVersions: ['5.2.1', '5.2.2', '5.2.3'],
    affectedHardware: ['N9K-C93180YC-FX', 'N9K-C93180YC-EX'],
    workaround: 'Perform downgrade in two stages: first to intermediate version 5.1.4, then to target version. Ensure all switches are in maintenance mode before initiating downgrade.',
    riskLevel: 'High - May cause extended fabric downtime',
    upgradeAnalysis: 'This bug is triggered during downgrade operations from 5.2.x to 5.1.x versions. The issue does not affect upgrades. If planning an upgrade that may require rollback capability, consider the risk carefully.',
    recommendations: [
      'Schedule maintenance window with extended buffer time',
      'Prepare intermediate version images in advance',
      'Test rollback procedure in lab environment first',
      'Have TAC contact ready during maintenance'
    ]
  },
  'CSCwr32767': {
    bugId: 'CSCwr32767',
    severity: 'Critical',
    status: 'Verified',
    component: 'ifc-upgrade',
    description: 'Auto Firmware Upgrade Failure - Automatic update mechanism fails silently without proper error logging.',
    rootCause: 'Silent exception handling in auto-upgrade daemon causes failures to go unlogged. The daemon continues running but stops processing upgrade requests.',
    affectedVersions: ['5.1.x', '5.2.x'],
    affectedHardware: ['All N9K platforms'],
    workaround: 'Disable auto-upgrade feature and perform manual upgrades. Monitor upgrade logs closely for any anomalies.',
    riskLevel: 'High - Silent failures may delay critical updates',
    upgradeAnalysis: 'Auto-upgrade feature should be disabled before any manual upgrade operation. Re-enable only after confirming stable operation post-upgrade.',
    recommendations: [
      'Disable auto-upgrade in fabric settings',
      'Use manual upgrade procedures',
      'Implement external monitoring for firmware versions',
      'Schedule regular firmware audits'
    ]
  }
};

// Default analysis for unknown bugs
const defaultAnalysis = {
  severity: 'Moderate' as const,
  status: 'Open',
  component: 'unknown',
  description: 'Detailed analysis pending. This bug is currently under investigation.',
  rootCause: 'Root cause analysis in progress.',
  affectedVersions: ['TBD'],
  affectedHardware: ['TBD'],
  workaround: 'No workaround available at this time.',
  riskLevel: 'Medium - Requires further evaluation',
  upgradeAnalysis: 'Impact on upgrade operations is being evaluated. Check back for updates.',
  recommendations: [
    'Monitor release notes for updates',
    'Contact TAC for specific guidance',
    'Test in lab environment before production deployment'
  ]
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Critical':
      return 'bg-destructive text-destructive-foreground';
    case 'Severe':
      return 'bg-warning text-warning-foreground';
    case 'Moderate':
      return 'bg-primary text-primary-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const DetailedAnalysis: React.FC<DetailedAnalysisProps> = ({ directoryPath }) => {
  const navigate = useNavigate();
  const { bugId } = useParams<{ bugId: string }>();

  const analysis = bugId && mockAnalysisData[bugId] 
    ? mockAnalysisData[bugId] 
    : { bugId: bugId || 'Unknown', ...defaultAnalysis };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-foreground">{analysis.bugId}</h1>
              <Badge className={getSeverityColor(analysis.severity)}>
                {analysis.severity}
              </Badge>
              <Badge variant="outline">{analysis.status}</Badge>
            </div>
            {directoryPath && (
              <p className="text-xs text-muted-foreground font-mono mt-1">{directoryPath}</p>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="w-5 h-5 text-primary" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
              <p className="text-foreground">{analysis.description}</p>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Component</h4>
                <p className="text-foreground font-mono">{analysis.component}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Risk Level</h4>
                <p className="text-foreground">{analysis.riskLevel}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Root Cause Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Root Cause
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{analysis.rootCause}</p>
          </CardContent>
        </Card>

        {/* Affected Systems Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" />
              Affected Systems
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Affected Versions</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.affectedVersions.map((version, index) => (
                  <Badge key={index} variant="secondary">{version}</Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Affected Hardware</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.affectedHardware.map((hw, index) => (
                  <Badge key={index} variant="outline">{hw}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Analysis Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Upgrade Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{analysis.upgradeAnalysis}</p>
          </CardContent>
        </Card>

        {/* Workaround Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-success" />
              Workaround
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{analysis.workaround}</p>
          </CardContent>
        </Card>

        {/* Recommendations Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetailedAnalysis;
