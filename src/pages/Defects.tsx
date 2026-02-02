import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface DefectsProps {
  directoryPath?: string;
}

// Mock defect list data
const mockDefects = [
  { id: 'CSCwe07002', title: 'Downgrade Failure', severity: 'Critical', component: 'ifc-upgrade', status: 'Verified' },
  { id: 'CSCwr32767', title: 'Auto Firmware Upgrade Failure', severity: 'Critical', component: 'ifc-upgrade', status: 'Verified' },
  { id: 'CSCws84232', title: 'APIC GUI Unresponsive', severity: 'Severe', component: 'ui', status: 'More Info Needed' },
  { id: 'CSCwq57598', title: 'SNMP Memory Exhaustion', severity: 'Severe', component: 'snmp-agent', status: 'Verified' },
  { id: 'CSCwp64296', title: 'Rogue EP/COOP Exception MACs Missing', severity: 'Moderate', component: 'policymgr-epg', status: 'Verified' },
  { id: 'CSCwp91550', title: 'Port Bring-up Delay', severity: 'Moderate', component: 'sdk-platform', status: 'Open' },
  { id: 'CSCwq18643', title: 'LLDP Wrong MAC', severity: 'Minor', component: 'pfm', status: 'Open' },
];

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'Critical':
    case 'Severe':
      return <AlertTriangle className="w-4 h-4" />;
    case 'Moderate':
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Info className="w-4 h-4" />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Critical':
      return 'text-destructive bg-destructive/10';
    case 'Severe':
      return 'text-warning bg-warning/10';
    case 'Moderate':
      return 'text-primary bg-primary/10';
    default:
      return 'text-muted-foreground bg-muted';
  }
};

const Defects: React.FC<DefectsProps> = ({ directoryPath }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Defects List</h1>
            {directoryPath && (
              <p className="text-sm text-muted-foreground font-mono">{directoryPath}</p>
            )}
          </div>
        </div>
      </header>

      {/* Defects Table */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">ID</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Severity</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Component</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockDefects.map((defect, index) => (
                <tr
                  key={defect.id}
                  className={`hover:bg-accent/50 transition-colors ${
                    index !== mockDefects.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-primary">{defect.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">{defect.title}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${getSeverityColor(defect.severity)}`}>
                      {getSeverityIcon(defect.severity)}
                      {defect.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground font-mono">{defect.component}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">{defect.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Defects;
