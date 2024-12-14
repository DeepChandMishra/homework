// src/socket.js
import { io } from 'socket.io-client';

// Initialize Socket.IO connection
const socket = io('http://localhost:3000'); // Update with your backend server URL

// Function to send message
const sendMessage = (senderId, receiverId, message, role) => {
  socket.emit('sendMessage', { senderId, receiverId, message, role });
};

// Listen for incoming messages
const listenForMessages = (callback) => {
  socket.on('newMessage', (newMessage) => {
    callback(newMessage);
  });
};

// Disconnect from server
const disconnectSocket = () => {
  socket.disconnect();
};

export { sendMessage, listenForMessages, disconnectSocket };
