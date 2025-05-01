import React, { useState, useEffect } from "react";
import { logAuditEvent } from "../utils/auditLogger";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import "./Calculator.css";

const Calculator = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const navigate = useNavigate();

  const handleAuditClick = () => {
    navigate("/audit-logs");
  };

  const handleNumberClick = (num) => {
    setInput((prev) => prev + num);
    logAuditEvent("numberEntered", num);
  };

  const handleOperatorClick = (operator) => {
    if (input === "" && operator !== "-") return;
    setInput((prev) => prev + operator);
    logAuditEvent("operatorEntered", operator);
  };

  const handleClear = () => {
    setInput("");
    setResult("");
    logAuditEvent("clearPressed", "C");
  };

  const handleEquals = () => {
    try {
      const evalResult = eval(input);
      setResult(evalResult);
      logAuditEvent("operatorEntered", "=");
      logAuditEvent("resultCalculated", evalResult.toString());
    } catch {
      setResult("Error");
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
        const key = e.key;
        if (!isNaN(key)) {
          handleNumberClick(key);
        } else if (["+", "-", "*", "/", "="].includes(key)) {
          handleOperatorClick(key);
        } else if (key === "Enter") {
          handleEquals();
        } else if (key.toLowerCase() === "c") {
          handleClear();
        } else if (key === "Shift") {
          // Do nothing for Shift alone
        } else if (key === "Equal" && e.shiftKey) {
          handleOperatorClick("+"); // Shift + =
        } else if (key === "8" && e.shiftKey) {
          handleOperatorClick("*"); // Shift + 8
        } else if (key === "Slash") {
          handleOperatorClick("/"); // Slash key
        }
      };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const buttons = [
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", "C", "=", "+"
  ];

  return (
    <div className="calculator">
      <div className="header-container">
        <h1 className="calculator-heading">SmartCalculator</h1>
        <button
          className="audit-button"
          onClick={handleAuditClick}
          title="View Audit Logs"
        >
          <FontAwesomeIcon icon={faClipboardList} className="audit-icon" />
        </button>
      </div>
      <div className="display">
        <div className="input">{input}</div>
        <div className="result">{result}</div>
      </div>
      <div className="buttons">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (!isNaN(btn)) handleNumberClick(btn);
              else if (btn === "C") handleClear();
              else if (btn === "=") handleEquals();
              else handleOperatorClick(btn);
            }}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
