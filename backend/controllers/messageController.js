const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { Op, Sequelize } = require('sequelize'); 
const moment = require('moment');
const { Doctor } = require('../models');




const getUserIdFromDoctorId = async (doctorId) => {
  const doctor = await Doctor.findOne({ where: { id: doctorId } });
  if (!doctor) {
    throw new Error(`Doctor not found with id: ${doctorId}`);
  }
  return doctor.userId; // Return the userId associated with the doctor
};

exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.userId; // The logged-in user's userId
    const receiverId = Number(req.params.id); // Receiver ID from the request params
    const { message } = req.body;

    if (!message || !receiverId) {
      return res.status(400).json({ error: 'Message and receiverId are required.' });
    }

    const timestamp = moment().toISOString();
    const createdAt = moment().toISOString();

    let senderRoleId = senderId; // Default to the logged-in user's userId
    let receiverRoleId = receiverId; // Default to the receiver's userId

    // Resolve IDs based on roles
    if (req.user.role === 'doctor') {
      senderRoleId = await getUserIdFromDoctorId(req.user.doctorId);
    } else if (req.user.role === 'patient') {
      receiverRoleId = await getUserIdFromDoctorId(receiverId);
    } else {
      return res.status(400).json({ error: 'Invalid user role.' });
    }

    // Ensure that senderRoleId always comes first, followed by receiverRoleId
    const participants = [String(senderRoleId), String(receiverRoleId)]; // Ensure both are strings for strict matching

    // Search for the conversation with participants [sender, receiver]
    let conversation = await Conversation.findOne({
      where: Sequelize.where(
        Sequelize.fn('JSON_CONTAINS', Sequelize.col('participants'), JSON.stringify(participants)),
        true
      ),
    });

    if (!conversation) {
      // If no conversation is found for [sender, receiver], create a new one
      conversation = await Conversation.create({
        participants: JSON.stringify(participants), // Ensure proper serialization as JSON string
        messages: [
          {
            senderId: senderRoleId,
            receiverId: receiverRoleId,
            message,
            timestamp,
            createdAt,
          },
        ],
      });
    } else {
      // If conversation is found, append the new message to the existing conversation
      await Conversation.update(
        {
          messages: Sequelize.fn(
            'JSON_ARRAY_APPEND',
            Sequelize.col('messages'),
            '$',
            Sequelize.literal(
              `'{ "senderId": ${senderRoleId}, "receiverId": ${receiverRoleId}, "message": "${message}", "timestamp": "${timestamp}", "createdAt": "${createdAt}" }'`
            )
          ),
        },
        { where: { id: conversation.id } }
      );
    }

    // Save the message in the Message table
    const newMessage = await Message.create({
      senderId: senderRoleId,
      receiverId: receiverRoleId,
      message,
      role: req.user.role,
      conversationId: conversation.id,
      timestamp,
      createdAt,
    });

    return res.status(201).json({
      message: 'Message sent successfully',
      conversationId: conversation.id,
      newMessage,
    });
  } catch (error) {
    console.error('Error while sending message:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};














exports.getMessages = async (req, res) => {
  try {
    const senderUserId = req.user.userId; // Logged-in user's userId
    const receiverIdFromFrontend = Number(req.params.id);

    let senderRoleId = senderUserId;
    let receiverRoleId = receiverIdFromFrontend;

    // If sender is a doctor, get the userId from the Doctor model using the sender's doctor id
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ where: { id: senderUserId } });
      if (doctor) {
        senderRoleId = doctor.userId; // Use the userId from the Doctor model
      } else {
        return res.status(400).json({ error: 'Doctor not found.' });
      }
    }

    // If the sender is a patient, check if the receiver is a doctor and get the userId
    if (req.user.role === 'patient') {
      const doctorReceiver = await Doctor.findOne({ where: { id: receiverIdFromFrontend } });
      if (doctorReceiver) {
        receiverRoleId = doctorReceiver.userId; // Use the receiver's userId from the Doctor model
      } else {
        return res.status(400).json({ error: 'Doctor receiver not found.' });
      }
    }

    // Ensure consistent ordering of participants (so the array always looks the same)
    const participants = [senderRoleId, receiverRoleId].sort((a, b) => a - b);

    // Find the conversation based on participants
    const conversation = await Conversation.findOne({
      where: {
        participants: JSON.stringify(participants), // Search based on sorted participants
      },
    });

    if (!conversation) {
      return res.status(200).json({
        conversationId: null,
        senderMessages: [],
        receiverMessages: [],
      });
    }

    // Parse the messages (if stored as a string, convert it back to an array)
    let messages = conversation.messages || [];
    if (typeof messages === 'string') {
      messages = JSON.parse(messages); // Ensure it's parsed as an array
    }

    // Separate the messages into sender and receiver categories
    const senderMessages = messages.filter(
      (msg) => msg.senderId === senderRoleId && msg.receiverId === receiverRoleId
    );
    const receiverMessages = messages.filter(
      (msg) => msg.senderId === receiverRoleId && msg.receiverId === senderRoleId
    );

    return res.status(200).json({
      conversationId: conversation.id,
      senderMessages,
      receiverMessages,
    });
  } catch (error) {
    console.error('Error while fetching messages:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};









