import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendChatMessage, startChatSession, resetChatSession, ChatMessage } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import annieAnanas from '@/assets/annie-ananas.png';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const INITIAL_MESSAGE: Message = { 
  role: 'assistant', 
  content: 'Hallo! 👋 Ik ben Annie de Ananas! Ik beantwoord al je vragen over schoolfruit en gezonde voeding!' 
};

export const SchoolfruitChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [chatInitialized, setChatInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat session when chat is opened for the first time
  useEffect(() => {
    if (isOpen && !chatInitialized && !isInitializing) {
      initializeChat();
    }
  }, [isOpen]);

  const initializeChat = async () => {
    setIsInitializing(true);
    try {
      // Convert messages to ChatMessage format (excluding initial greeting)
      const historyForAI: ChatMessage[] = messages
        .slice(1) // Skip the initial greeting
        .map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          content: msg.content
        }));
      
      await startChatSession(historyForAI);
      setChatInitialized(true);
      console.log("✅ Chat session initialized");
    } catch (error) {
      console.error("Failed to initialize chat:", error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || isInitializing) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Add placeholder for streaming response
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      // Initialize chat if not already done
      if (!chatInitialized) {
        await initializeChat();
      }

      // Use streaming with callback to update message in real-time
      await sendChatMessage(userMessage, (streamedText) => {
        setMessages(prev => {
          const newMessages = [...prev];
          // Update the last message (assistant's response)
          newMessages[newMessages.length - 1] = { 
            role: 'assistant', 
            content: streamedText 
          };
          return newMessages;
        });
      });
    } catch (error: any) {
      console.error('Chat error:', error);
      
      let errorMessage = 'Oeps! Er ging iets mis. Probeer het later nog eens. 🍍';
      
      // Check if this is a safety block error
      if (error?.name === 'SafetyBlockError' || error?.message === 'SAFETY_BLOCK') {
        errorMessage = 'Hé, laten we het over iets anders hebben! 🍎 Stel me een vraag over fruit, groente of gezond eten!';
      }
      
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          role: 'assistant', 
          content: errorMessage 
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    resetChatSession();
    setMessages([INITIAL_MESSAGE]);
    setChatInitialized(false);
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
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-white shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center overflow-hidden border-2 border-schoolfruit-yellow ${isOpen ? 'scale-0' : 'scale-100'}`}
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
          <div className="flex items-center gap-1">
            <button
              onClick={handleNewChat}
              className="p-1 hover:bg-foreground/10 rounded-full transition-colors"
              aria-label="Nieuw gesprek"
              title="Nieuw gesprek"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-foreground/10 rounded-full transition-colors"
              aria-label="Sluit chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}
          {(isLoading || isInitializing) && (
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
              disabled={isLoading || isInitializing}
              className="flex-1 rounded-full border-gray-200 focus:border-schoolfruit-yellow"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || isInitializing}
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
