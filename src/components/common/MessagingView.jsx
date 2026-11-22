import React, { useState } from 'react';
import {
  Send,
  Paperclip,
  Phone,
  Info,
  Sparkles,
  Check,
  CheckCheck,
  Image,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export const MessagingView = ({ partnerName, partnerRole, onBack }) => {
  const { currentUser } = useAuth();
  const { messages, sendMessage } = useDatabase();
  const [inputText, setInputText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const activePartner = partnerName || (currentUser?.role === 'customer' ? 'EVEX Events Co.' : 'Keerthana Anand');

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    sendMessage({
      receiverId: 'partner_1',
      receiverName: activePartner,
      text: inputText
    });
    setInputText('');
  };

  const handleSendThemeSample = () => {
    sendMessage({
      receiverId: 'partner_1',
      receiverName: activePartner,
      text: 'Sure! Here are a few theme options based on your preferences:',
      images: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400',
        'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400'
      ]
    });
    setShowAttachMenu(false);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full h-[85vh]">
      <div className="flex-1 flex flex-col rounded-3xl bg-white border border-[#EAE5DE] shadow-xs overflow-hidden">
        {/* Chat Header matching reference mockup bottom-center */}
        <div className="p-4 px-6 bg-white border-b border-[#EAE5DE] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4B0718] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#242424]">{activePartner}</h3>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#736B66]">
            <button
              onClick={() => alert(`Calling ${activePartner}... (Connecting via WebRTC)`)}
              className="p-2 rounded-xl hover:bg-[#F8F7F5] hover:text-[#4B0718] border border-[#EAE5DE] transition"
              title="Voice Call"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => alert(`Agency: ${activePartner}\nStatus: Verified\nRating: 4.9 ★`)}
              className="p-2 rounded-xl hover:bg-[#F8F7F5] hover:text-[#4B0718] border border-[#EAE5DE] transition"
              title="Info"
            >
              <Info className="w-4 h-4" />
            </button>
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-xl hover:bg-[#F8F7F5] border border-[#EAE5DE] transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 p-6 overflow-y-auto no-scrollbar space-y-4 bg-[#F8F7F5]/40">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser?.id || msg.senderId === currentUser?.uid || msg.senderName === currentUser?.name;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[65%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-white border border-[#EAE5DE] text-[#242424] rounded-tr-xs'
                      : 'bg-[#FFF8F3] border border-[#EAE5DE] text-[#242424] rounded-tl-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Attached images grid matching reference mockup */}
                  {msg.images && msg.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-[#EAE5DE]">
                      {msg.images.map((imgUrl, i) => (
                        <div key={i} className="h-16 sm:h-20 rounded-lg overflow-hidden border border-[#EAE5DE]">
                          <img
                            src={imgUrl}
                            alt="Theme Option"
                            className="w-full h-full object-cover hover:scale-105 transition cursor-pointer"
                            onClick={() => window.open(imgUrl, '_blank')}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-1 mt-1.5 text-[10px] text-[#736B66]">
                    <span>{msg.timestamp || 'Just now'}</span>
                    <CheckCheck className="w-3 h-3 text-[#4B0718]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar matching reference mockup bottom-center */}
        <div className="p-4 bg-white border-t border-[#EAE5DE]">
          <form onSubmit={handleSend} className="flex items-center gap-2 relative">
            <button
              type="button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className="p-2.5 rounded-xl border border-[#EAE5DE] text-[#736B66] hover:text-[#4B0718] hover:bg-[#F8F7F5] transition"
              title="Attach decor photos"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Quick Attachment Popup */}
            {showAttachMenu && (
              <div className="absolute bottom-14 left-0 p-2 bg-white rounded-2xl border border-[#EAE5DE] shadow-xl z-20 space-y-1 text-xs">
                <button
                  type="button"
                  onClick={handleSendThemeSample}
                  className="w-full text-left p-2 hover:bg-[#F8F7F5] rounded-xl flex items-center gap-2 text-[#242424] font-medium"
                >
                  <Image className="w-4 h-4 text-[#4B0718]" />
                  <span>Send Wedding Decor Samples</span>
                </button>
              </div>
            )}

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-[#F8F7F5] border border-[#EAE5DE] rounded-xl py-2.5 px-4 text-xs text-[#242424] placeholder-[#736B66] focus:outline-none focus:border-[#4B0718]"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-10 h-10 rounded-xl bg-[#4B0718] hover:bg-[#350713] text-white flex items-center justify-center shadow-xs transition active:scale-95 disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
