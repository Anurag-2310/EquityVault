import { useState } from "react";
import { Sparkles, Send, Database, ShieldCheck } from "lucide-react";
import { askAiVault } from "../services/api";
import "./AiVault.css";

function AiVault() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  const askQuestion = async (text = question) => {
    if (!text.trim()) return;

    setLoading(true);
    setAnswer(null);

    try {
      const holdings = JSON.parse(
        localStorage.getItem("equityvault_holdings") || "[]"
      );

      const result = await askAiVault(text, holdings);

      setAnswer(result);
    } catch (error) {
      console.error(error);

      setAnswer({
        answer: "Unable to connect to EquityVault Intelligence.",
        type: "error",
        data: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "What is my expected dividend?",
    "Which IPOs are currently open?",
    "Show latest dividends",
    "Show latest corporate actions",
  ];

  return (
    <div className="ai-vault-page">
      <div className="ai-vault-header">
        <div>
          <div className="ai-vault-kicker">
            <Sparkles size={15} />
            EQUITYVAULT INTELLIGENCE
          </div>

          <h1>AI Vault</h1>

          <p>
            Ask questions about your portfolio, dividends, IPOs and
            corporate actions.
          </p>
        </div>

        <div className="ai-source-badge">
          <ShieldCheck size={15} />
          Grounded in EquityVault data
        </div>
      </div>

      <div className="ai-vault-card">
        <div className="ai-orb">
          <Sparkles size={30} />
        </div>

        <h2>What would you like to know?</h2>

        <p className="ai-subtitle">
          Ask EquityVault Intelligence using your connected data.
        </p>

        <div className="ai-suggestions">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setQuestion(suggestion);
                askQuestion(suggestion);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div className="ai-input-row">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                askQuestion();
              }
            }}
            placeholder="Ask about your investments..."
          />

          <button onClick={() => askQuestion()} disabled={loading}>
            <Send size={18} />
          </button>
        </div>
      </div>

      {loading && (
        <div className="ai-answer-card">
          <div className="ai-loading">
            <Sparkles size={18} />
            Analyzing EquityVault data...
          </div>
        </div>
      )}

      {answer && !loading && (
        <div className="ai-answer-card">
          <div className="answer-label">
            <Sparkles size={15} />
            EQUITYVAULT INTELLIGENCE
          </div>

          <h3>{answer.answer}</h3>

          {answer.data?.length > 0 && (
            <div className="ai-data-list">
              {answer.data.map((item, index) => (
                <div className="ai-data-row" key={index}>
                  <div>
                    <strong>
                      {item.company || item.name || item.symbol}
                    </strong>

                    {item.symbol && (
                      <span>{item.symbol}</span>
                    )}
                  </div>

                  <div className="ai-data-value">
                    {item.expected_dividend !== undefined
                      ? `₹${Number(item.expected_dividend).toLocaleString("en-IN")}`
                      : item.price_band ||
                        (item.amount
                          ? `₹${item.amount}`
                          : item.type || "—")}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="ai-source">
            <Database size={14} />
            Source: {answer.source}
          </div>
        </div>
      )}
    </div>
  );
}

export default AiVault;