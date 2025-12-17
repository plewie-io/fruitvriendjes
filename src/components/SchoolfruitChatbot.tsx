import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import annieAnanas from '@/assets/annie-ananas.png';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export const SchoolfruitChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hallo! 👋 Ik ben Annie de Ananas! Ik beantwoord al je vragen over ons product en dienstverlening!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('schoolfruit-chat', {
        body: { question: userMessage }
      });

      if (error) throw error;

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.answer || 'Sorry, ik kon geen antwoord vinden.'
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Oeps! Er ging iets mis. Probeer het later nog eens.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-schoolfruit-yellow shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center overflow-hidden ${isOpen ? 'scale-0' : 'scale-100'}`}
        aria-label="Open chat"
      >
        <img src={annieAnanas} alt="Annie de Ananas" className="w-14 h-14 object-contain" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
      >
        {/* Header */}
        <div className="bg-schoolfruit-yellow text-foreground p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/50 rounded-full flex items-center justify-center overflow-hidden">
              <img src={annieAnanas} alt="Annie de Ananas" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h3 className="font-bold">Annie de Ananas</h3>
              <p className="text-xs text-foreground/70">Stel je vraag!</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-foreground/10 rounded-full transition-colors"
            aria-label="Sluit chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  message.role === 'user'
                    ? 'bg-schoolfruit-yellow text-foreground rounded-br-md'
                    : 'bg-white text-gray-800 shadow-sm rounded-bl-md'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin text-schoolfruit-yellow" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Typ je vraag..."
              disabled={isLoading}
              className="flex-1 rounded-full border-gray-200 focus:border-schoolfruit-yellow"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="rounded-full bg-schoolfruit-yellow hover:bg-schoolfruit-yellow/90 text-foreground"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
