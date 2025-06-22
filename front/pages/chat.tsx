import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { sendMessage, removeToken } from '../utils/api';
import { useRequireAuth } from '../utils/auth';
import { useRouter } from 'next/router';
import { formatAIResponse } from '../utils/messageFormatter';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const STORAGE_KEY = 'chat_messages';

export default function Chat() {
  const isAuthenticated = useRequireAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: 'Привет! Я ваш AI-ментор. Я помогу вам с проектами, задачами и обучением. Что бы вы хотели обсудить?',
    sender: 'ai',
    timestamp: new Date(),
  }]);
  
  useEffect(() => {
    // Загружаем сообщения из localStorage только на клиенте
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setMessages(parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })));
        } catch (e) {
          console.error('Failed to parse saved messages:', e);
        }
      }
    }
  }, []);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Сохраняем сообщения в localStorage только на клиенте
    if (typeof window !== 'undefined' && messages.length > 1) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    removeToken();
    router.push('/auth');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Функция для автоматической подстройки высоты
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // Максимальная высота 200px
    }
  };

  // Обработчик изменения текста
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    adjustTextareaHeight();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    setError(null);
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px';
    }
    setIsLoading(true);

    try {
      const response = await sendMessage(userMessage.text);
      const formattedResponse = formatAIResponse(response.response);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: formattedResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Чат с AI-ментором - PBLift</title>
      </Head>

      <div className="flex h-screen bg-gradient-to-br from-light to-white">
        {/* Сайдбар */}
        <div 
          className={`w-[260px] bg-white/70 backdrop-blur-xl border-r border-slate-100 flex flex-col transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-14 px-5 flex items-center border-b border-slate-100">
            <span className="text-[14px] font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PBLift AI
            </span>
          </div>

          <div className="flex-1 pt-3">
            <div className="px-3">
              <div className="space-y-[2px]">
                <button className="w-full h-9 px-3 text-[13px] font-medium rounded-md flex items-center gap-2.5 bg-primary text-white/90">
                  <i className="fas fa-robot text-[12px] opacity-80"></i>
                  AI-ментор
                </button>
                <button className="w-full h-9 px-3 text-[13px] text-dark/70 rounded-md flex items-center gap-2.5 hover:bg-slate-50 transition-colors">
                  <i className="fas fa-book text-[12px] opacity-70"></i>
                  Проекты
                </button>
                <button className="w-full h-9 px-3 text-[13px] text-dark/70 rounded-md flex items-center gap-2.5 hover:bg-slate-50 transition-colors">
                  <i className="fas fa-tasks text-[12px] opacity-70"></i>
                  Задачи
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-slate-100">
            <button 
              onClick={handleLogout}
              className="w-full h-9 px-3 text-[13px] text-dark/70 rounded-md flex items-center gap-2.5 hover:bg-slate-50 transition-colors"
            >
              <i className="fas fa-sign-out-alt text-[12px] opacity-70"></i>
              Выйти
            </button>
          </div>
        </div>

        {/* Основной контент */}
        <div className="flex-1 flex flex-col bg-white/60 backdrop-blur-xl">
          <div className="h-14 px-5 flex items-center justify-between border-b border-slate-100 bg-white/60 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-8 h-8 flex items-center justify-center text-dark/70 hover:bg-slate-50 rounded-md transition-colors"
              >
                <i className="fas fa-bars text-[12px]"></i>
              </button>
              <span className="text-[14px] font-medium text-dark">AI-ментор</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-[720px] mx-auto px-5 py-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-[13px] text-red-600">
                  {error}
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} group`}
                >
                  {message.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-md bg-primary/5 flex items-center justify-center mr-3 mb-auto">
                      <i className="fas fa-robot text-[12px] text-primary/70"></i>
                    </div>
                  )}
                  <div
                    className={`inline-block max-w-[85%] px-4 py-3 rounded-xl shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-primary text-white/90'
                        : 'bg-white border border-slate-100'
                    }`}
                  >
                    <p className={`text-[13px] leading-relaxed whitespace-pre-line ${
                      message.sender === 'user' ? 'text-white/90' : 'text-dark'
                    }`}>
                      {message.text}
                    </p>
                    <div
                      className={`text-[11px] mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                        message.sender === 'user' ? 'text-white/40' : 'text-slate-400'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-md bg-primary/5 flex items-center justify-center ml-3 mb-auto">
                      <i className="fas fa-user text-[12px] text-primary/70"></i>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-md bg-primary/5 flex items-center justify-center mr-3">
                    <i className="fas fa-robot text-[12px] text-primary/70"></i>
                  </div>
                  <div className="inline-block px-4 py-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-slate-100 bg-white/60 backdrop-blur-xl">
            <div className="max-w-[720px] mx-auto px-5 py-4">
              <form onSubmit={handleSubmit} className="flex items-start gap-3">
                <textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Напишите сообщение..."
                  className="flex-1 min-h-[40px] max-h-[200px] px-4 py-2 text-[13px] bg-white rounded-xl border border-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary/30 transition-colors resize-none overflow-hidden"
                  disabled={isLoading}
                  rows={1}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${
                    isLoading || !inputMessage.trim()
                      ? 'bg-slate-100 text-slate-400'
                      : 'bg-primary text-white shadow-sm hover:bg-primary/90'
                  }`}
                >
                  <i className="fas fa-arrow-up text-[12px]"></i>
                </button>
              </form>
              <div className="mt-2 text-[11px] text-slate-400">
                Нажмите Enter для отправки, Shift + Enter для переноса строки
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 