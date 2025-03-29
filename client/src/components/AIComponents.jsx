import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot, // For DostAI
  faBrain, // For AIHelp
  faBook, // For AIDoc
  faBolt, // For AIOptimizer
  faTimes,
  faPaperPlane,
  faBookOpen, faCode,
} from "@fortawesome/free-solid-svg-icons";
import { fetchAifyResponse } from "../services/geminiService";


const aiButtonStyles = `
  .ai-button {
    position: relative;
    color: #FFFFFF;
    padding: 10px 20px;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    transform: translateY(0);
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .ai-button::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .ai-button:hover:not(:disabled) {
    transform: translateY(-4px);
     }

  .ai-button:hover::before {
    opacity: 1;
  }

  .ai-button:active:not(:disabled) {
    transform: translateY(2px);
     }

  .ai-button:disabled {
    background: #666666;
    cursor: not-allowed;
    box-shadow: none;
  }

  .ai-button .icon {
    margin-right: 8px;
  }

  .ai-button .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid #1a1a1a;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 8px;
  }

  .ai-button {
  background: linear-gradient(45deg, #27ae60, #f1c40f);
  box-shadow: 0 6px 12px rgba(39, 174, 96, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3);
}
.ai-button:hover:not(:disabled) {
  box-shadow: 0 10px 20px rgba(39, 174, 96, 0.6), 0 4px 8px rgba(0, 0, 0, 0.4);
}
.ai-button:active:not(:disabled) {
  box-shadow: 0 2px 4px rgba(39, 174, 96, 0.2), 0 1px 2px rgba(0, 0, 0, 0.2);
}
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Add this to your CSS file (e.g., `index.css`)
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = aiButtonStyles;
  document.head.appendChild(styleSheet);
}

// DostAI (Floating Chatbo

const DostAI = ({ editorContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]); // Store chat history

  const fetchDostAIResponse = async (mode) => {
    if (!query.trim()) return;
    setLoading(true);
    const userMessage = { type: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);

    try {
      let prompt;
      if (mode === "understand") {
        prompt = `In Hinglish, explain this programming concept or answer this question related to coding: "${query}". Use simple, friendly language like a dost (friend) would.`;
      } else if (mode === "getcode") {
        prompt = `Generate code for this request: "${query}". Provide only the code without any explanation, formatted properly for the language most relevant to the request (e.g., JavaScript, Python, etc.).`;
      }
      const res = await fetchAifyResponse(prompt);
      const aiResponse = res || (mode === "understand" ? "Kuch samajh nahi aaya, thodi aur detail de!" : "// No code generated, try again!");
      setMessages((prev) => [...prev, { type: "ai", text: aiResponse }]);
      setResponse(aiResponse);
    } catch (error) {
      const errorMessage = mode === "understand" ? "Sorry yaar, kuch gadbad ho gaya!" : "// Error generating code!";
      setMessages((prev) => [...prev, { type: "ai", text: errorMessage }]);
      setResponse(errorMessage);
    } finally {
      setLoading(false);
      setQuery(""); // Clear input after sending
    }
  };

  return (
    <div
      className={
        isOpen
          ? "fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 p-4"
          : "relative"
      }
    >
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-background py-3 px-5 rounded-xl font-semibold uppercase shadow-lg hover:from-orange-600 hover:to-red-700 hover:shadow-xl hover:-translate-y-1 active:translate-y-0.5 active:shadow-md transition-all duration-300 disabled:bg-gray-600 disabled:shadow-none disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2"></span>
              Loading...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faRobot} className="mr-2" />
              DostAI
            </>
          )}
        </button>
      )}
      {isOpen && (
        <div className="bg-tertiary rounded-2xl shadow-2xl w-full max-w-lg h-[36rem] flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="flex justify-between items-center p-4 border-b border-quaternary">
            <h4 className="text-teal text-xl font-bold">DostAI</h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-octonary hover:text-hover-teal transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-quinary scrollbar-track-background">
            {messages.length === 0 ? (
              <p className="text-senary text-center italic">
                Abhi koi baat nahi hui, chalo shuru karte hain!
              </p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 p-3 rounded-lg max-w-[80%] text-sm ${
                    msg.type === "user"
                      ? "bg-quaternary text-octonary ml-auto"
                      : "bg-background text-octonary border border-senary"
                  }`}
                >
                  {msg.text}
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-quaternary flex flex-col gap-3">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pooch na, coding mein kya samajhna hai ya code chahiye?"
              className="w-full bg-quaternary text-octonary border border-senary rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal disabled:opacity-60 disabled:cursor-not-allowed"
              rows="2"
              disabled={loading}
            />
            <div className="flex gap-3">
              <button
                onClick={() => fetchDostAIResponse("understand")}
                className="flex-1 bg-teal text-background py-2 px-4 rounded-lg hover:bg-hover-teal transition-all duration-200 flex items-center justify-center disabled:bg-senary disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2"></span>
                    Loading...
                  </span>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faBookOpen} className="mr-2" />
                    Understand Code
                  </>
                )}
              </button>
              <button
                onClick={() => fetchDostAIResponse("getcode")}
                className="flex-1 bg-teal text-background py-2 px-4 rounded-lg hover:bg-hover-teal transition-all duration-200 flex items-center justify-center disabled:bg-senary disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2"></span>
                    Loading...
                  </span>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCode} className="mr-2" />
                    Get Code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



