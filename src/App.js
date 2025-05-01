import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calculator from './components/Calculator';
import AuditTrail from './components/AuditTrail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/audit-logs" element={<AuditTrail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
