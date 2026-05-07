import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Bot, ShieldCheck, Terminal, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const AIChatbot: React.FC<{ result?: any }> = ({ result }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hello! I am CertiGuard AI. Upload a certificate to begin analysis, or ask me about cybersecurity protocols.' }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) {
      const summary = `Analysis Complete for ID: ${result.structuredFields.id}. Status: ${result.status}. Confidence: ${100 - result.fraudScore}%. Would you like a detailed fraud report?`;
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: summary }]);
    }
  }, [result]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      let response = "I can help you with certificate verification. Try uploading an image to the 'Validator' tab.";
      if (input.toLowerCase().includes("report") && result) {
        response = `GENERATING REPORT...\nTarget: ${result.structuredFields.name}\nResult: ${result.status}\nAI Summary: ${result.explanation}`;
      } else if (input.toLowerCase().includes("cybersecurity")) {
        response = "Security Pro-tip: Always verify the digital signature and QR code of a certificate against the official registry to prevent spoofing.";
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response }]);
    }, 1000);
  };

  return (
    <div className="glass flex flex-col h-[500px] border-l border-primary/20">
      <div className="p-4 border-b border-border-light flex items-center gap-2 bg-primary/5">
        <Bot size={20} className="text-primary" />
        <span className="font-bold outfit text-primary">CertiGuard LLM</span>
        <div className="ml-auto flex gap-2">
           <div className="status-badge status-active scale-75">Online</div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-primary/20 border border-primary/30 text-white' : 'bg-surface/50 border border-border-light text-text-main'}`}>
                <div className="flex items-center gap-2 mb-1 opacity-50 text-[10px] uppercase font-bold tracking-widest">
                  {msg.role === 'assistant' ? <Terminal size={10} /> : null}
                  {msg.role}
                </div>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-border-light bg-black/20">
        <div className="flex gap-2">
          <input 
            className="flex-1 bg-surface border border-border-light rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary/50"
            placeholder="Ask AI about fraud analysis..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="btn-primary !p-2 rounded-lg">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
