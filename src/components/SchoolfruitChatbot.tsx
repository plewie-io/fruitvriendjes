import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendChatMessage, startChatSession, resetChatSession, ChatMessage } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import { useIsMobile } from '@/hooks/use-mobile';
import annieAnanas from '@/assets/annie-ananas.png';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const INITIAL_MESSAGE: Message = { 
  role: 'assistant', 
  content: 'Hallo! 👋 Ik ben Annie de Ananas! Ik beantwoord al je vragen over schoolfruit en gezonde voeding!' 
};

const SUGGESTED_QUESTION = 'Wat is Fruitvriendjes?';

export const SchoolfruitChatbot = () => {
  const isMobile = useIsMobile();
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

  useEffect(() => {
    if (isOpen && !chatInitialized && !isInitializing) {
      initializeChat();
    }
  }, [isOpen]);

  // Don't render on mobile
  if (isMobile) return null;

  const initializeChat = async () => {
    setIsInitializing(true);
    try {
      const historyForAI: ChatMessage[] = messages
        .slice(1)
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

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading || isInitializing) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      if (!chatInitialized) {
        await initializeChat();
      }

      await sendChatMessage(textToSend, (streamedText) => {
        setMessages(prev => {
          const newMessages = [...prev];
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

  const showSuggestion = messages.length === 1 && !isLoading && !isInitializing;

  return (
    <>
      {/* Floating Chat Button - larger */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-20 h-20 rounded-full bg-background shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center overflow-hidden border-2 border-schoolfruit-yellow ${isOpen ? 'scale-0' : 'scale-100'}`}
        aria-label="Open chat"
      >
        <img src={annieAnanas} alt="Annie de Ananas" className="w-16 h-16 object-contain" />
      </button>

      {/* Chat Window - larger */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[400px] sm:w-[440px] h-[560px] bg-background rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
      >
        {/* Header */}
        <div className="bg-schoolfruit-yellow text-foreground p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-background/50 rounded-full flex items-center justify-center overflow-hidden">
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
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  message.role === 'user'
                    ? 'bg-schoolfruit-yellow text-foreground rounded-br-md'
                    : 'bg-background text-foreground shadow-sm rounded-bl-md'
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

          {/* Suggested question */}
          {showSuggestion && (
            <div className="flex justify-start">
              <button
                onClick={() => handleSend(SUGGESTED_QUESTION)}
                className="text-sm px-4 py-2 rounded-full border border-schoolfruit-yellow text-foreground hover:bg-schoolfruit-yellow/20 transition-colors"
              >
                💡 {SUGGESTED_QUESTION}
              </button>
            </div>
          )}

          {(isLoading || isInitializing) && (
            <div className="flex justify-start">
              <div className="bg-background p-3 rounded-2xl rounded-bl-md shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin text-schoolfruit-yellow" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-background border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Typ je vraag..."
              disabled={isLoading || isInitializing}
              className="flex-1 rounded-full border-muted focus:border-schoolfruit-yellow"
            />
            <Button
              onClick={() => handleSend()}
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
