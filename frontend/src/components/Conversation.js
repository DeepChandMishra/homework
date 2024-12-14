import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Conversation = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    setLoadingConversations(true);
    if (role === 'patient') {
      // Fetch the list of doctors for the patient
      axios
        .get('http://localhost:5000/api/consultations/doctors-for-chat', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.doctors) {
            const doctorConversations = response.data.doctors.map((doctor) => ({
              id: doctor.doctorId,
              name: doctor.doctorName,
            }));
            setConversations(doctorConversations);
          }
          setLoadingConversations(false);
        })
        .catch((error) => {
          console.error('Error fetching doctor consultations:', error);
          setLoadingConversations(false);
        });
    } else if (role === 'doctor') {
      // Fetch the list of patients for the doctor
      axios
        .get('http://localhost:5000/api/consultations/patients-for-chat', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.length) {
            const patientConversations = response.data.map((patient) => ({
              id: patient.patientId,
              name: patient.patientName,
            }));
            setConversations(patientConversations);
          }
          setLoadingConversations(false);
        })
        .catch((error) => {
          console.error('Error fetching patient consultations:', error);
          setLoadingConversations(false);
        });
    }
  }, [role, token]);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {loadingConversations ? (
        <p className="text-center">Loading...</p>
      ) : conversations.length > 0 ? (
        conversations.map((conversation) => (
          <div
            key={conversation.id}
            className="p-2 cursor-pointer hover:bg-gray-300 rounded-md"
            onClick={() => onSelectConversation(conversation)} // Pass conversation to parent
          >
            <div className="font-semibold">{conversation.name}</div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">
          {role === 'patient'
            ? 'No doctors have accepted your consultation yet.'
            : 'No patients with accepted consultations yet.'}
        </p>
      )}
    </div>
  );
};

export default Conversation;