// AIHelp (Error Detection and Comments)
const AIHelp = ({ editorContent, onContentChange }) => {
  const [loading, setLoading] = useState(false);

  const fetchAIHelpResponse = async () => {
    setLoading(true);
    try {
      const prompt = `Analyze this code:\n${editorContent}\nFind any mistakes and add comments explaining them. Return the code with comments added where errors are found.`;
      const res = await fetchAifyResponse(prompt);
      onContentChange(res || editorContent);
    } catch (error) {
      onContentChange(`${editorContent}\n// Sorry, AIHelp couldn’t analyze this code!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={fetchAIHelpResponse}
      className="ai-button w-full flex items-center justify-center"
      disabled={loading}
    >
      {loading ? (
        <>
          <span className="spinner"></span>
          Loading...
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faBrain} className="icon" />
          AIHelp
        </>
      )}
    </button>
  );
};

// AIDoc (Documentation and Example)
const AIDoc = ({ editorContent, onContentChange }) => {
  const [loading, setLoading] = useState(false);

  const fetchAIDocResponse = async () => {
    setLoading(true);
    try {
      const prompt = `Generate detailed documentation for this code:\n${editorContent}\nInclude a real-life example of how this code could be used. Return the result as comments at the top of the original code.`;
      const res = await fetchAifyResponse(prompt);
      onContentChange(res || editorContent);
    } catch (error) {
      onContentChange(`${editorContent}\n// Sorry, AIDoc couldn’t generate documentation!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={fetchAIDocResponse}
      className="ai-button w-full flex items-center justify-center"
      disabled={loading}
    >
      {loading ? (
        <>
          <span className="spinner"></span>
          Loading...
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faBook} className="icon" />
          AIDoc
        </>
      )}
    </button>
  );
};

// AIOptimizer (Alternative Approaches)
const AIOptimizer = ({ editorContent, onContentChange }) => {
  const [loading, setLoading] = useState(false);

  const fetchAIOptimizerResponse = async () => {
    setLoading(true);
    try {
      const prompt = `Analyze this code:\n${editorContent}\nSuggest 2-3 different optimized approaches to solve the same problem. Return the original code followed by the alternative solutions as comments.`;
      const res = await fetchAifyResponse(prompt);
      onContentChange(res || editorContent);
    } catch (error) {
      onContentChange(`${editorContent}\n// Sorry, AIOptimizer couldn’t suggest alternatives!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={fetchAIOptimizerResponse}
      className="ai-button w-full flex items-center justify-center"
      disabled={loading}
    >
      {loading ? (
        <>
          <span className="spinner"></span>
          Loading...
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faBolt} className="icon" />
          AIOptimizer
        </>
      )}
    </button>
  );
};

export { DostAI, AIHelp, AIDoc, AIOptimizer };