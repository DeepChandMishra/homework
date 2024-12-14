import React, { useState } from 'react';
import axios from 'axios';

const MessageInput = ({ receiverId }) => {
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (newMessage.trim()) {
      try {
        console.log('Sending message:', { receiverId, message: newMessage });
        
        const response = await axios.post(
          `http://localhost:5000/api/messages/send/${receiverId}`,
          { message: newMessage },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (response.status === 201) {
          console.log('Message sent successfully:', response.data);
          setNewMessage(''); // Clear the input field
          setError(''); // Clear any existing errors
        }
      } catch (error) {
        console.error('Error sending message:', error);
        setError(error.response?.data?.error || 'Failed to send message.');
      }
    } else {
      console.warn('Message is empty');
      setError('Message cannot be empty.');
    }
  };

  return (
    <div className="message-input flex items-center p-2 border-t border-gray-200">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="flex-1 p-2 border rounded-lg"
        placeholder="Type a message..."
      />
      <button
        onClick={handleSend}
        className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
      >
        Send
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default MessageInput;
