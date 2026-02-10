import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, RotateCcw, Bot, User, Bug, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatProps {
  directoryPath: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Chat: React.FC<ChatProps> = ({ directoryPath }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bugId, setBugId] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Extract bug ID from initial query if present
  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      const bugIdMatch = initialQuery.match(/^\[Bug ID: (.+?)\]\s*/);
      if (bugIdMatch) {
        setBugId(bugIdMatch[1]);
        const cleanQuery = initialQuery.replace(/^\[Bug ID: .+?\]\s*/, '');
        handleSendMessage(cleanQuery);
      } else {
        handleSendMessage(initialQuery);
      }
    }
  }, [initialQuery]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `Based on your query about "${content.trim()}", here's my analysis:\n\n**Summary:**\nThe analysis indicates potential upgrade impact scenarios related to your query. Key findings include configuration compatibility checks and recommended migration paths.\n\n**Recommendations:**\n1. Review current firmware versions\n2. Check compatibility matrix\n3. Plan maintenance window accordingly`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputValue('');
    setBugId('');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">CFD Analysis Chat</h1>
              {directoryPath && (
                <p className="text-xs text-muted-foreground font-mono truncate max-w-[300px]">
                  {directoryPath}
                </p>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleNewChat}>
            <RotateCcw className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
                <Bot className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg font-medium">Ask about bugs or upgrade scenarios</p>
                <p className="text-sm mt-1">Your conversation will appear here</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-card border border-border rounded-xl px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            {bugId && (
              <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 text-sm font-mono text-primary whitespace-nowrap h-[50px]">
                <Bug className="w-4 h-4 flex-shrink-0" />
                {bugId}
                <button
                  onClick={() => setBugId('')}
                  className="p-0.5 hover:bg-primary/20 rounded transition-colors ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about a specific bug or upgrade scenario…"
              className="min-h-[50px] max-h-[150px] resize-none flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className="h-[50px] px-4"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
