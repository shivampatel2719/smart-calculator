import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const CHAT_ENDPOINT_URL = "https://k2d8tyukj2.execute-api.us-east-1.amazonaws.com/chat";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch(CHAT_ENDPOINT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
          "Access-Control-Allow-Headers": "Content-Type"
        },
        body: JSON.stringify({ query: userMessage }),
      });

      const data = await response.json();
      const botResponse = data.response;
      
      setMessages(prev => [...prev, { type: 'bot', content: botResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: 'Sorry, I encountered an error processing your request.' 
      }]);
    }
    
    setLoading(false);
  };

  return (
    <div className="chatbot">
      <div className="header-container">
        <h1 className="chatbot-heading">SmartCalculator Chat</h1>
        <button
          className="back-button"
          onClick={() => window.history.back()}
        >
          Back
        </button>
      </div>
      
      <div className="chat-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            {message.content}
          </div>
        ))}
        {loading && <div className="message bot">Thinking...</div>}
      </div>

      <form onSubmit={handleSubmit} className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your calculations..."
          className="chat-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
