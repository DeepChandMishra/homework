const socketIo = require('socket.io');
const { Message } = require('./models');

// Function to initialize the socket connection and handle events
const initSocket = (server) => {
  const io = socketIo(server); // Attach Socket.IO to your server

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Log when a user joins a room
    socket.on('join', (userId) => {
      socket.join(userId); // Associate socket with userId
      console.log(`User ${userId} joined the room`);
    });

    // Handle sendMessage event
    socket.on('sendMessage', async (messageData) => {
      try {
        const { senderId, receiverId, message, role } = messageData;

        // Log the incoming message data
        console.log('Received message data:', { senderId, receiverId, message, role });

        // Save the message to the database
        const newMessage = await Message.create({
          senderId,
          receiverId,
          message,
          role,
        });

        // Log the message saved to the database
        console.log('Message saved to database:', newMessage);

        // Emit the message to the receiver
        io.to(receiverId).emit('newMessage', newMessage);
        console.log(`Message sent to receiver ${receiverId}:`, newMessage);
      } catch (error) {
        console.error('Error in sendMessage event:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = { initSocket };
