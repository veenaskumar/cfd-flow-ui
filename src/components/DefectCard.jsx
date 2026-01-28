import React from 'react';

const DefectCard = ({ defect }) => {
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'severe':
      case 'critical':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'moderate':
        return 'bg-warning/10 text-warning border-warning/30';
      case 'minor':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return 'bg-success/10 text-success';
      case 'duplicate':
        return 'bg-muted text-muted-foreground';
      case 'more info needed':
        return 'bg-warning/10 text-warning';
      case 'held':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskBadge = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm font-semibold text-primary">{defect.id}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getSeverityColor(defect.severity)}`}>
              {defect.severity}
            </span>
            {defect.status && (
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(defect.status)}`}>
                {defect.status}
              </span>
            )}
          </div>
          <h4 className="font-medium text-foreground mt-1">{defect.title}</h4>
        </div>
        {defect.riskLevel && (
          <span className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${getRiskBadge(defect.riskLevel)}`}>
            {defect.riskLevel} RISK
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {defect.component && (
          <span>Component: <span className="font-medium text-foreground">{defect.component}</span></span>
        )}
        {defect.impact && (
          <span className="text-primary font-medium">{defect.impact}</span>
        )}
      </div>

      {/* Description */}
      {defect.description && (
        <p className="text-sm text-muted-foreground">{defect.description}</p>
      )}

      {/* Root Cause */}
      {defect.rootCause && (
        <div className="bg-secondary/50 rounded-lg p-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">Root Cause:</p>
          <p className="text-sm text-foreground">{defect.rootCause}</p>
        </div>
      )}

      {/* Affected Versions */}
      {defect.affectedVersions && (
        <div className="text-xs">
          <span className="text-muted-foreground">Affected Versions: </span>
          <span className="font-mono text-foreground">{defect.affectedVersions}</span>
        </div>
      )}

      {/* Workaround */}
      {defect.workaround && (
        <div className="bg-accent/50 rounded-lg p-3 border-l-2 border-primary">
          <p className="text-xs font-medium text-muted-foreground mb-1">Workaround:</p>
          <p className="text-sm text-foreground">{defect.workaround}</p>
        </div>
      )}
    </div>
  );
};

export default DefectCard;
