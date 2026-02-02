import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquarePlus, List, FolderOpen } from 'lucide-react';

interface WelcomePageProps {
  onSetPath: (path: string) => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onSetPath }) => {
  const [directoryPath, setDirectoryPath] = useState('');
  const navigate = useNavigate();

  const handleNewChat = () => {
    if (directoryPath.trim()) {
      onSetPath(directoryPath.trim());
    }
    navigate('/chat');
  };

  const handleListDefects = () => {
    if (directoryPath.trim()) {
      onSetPath(directoryPath.trim());
    }
    navigate('/defects');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-2">CFD Analysis</h1>
          <p className="text-muted-foreground">Analyze defects and upgrade impacts</p>
        </div>

        {/* Directory Path Input */}
        <div className="w-full">
          <label className="block text-sm font-medium text-foreground mb-2">
            Defects Directory Path
          </label>
          <div className="relative">
            <FolderOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={directoryPath}
              onChange={(e) => setDirectoryPath(e.target.value)}
              placeholder="/path/to/defects/directory"
              className="w-full h-16 pl-12 pr-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-mono text-sm"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="group h-48 bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-accent transition-all duration-200"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <MessageSquarePlus className="w-7 h-7 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground">New Chat</h3>
              <p className="text-sm text-muted-foreground mt-1">Start a new analysis session</p>
            </div>
          </button>

          {/* List Defects Button */}
          <button
            onClick={handleListDefects}
            className="group h-48 bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-accent transition-all duration-200"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <List className="w-7 h-7 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground">List Defects</h3>
              <p className="text-sm text-muted-foreground mt-1">Browse all defects in directory</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
