import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Send, AlertCircle } from 'lucide-react';
import { analyzeProductWithAssistant, chatWithAssistant } from '../../api/assistantApi';

export default function AIPurchaseAssistant({ product }) {
  const [messages, setMessages] = useState([]);
  const [initialAnalysis, setInitialAnalysis] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (!product) return;

    const initializeAssistant = async () => {
      try {
        setIsAnalyzing(true);
        setError(null);
        
        const analysis = await analyzeProductWithAssistant(product);
        setInitialAnalysis(analysis);
        
        const initialMessage = {
          role: 'assistant',
          content: analysis.summary || "Hello! I'm your AI Purchase Assistant. How can I help you with this product?",
          pros: analysis.pros || [],
          cons: analysis.cons || []
        };
        
        setMessages([initialMessage]);
      } catch (err) {
        console.error("Assistant initialization failed:", err);
        setError(err.response?.data?.message || err.message || "AI Assistant is temporarily unavailable.");
      } finally {
        setIsAnalyzing(false);
      }
    };

    initializeAssistant();
  }, [product]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    
    if (!inputValue.trim() || isTyping) return;

    const userMessage = { role: 'user', content: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setError(null);

    try {
      // The first message is the AI's generated welcome analysis.
      // Bedrock strictly requires the first message to have role='user'.
      // We filter out the first welcome message and pass the analysis context separately.
      const apiMessages = messages.filter((_, idx) => idx !== 0);
      const chatHistory = [...apiMessages, userMessage];
      
      const result = await chatWithAssistant(chatHistory, product, initialAnalysis);
      
      setMessages(prev => [...prev, { role: 'assistant', content: result.response }]);
    } catch (err) {
      console.error("Chat failed:", err);
      setError(err.response?.data?.message || err.message || "Failed to send message. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  if (!product) return null;

  return (
    <div className="w-full my-6 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[500px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Sparkles className="w-5 h-5 text-[#14b8a6] mr-2" />
          <h2 className="text-sm font-bold text-gray-900">AI Purchase Assistant</h2>
        </div>
        <div className="flex items-center text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
          Powered by Amazon Bedrock
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-3">
            <Loader2 className="w-8 h-8 text-[#14b8a6] animate-spin" />
            <p className="text-sm font-medium">Analyzing product details...</p>
          </div>
        ) : error && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-red-500 space-y-2 p-4 text-center">
            <AlertCircle className="w-8 h-8" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#007185] text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                
                {msg.role === 'assistant' && msg.pros && msg.pros.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="font-bold text-xs text-green-700 uppercase tracking-wider">Pros</p>
                    <ul className="list-disc pl-4 space-y-1">
                      {msg.pros.map((pro, i) => <li key={i} className="text-gray-600">{pro}</li>)}
                    </ul>
                  </div>
                )}
                
                {msg.role === 'assistant' && msg.cons && msg.cons.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="font-bold text-xs text-red-700 uppercase tracking-wider">Considerations</p>
                    <ul className="list-disc pl-4 space-y-1">
                      {msg.cons.map((con, i) => <li key={i} className="text-gray-600">{con}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
        
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 flex items-center space-x-2 shadow-sm">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Toast */}
      {error && messages.length > 0 && (
        <div className="bg-red-50 border-t border-red-100 p-2 px-4 flex items-center text-red-600 text-xs font-medium">
          <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
          {error}
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex items-center space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about this product..."
          className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-[#007185] focus:border-[#007185] block px-4 py-2.5 outline-none"
          disabled={isAnalyzing || isTyping}
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isAnalyzing || isTyping}
          className="bg-[#007185] hover:bg-[#005a6a] disabled:opacity-50 disabled:hover:bg-[#007185] text-white p-2.5 rounded-full transition-colors flex items-center justify-center"
        >
          <Send className="w-4 h-4 ml-0.5 mb-0.5" />
        </button>
      </form>
    </div>
  );
}
