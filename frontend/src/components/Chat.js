import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MessageContainer from './MessageContainer';

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="flex">
      <Sidebar onSelectConversation={handleSelectConversation} />
      {selectedConversation ? (
        <MessageContainer
          selectedConversation={selectedConversation} 
        />
      ) : (
        <div className="w-3/4 p-4">Select a conversation to start chatting.</div>
      )}
    </div>
  );
};

export default Chat;
