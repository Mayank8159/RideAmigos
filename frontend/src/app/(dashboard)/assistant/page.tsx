"use client";
import { useState } from 'react';

export default function AssistantPage() {
  const [chat, setChat] = useState<{ role: string, text: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;
    const newChat = [...chat, { role: 'user', text: input }];
    setChat(newChat);
    setInput("");

    const res = await fetch('/api/ai', { 
      method: 'POST', 
      body: JSON.stringify({ message: input }) 
    });
    const data = await res.json();
    setChat([...newChat, { role: 'assistant', text: data.reply }]);
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div className="flex-1 space-y-4 overflow-y-auto mb-4 scrollbar-hide">
        {chat.map((m, i) => (
          <div key={i} className={`p-4 rounded-lg max-w-[80%] ${m.role === 'user' ? 'ml-auto bg-orange-600' : 'bg-zinc-800 border border-zinc-700'}`}>
            <p className="text-sm">{m.text}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2 bg-zinc-900 p-2 rounded-lg border border-zinc-800">
        <input 
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2"
          placeholder="Ask me about your Panigale V4..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-orange-500 px-4 py-2 rounded font-bold text-xs uppercase">Ask</button>
      </div>
    </div>
  );
}