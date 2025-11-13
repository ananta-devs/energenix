import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Trash2, Search, Reply } from 'lucide-react';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/contacts`);
      setMessages(response.data);
      setSelectedMessage(response.data[0] || null);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/contacts/${id}`);
      const updatedMessages = messages.filter((message) => message._id !== id);
      setMessages(updatedMessages);
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(updatedMessages[0] || null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const filteredMessages = messages.filter(
    (message) =>
      (message.fullName && message.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (message.message && message.message.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-150px)]">
            <div className="lg:w-1/3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
            <div className="lg:w-2/3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
               <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
               <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 min-w-0">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
        Messages
      </h1>
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-150px)]">
        {/* Message List */}
        <div className="lg:w-1/3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          <div className="overflow-y-auto">
            {filteredMessages.map((message) => (
              <div
                key={message._id}
                className={`p-4 cursor-pointer border-l-4 ${
                  selectedMessage?._id === message._id
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500'
                    : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex justify-between items-start">
                  <h3 className={`font-semibold text-gray-900 dark:text-white`}>
                    {message.fullName}
                  </h3>
                  <span className={`text-xs text-gray-700 dark:text-gray-300`}>
                    {new Date(message.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className={`truncate text-sm text-gray-700 dark:text-gray-300`}>
                  {message.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Message Content */}
        <div className="lg:w-2/3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
          {selectedMessage ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedMessage.fullName}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    From: {selectedMessage.fullName} &lt;{selectedMessage.email}&gt;
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" onClick={() => handleDelete(selectedMessage._id)}>
                    <Trash2 size={18} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    <Reply size={18} />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Mail size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
