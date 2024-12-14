import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RequestConsultation from './RequestConsultation';

const DoctorList = ({  userRole }) => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);  

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/consultations/doctors', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                console.log('Fetched Doctors:', response.data);
                setDoctors(response.data);
            } catch (error) {
                alert('Failed to load doctors. Please try again later.');
            }
        };

        fetchDoctors();
    }, []);

    const handleConsult = async (doctorId) => {
        console.log('Consult button clicked for doctor ID:', doctorId);
        if (doctorId) {
            setSelectedDoctor(doctorId);
    
            try {
                const response = await axios.get(`http://localhost:5000/api/doctors/${doctorId}/availability`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                console.log('Fetched Availability:', response.data);
                setAvailableSlots(response.data);  
            } catch (error) {
                console.error('Error fetching availability:', error);
                alert('Failed to load doctor availability.');
            }
        } else {
            console.error('Doctor ID is undefined');
        }
    };
    

    const handleClose = () => {
        setSelectedDoctor(null);
        setAvailableSlots([]);  
    };

    return (
        <div className="relative p-4">
            <h2 className="text-2xl text-teal-600 font-bold mb-6">Available Doctors</h2>
            {doctors.length === 0 ? (
                <p>No doctors available at this time.</p>
            ) : (
                <ul className="space-y-4">
                    {doctors.map(doctor => (
                        <li 
                            key={doctor.id} 
                            className="flex justify-between items-center p-4 border border-gray-300 rounded-lg shadow-sm"
                        >
                            <div>
                                <h3 className="text-lg font-semibold">{doctor.name}</h3>
                                <p className="text-gray-600">{doctor.specialization}</p>
                            </div>
                            {userRole === 'patient' && (
                                <button 
                                    className="ml-4 p-2 bg-teal-500 text-white rounded hover:bg-green-600 transition duration-200" 
                                    onClick={() => handleConsult(doctor.id)}
                                >
                                    Consult
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            {selectedDoctor && (
                <RequestConsultation 
                    doctorId={selectedDoctor} 
                    availableSlots={availableSlots}  
                    onClose={handleClose} 
                />
            )}
        </div>
    );
};

export default DoctorList;
