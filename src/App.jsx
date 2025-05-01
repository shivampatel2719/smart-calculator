import React from 'react';
import Calculator from './components/Calculator';
import Chatbot from './components/Chatbot';
import { Routes, Route } from 'react-router-dom';
import AuditTrail from './components/AuditTrail';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Calculator />} />
        <Route path="/audit-logs" element={<AuditTrail />} />
        <Route path="/chat" element={<Chatbot />} />
      </Routes>
    </div>
  );
}

export default App; 