// src/pages/Messages.jsx
import React, { useState } from 'react';
import { Mail, Trash2, Archive, Star, Search } from 'lucide-react';

const dummyMessages = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    subject: 'Inquiry about a product',
    message: 'I would like to know more about the new gemstone collection. Can you provide more details?',
    date: '2025-11-10',
    read: false,
    starred: true,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    subject: 'Issue with my order',
    message: 'I received my order, but one of the items was damaged. My order number is #12345.',
    date: '2025-11-09',
    read: true,
    starred: false,
  },
  {
    id: 3,
    name: 'Peter Jones',
    email: 'peter.jones@example.com',
    subject: 'Feedback on my recent purchase',
    message: 'I just wanted to say that I am very happy with my purchase. The quality is excellent!',
    date: '2025-11-08',
    read: true,
    starred: true,
  },
];

const Messages = () => {
  const [messages, setMessages] = useState(dummyMessages);
  const [selectedMessage, setSelectedMessage] = useState(messages[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMessages = messages.filter(
    (message) =>
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                key={message.id}
                className={`p-4 cursor-pointer border-l-4 ${
                  selectedMessage?.id === message.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500'
                    : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex justify-between items-start">
                  <h3 className={`font-semibold ${!message.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                    {message.name}
                  </h3>
                  <span className={`text-xs ${!message.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                    {message.date}
                  </span>
                </div>
                <p className={`truncate text-sm ${!message.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                  {message.subject}
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
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedMessage.subject}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    From: {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Trash2 size={18} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Archive size={18} />
                  </button>
                  <button className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedMessage.starred ? 'text-yellow-500' : ''}`}>
                    <Star size={18} />
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
