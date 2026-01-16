import { useState, useRef, useEffect } from 'react';
import './App.css';
import whaleLogo from './assets/WhaleIcon.png';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 1. Use a Ref to access the chat container DOM element safely
  const chatContainerRef = useRef(null);

  // Auto-scroll whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 2. Ensure this points to your Flask backend port (usually 5000)
      // Note: If you get CORS errors, you need to enable CORS in Flask
      const res = await fetch('/chat', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'bot', text: data.response }]);
      
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { role: 'bot', text: "Whale wasn't found unfortunately..." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="text-blue-900 font-bold min-h-screen flex flex-col items-center justify-center">
      <img src={whaleLogo} alt="Whale Logo" className="w-40 h-40 mb-6" />
      <h1 className="text-5xl font-extrabold text-sky-500 mb-4">Whale</h1>

      <div className="bg-sky-500 p-8 rounded-lg shadow-lg w-full max-w-3xl mb-12">
        <p className='text-slate-100'>The whale is willing to answer anything on your mind, as it briefly re-surfaces to breath. Ask away before it's done and plunges back into the depths of the pacific ocean!</p>
        
        {/* 4. Attached the Ref to this div so we can scroll it */}
        <div 
          ref={chatContainerRef} 
          className="h-64 overflow-y-auto border border-slate-600 p-4 mb-4 bg-slate-700 rounded m-12"
        >
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded ${msg.role === 'user' ? 'bg-slate-100' : 'bg-blue-400'}`}>
                <b>{msg.role === 'user' ? 'You' : 'Whale'}:</b> {msg.text}
              </span>
            </div>
          ))}
          {isLoading && <div className="text-gray-400 italic">Thinking...</div>}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input 
            type="text" 
            autoComplete="off" 
            placeholder="Type your message..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 p-2 rounded text-slate-800 bg-slate-100 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-orange-400 hover:bg-orange-3 00 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}