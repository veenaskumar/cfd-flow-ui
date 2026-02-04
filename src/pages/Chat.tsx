import CFDAnalysis from "../components/CFDAnalysis";

interface ChatProps {
  initialPath?: string;
}

const Chat = ({ initialPath }: ChatProps) => {
  
  return <CFDAnalysis initialPath={initialPath} />;
};

export default Chat;
