import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, UserProfile } from '../types';
import { getSocket } from '../services/socketService';
import Button from '../components/Button';
import { Icons } from '../constants';

interface ChatViewProps {
  partnerProfile: { nickname: string; bio: string; gender: string };
  roomId?: string; // Add optional roomId
  onLeave: () => void;
  onNext: () => void;
}

const ChatView: React.FC<ChatViewProps> = (props) => {
  const { partnerProfile, onLeave, onNext } = props;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fake "Stranger" messages logic
  const strangerResponses = [
    "Hey there! How's it going?",
    "That's interesting.",
    "I'm using Klymo because I value privacy.",
    "Have you verified your gender?",
    "What do you do for fun?",
    "Cool!",
    "I gotta go soon, but nice chatting."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting
  // Socket Integration
  useEffect(() => {
    const initChat = async () => {
      const socket = await getSocket();

      // Handle incoming messages
      const messageHandler = (data: { from: string, message: string }) => {
        addMessage('stranger', data.message);
      };

      // Handle chat ended
      const endedHandler = (data: { reason: string }) => {
        addMessage('system', `Chat ended: ${data.reason}`);
        // Optional: Auto leave after a few seconds?
      };

      socket.on("chat:message", messageHandler);
      socket.on("chat:ended", endedHandler);

      return () => {
        socket.off("chat:message", messageHandler);
        socket.off("chat:ended", endedHandler);
      };
    };

    initChat();
  }, []);

  const addMessage = (sender: 'me' | 'stranger' | 'system', text: string) => {
    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender,
      text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const text = input;
    addMessage('me', text);
    setInput('');

    try {
      const socket = await getSocket();
      // We need to know the roomId. 
      // Current Backend implementation requires roomId for chat:message
      // If we don't have it passed in props, we might need to rely on 'socket.rooms' logic 
      // OR backend should infer room from socket in room.
      // Looking at backend: socket.on("chat:message", ({ roomId, message })

      // Since I don't have the roomId easily in this component yet (it came from App.tsx via event),
      // I need to assume App.tsx passes it or I can get it.
      // For now, let's assume we can get it or we update App.tsx to pass it.

      // IMPORTANT: I need to update App.tsx to store roomId.
      // For this step, I will emit slightly incorrectly until I fix App.tsx state.

      // Determine roomId? 
      // Actually, let's fetch it from socket rooms if possible? No.
      // I will add a TODO here and fix App.tsx to pass roomId.

      if (props.roomId) {
        socket.emit("chat:message", { roomId: props.roomId, message: text });
      } else {
        console.warn("No roomId available to send message");
      }

    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  // Helper to render name. 
  // We strip the #Discriminator for the UI to keep it clean, 
  // even though it exists in the data for system uniqueness.
  const renderName = (fullName: string) => {
    const cleanName = fullName.split('#')[0];
    return <span className="font-semibold text-white">{cleanName}</span>;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/95 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
            {partnerProfile.nickname[0].toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm">
              {renderName(partnerProfile.nickname)}
            </h3>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              {partnerProfile.gender} • {partnerProfile.bio || "No bio"}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="danger" onClick={onLeave} className="!p-2 !rounded-lg" title="Report & Leave">
            <Icons.XMark />
          </Button>
          <Button variant="secondary" onClick={onNext} className="!px-3 !py-2 !text-sm" title="Next Match">
            Next
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center text-xs text-slate-600 my-4">
          Chat is end-to-end encrypted. Messages are ephemeral.
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${msg.sender === 'me'
                ? 'bg-teal-600 text-white rounded-tr-none'
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
              }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-colors"
          />
          <Button type="submit" disabled={!input.trim()} className="!rounded-xl !px-4">
            <Icons.Send />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;