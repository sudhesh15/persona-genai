import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  sender: "user" | "ai";
  content: string;
  timestamp?: number;
}

interface ChatWindowProps {
  personaId: string;
  personaName: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ personaId, personaName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clear messages when persona changes
  useEffect(() => {
    setMessages([]);
  }, [personaId]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      sender: "user",
      content: input.trim(),
      timestamp: Date.now()
    };

    setLoading(true);
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaId,
          userMessage: input.trim()
        })
      });

      if (!res.ok) throw new Error('Network response was not ok');
      
      const data = await res.json();
      
      const aiMessage: Message = {
        sender: "ai",
        content: data.reply || "Sorry, I couldn't process your message.",
        timestamp: Date.now()
      };

      setMessages([...newMessages, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        sender: "ai",
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: Date.now()
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-4xl mx-auto glass-effect border-border/50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border/50">
        <h2 className="text-xl font-bold text-foreground">
          Chat with {personaName || 'AI Version of Best Instructor'}
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-chat-bg/20">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-foreground">Start a conversation</h3>
              <p className="text-muted-foreground text-sm max-w-md">
                Say hello to begin chatting with your selected persona. They're ready to help!
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-full animate-slide-up",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "relative max-w-[80%] min-w-[100px]",
                    message.sender === "user" 
                      ? "chat-bubble-user" 
                      : "chat-bubble-ai"
                  )}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  {message.timestamp && (
                    <div className={cn(
                      "text-xs mt-2 opacity-70",
                      message.sender === "user" ? "text-white/70" : "text-muted-foreground"
                    )}>
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start animate-slide-up">
                <div className="chat-bubble-ai">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-border/50">
        <div className="flex space-x-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            placeholder="Type your message..."
            className="flex-1 bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            size="icon"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-glow transition-all duration-300"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatWindow;