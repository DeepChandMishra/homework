import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';

const MessageWindow = ({ receiverId }) => {
  const [messages, setMessages] = useState([]);
  const loggedInUserId = localStorage.getItem('userId');

  // Use useCallback to memoize the fetchMessages function to prevent unnecessary re-renders
  const fetchMessages = useCallback(async () => {
    console.log('Fetching messages for receiverId:', receiverId);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/messages/${receiverId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 200) {
        console.log('Messages fetched successfully:', response.data);

        const { senderMessages, receiverMessages } = response.data;

        // Handle cases where no messages exist
        if (senderMessages.length === 0 && receiverMessages.length === 0) {
          setMessages([]);
          return;
        }

        // If there are no sender messages, show only receiver messages, and vice versa
        const allMessages = [
          ...(senderMessages.length > 0 ? senderMessages : []),
          ...(receiverMessages.length > 0 ? receiverMessages : [])
        ];

        // Update the state with unique messages only
        setMessages(prevMessages => {
          const uniqueMessages = [...prevMessages, ...allMessages].filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.timestamp === value.timestamp)
          );
          return uniqueMessages; // Set only unique messages
        });
      } else {
        console.error('Failed to fetch messages. Status code:', response.status);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [receiverId]);

  // Memoize the sorted messages to avoid unnecessary re-renders and recalculations
  const sortedMessages = useMemo(() => {
    const allMessages = [...messages]; // Create a copy to avoid mutating the state directly

    // Sort messages by timestamp
    return allMessages.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
  }, [messages]); // Only recompute if the 'messages' array changes

  useEffect(() => {
    if (receiverId) {
      fetchMessages();
    }
  }, [receiverId, fetchMessages]); // Add fetchMessages to dependency array

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 overflow-y-auto mb-4 p-2">
      {sortedMessages.map((msg, index) => {
        const isSender = msg.senderId === loggedInUserId; // Check if logged-in user is the sender
        return (
          <div
            key={index} // Unique key for each message
            className={`message my-2 ${isSender ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`p-3 rounded-lg ${isSender ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'} max-w-[60%] mx-auto`}
              style={{ maxWidth: '60%' }} // Adjust the max width of the message box
            >
              <div>{msg.message}</div>
              <div className="text-xs text-gray-500 mt-1">
                {formatTimestamp(msg.timestamp)} {/* Timestamp below the message */}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageWindow;
