"use client";
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/src/lib/supabase/client';
import { Send, Bot, User, Circle } from 'lucide-react'; // Added lucide-react for icons

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user?.id, message: userMsg }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "SYSTEM_ERROR: Connection to ECU lost." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-zinc-100 font-sans">
      {/* HUD Header */}
      <header className="px-6 py-4 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md flex justify-between items-center">
        <div>
          <h1 className="text-sm font-black tracking-tighter uppercase italic flex items-center gap-2">
            <span className="text-orange-500">MotoAI</span> 
            <span className="text-zinc-500">v2.0.4</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Circle size={8} className="fill-emerald-500 text-emerald-500 animate-pulse" />
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Diagnostics Online</span>
          </div>
        </div>
        <div className="text-right">
            <p className="text-[10px] text-zinc-600 uppercase font-mono">Telemetry Active</p>
        </div>
      </header>

      {/* Chat History Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scrollbar-hide">
        {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-zinc-700 opacity-50">
                <Bot size={48} strokeWidth={1} />
                <p className="mt-4 text-xs font-mono uppercase tracking-[0.3em]">Awaiting Command Input...</p>
            </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 border 
                ${msg.role === 'user' ? 'bg-zinc-100 border-zinc-300' : 'bg-orange-500 border-orange-400'}`}>
                {msg.role === 'user' ? <User size={16} className="text-black" /> : <Bot size={16} className="text-white" />}
            </div>
            
            <div className={`max-w-[75%] p-4 text-sm leading-relaxed shadow-lg
                ${msg.role === 'user' 
                  ? 'bg-zinc-800 text-zinc-100 rounded-lg rounded-tr-none border-l-2 border-zinc-500' 
                  : 'bg-zinc-900 text-zinc-200 rounded-lg rounded-tl-none border-l-2 border-orange-500'
                }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4 items-center animate-pulse">
            <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center border border-zinc-700">
                <Bot size={16} className="text-zinc-500" />
            </div>
            <div className="h-4 w-24 bg-zinc-800 rounded"></div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Dashboard Input Area */}
      <div className="p-6 bg-zinc-950/80 border-t border-zinc-800 backdrop-blur-xl">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="INPUT COMMAND OR QUESTION..."
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-5 py-4 text-xs font-mono tracking-wider text-white 
                       focus:outline-none focus:border-orange-500 transition-all focus:ring-1 focus:ring-orange-500/20"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-700 
                       text-black p-2 rounded transition-all group-focus-within:scale-110 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-center text-[9px] text-zinc-600 mt-4 uppercase tracking-[0.2em]">
            Neural Network Link: Stable | Latency: 24ms
        </p>
      </div>
    </div>
  );
}