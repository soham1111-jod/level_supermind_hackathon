
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Navbar from './components/Navbar'; // Corrected import path
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const btnSend = async () => {
    if (inputValue.trim() === '') return;

    const userMessage = { sender: 'user', text: inputValue };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5500/chat', {
        inputValue: userMessage.text,
      });

      const botMessage = { sender: 'bot', text: response.data.output || 'No response received.' };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { sender: 'bot', text: 'Error communicating with server.' };
      setMessages([...messages, userMessage, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Navbar /> */}

      <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <Navbar />
        <div className="flex h-full">
          {/* Left Sidebar */}
          <div className="w-1/4 max-h-full bg-gray-800 p-6 flex flex-col space-y-6 shadow-lg ">
            {/* App Details + About Section */}
            {/* <div className="card-wrapper h-auto animate-border-spin"> */}
              <div className="card-content p-4 border-double border-4 border-sky-500">
                <h1 className="text-2xl font-bold mb-1">Influence.AI</h1>
                <p className="text-sm text-gray-400 mb-4">v1.0</p>
                <h2 className="text-lg font-semibold mb-2">About</h2>
                <p className="text-gray-400 text-sm">
                  I can help you analyze data and provide insights. Just ask me anything!
                </p>
              </div>
            {/* </div> */}

            {/* Tips Section */}
            {/* <div className="card-wrapper h-auto animate-border-spin"> */}
            <div className="card-content p-4 border-double border-4 border-sky-500">
                <h2 className="text-lg font-semibold mb-2">Tips</h2>
                <ul className="text-gray-400 space-y-2 text-sm">
                  <li>• Ask about performance metrics</li>
                  <li>• Compare different periods</li>
                  <li>• Request specific insights</li>
                </ul>
              </div>
            {/* </div> */}

            {/* Team Members Section */}
            {/* <div className="card-wrapper h-auto animate-border-spin"> */}
            <div className="card-content p-4 border-double border-4 border-sky-500">
                <h2 className="text-lg font-semibold mb-2">Team Members</h2>
                <ul className="text-gray-400 space-y-2 text-sm">
                  <li>Soham</li>
                  <li>Pushendra</li>
                  <li>Ayush</li>
                  <li>Devang</li>
                </ul>
              </div>
            {/* </div> */}
          </div>





          {/* Chat Section */}
          <div className="flex-1 max-h-full flex flex-col justify-between p-8">
            {/* Chat Box */}
            <div className="flex-1 bg-gray-900 rounded-lg shadow-lg p-4 overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`${message.sender === "user"
                    ? "bg-blue-600 text-white self-end w-full"
                    : "bg-gray-700 text-gray-300 self-start w-full"
                    } p-3 rounded-lg mb-2 max-w-sm`}
                >
                  {message.text}
                </div>
              ))}
              {loading && (
                <div className="self-start p-3 bg-gray-700 rounded-lg mb-2 max-w-sm">
                  <div className="border-4 border-t-blue-500 border-gray-300 rounded-full w-6 h-6 animate-spin"></div>
                </div>
              )}
            </div>

            {/* Input Section */}
            <div className="flex mt-4">
              <input
                type="text"
                placeholder="Ask about your analytics..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 p-4 rounded-l-lg bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={btnSend}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-r-lg transition duration-300 border-blue border-opacity-100">

                Send <FontAwesomeIcon icon={faPaperPlane} size="md" className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default App;