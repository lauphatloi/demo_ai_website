/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import FrameA_ExplodedView from './FrameA';
import FrameB_HUDSpotlight from './FrameB';

const BackgroundScene = ({ sceneData, aiMessage }: { sceneData: any, aiMessage: string | null }) => {
  if (!sceneData) return <div className="w-full h-full bg-[#050505]"></div>;
  
  return (
    <div className="w-full h-full">
      {sceneData.ui_component === 'FrameA' && <FrameA_ExplodedView data={sceneData.data} aiMessage={aiMessage} />}
      {sceneData.ui_component === 'FrameB' && <FrameB_HUDSpotlight data={sceneData.data} aiMessage={aiMessage} />}
    </div>
  );
};

export default function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [sceneData, setSceneData] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const currentInput = input;
    setInput('');
    setIsTyping(true);
    
    const newMessages = [...messages, { role: 'user', content: currentInput }];
    setMessages(newMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await response.json();
      setMessages([...newMessages, { role: data.role, content: data.content }]);
      
      if (data.tool_data) {
        setSceneData(data.tool_data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const latestAssistantMessage = messages.filter(m => m.role === 'assistant').pop()?.content || null;

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
      <div className="relative z-0 w-full">
        <BackgroundScene sceneData={sceneData} aiMessage={latestAssistantMessage} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex flex-col justify-end items-center pb-8 px-4 bg-gradient-to-t from-[#020202] via-[#020202]/80 to-transparent pt-32">
        
        <form 
          onSubmit={handleSendPrompt}
          className="w-full max-w-2xl relative pointer-events-auto transform transition-all hover:scale-[1.01]"
        >
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"></div>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            placeholder={isTyping ? "AI đang xử lý..." : "Nhập nhu cầu build PC (VD: 20 triệu làm 3D)..."}
            className="w-full bg-transparent text-white/90 placeholder:text-white/40 px-6 py-5 rounded-2xl focus:outline-none text-lg relative z-20"
          />
          
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 rounded-xl transition-colors z-20 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        
        <p className="pointer-events-auto text-white/30 text-xs mt-4 font-mono">
          AI Architecture Mode • Press Enter to send
        </p>
      </div>
    </div>
  );
}
