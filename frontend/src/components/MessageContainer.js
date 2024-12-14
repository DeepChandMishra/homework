import React, {  } from 'react';
import MessageWindow from './MessageWindow';
import MessageInput from './MessageInput';

const MessageContainer = ({ selectedConversation }) => {
  



  return (
    <div className="chat-container flex flex-col w-3/4 p-4">
      {/* Header with doctor's name */}
      <div className="header text-xl font-semibold mb-4">
        Chatting with: {selectedConversation.name}
      </div>

      {/* Message Window */}
      <MessageWindow receiverId={selectedConversation.id} />

      {/* Message Input */}
      <MessageInput
        receiverId={selectedConversation.id} 
      />
    </div>
  );
};

export default MessageContainer;
