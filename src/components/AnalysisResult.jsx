import React from 'react';
import DefectCard from './DefectCard';

const AnalysisResult = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-lg font-semibold text-foreground mb-3">
          Summary of APIC Upgrade-Related Defects
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryCard 
            label="Total Defects" 
            value={data.summary.total} 
            sublabel={`${data.summary.affectingUpgrade} affect upgrade`}
          />
          <SummaryCard 
            label="Critical/Severe" 
            value={data.summary.criticalSevere} 
            variant="destructive"
          />
          <SummaryCard 
            label="Moderate" 
            value={data.summary.moderate} 
            variant="warning"
          />
          <SummaryCard 
            label="Minor" 
            value={data.summary.minor} 
            variant="muted"
          />
        </div>
      </div>

      {/* Critical Upgrade Defects */}
      {data.criticalDefects && data.criticalDefects.length > 0 && (
        <Section 
          title="Critical Upgrade Defects" 
          subtitle="Directly Impact Upgrade"
          variant="destructive"
        >
          {data.criticalDefects.map((defect, index) => (
            <DefectCard key={defect.id || index} defect={defect} />
          ))}
        </Section>
      )}

      {/* High-Severity Operational Issues */}
      {data.highSeverityDefects && data.highSeverityDefects.length > 0 && (
        <Section 
          title="High-Severity Operational Issues" 
          subtitle="Upgrade-Adjacent"
          variant="warning"
        >
          {data.highSeverityDefects.map((defect, index) => (
            <DefectCard key={defect.id || index} defect={defect} />
          ))}
        </Section>
      )}

      {/* Fabric Stability Issues */}
      {data.stabilityDefects && data.stabilityDefects.length > 0 && (
        <Section 
          title="Fabric Stability Issues" 
          subtitle="Post-Upgrade Risk"
          variant="warning"
        >
          {data.stabilityDefects.map((defect, index) => (
            <DefectCard key={defect.id || index} defect={defect} />
          ))}
        </Section>
      )}

      {/* Lower Risk Defects */}
      {data.lowerRiskDefects && data.lowerRiskDefects.length > 0 && (
        <Section 
          title="Lower Risk Defects" 
          variant="muted"
        >
          {data.lowerRiskDefects.map((defect, index) => (
            <DefectCard key={defect.id || index} defect={defect} />
          ))}
        </Section>
      )}

      {/* Key Recommendations */}
      {data.recommendations && (
        <div className="bg-card border border-primary/30 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <LightbulbIcon className="w-5 h-5 text-primary" />
            Key Recommendations
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <RecommendationBlock title="Before Upgrade" items={data.recommendations.before} />
            <RecommendationBlock title="During Upgrade" items={data.recommendations.during} />
            <RecommendationBlock title="Post-Upgrade" items={data.recommendations.after} />
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ label, value, sublabel, variant = 'default' }) => {
  const variants = {
    default: 'bg-secondary/50',
    destructive: 'bg-destructive/10',
    warning: 'bg-warning/10',
    muted: 'bg-muted',
  };

  return (
    <div className={`${variants[variant]} rounded-lg p-3`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
    </div>
  );
};

const Section = ({ title, subtitle, variant = 'default', children }) => {
  const borderVariants = {
    default: 'border-border',
    destructive: 'border-destructive/30',
    warning: 'border-warning/30',
    muted: 'border-border',
  };

  return (
    <div className={`border ${borderVariants[variant]} rounded-xl p-4`}>
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};

const RecommendationBlock = ({ title, items }) => {
  if (!items || items.length === 0) return null;
  
  return (
    <div className="bg-secondary/50 rounded-lg p-3">
      <h4 className="font-medium text-sm text-foreground mb-2">{title}:</h4>
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
            <CheckIcon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Icons
const LightbulbIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default AnalysisResult;
