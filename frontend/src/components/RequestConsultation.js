import React, { useState } from 'react';
import axios from 'axios';
import ConsultationDetails from './ConsultationDetailsForm'; 

const RequestConsultation = ({ doctorId, onClose }) => {
    const [availableSlots, setAvailableSlots] = useState([]); 
    const [selectedSlot, setSelectedSlot] = useState(null); 
    const [selectedDate, setSelectedDate] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);
    const [isSlotSelected, setIsSlotSelected] = useState(false);
    const [isConsultationRequested, setIsConsultationRequested] = useState(false); 

    // Function to fetch doctor availability based on selected date
    const fetchDoctorAvailability = async (date) => {
        setIsLoading(true);
        setAvailableSlots([]); 
        setSelectedSlot(null); 
        setIsSlotSelected(false);
    
        try {
            const response = await axios.get(`http://localhost:5000/api/consultations/getAvailableSlotsForAllPatients/${doctorId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            console.log("Fetched doctor availability:", response.data);  
            
            const doctorTime = response.data.availability;
            const consultations = response.data.consultations;
    
            const availableSlots = doctorTime.filter(slot => {
                return slot.date === date;  
            });
    
            const slots = availableSlots.flatMap((slot) => {
                return generateTimeSlots(
                    slot.date,
                    slot.startTime,
                    slot.endTime,
                    slot.id,
                    consultations // Pass consultations 
                );
            });
    
            setAvailableSlots(slots);
        } catch (error) {
            console.error('Error fetching doctor availability:', error);
            alert('Failed to load doctor availability. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const generateTimeSlots = (date, startTime, endTime, availabilityId, consultations) => {
        const slots = [];
        const start = new Date(`${date}T${startTime}Z`); 
        const end = new Date(`${date}T${endTime}Z`); 
    
        console.log(`Generating slots from ${start} to ${end}`); 
    
        let currentTime = start;
    
        if (currentTime >= end) {
            console.error('Invalid time range. Start time is greater than or equal to end time.');
            return slots;
        }
    
        const now = new Date();
    
        const isSlotAvailable = (slotStart, slotEnd) => {
            return consultations.every((consultation) => {
                const consultationStart = new Date(`${date}T${consultation.startTime}Z`);
                const consultationEnd = new Date(`${date}T${consultation.endTime}Z`);
    
                const isWithinConsultationRange = (slotStart >= consultationStart && slotEnd <= consultationEnd);
    
                const isRejected = consultation.status === 'Rejected';
    
                return !(isWithinConsultationRange && !isRejected);
            });
        };
    
        // Generate slots in 30-minute intervals
        while (currentTime < end) {
            const nextSlot = new Date(currentTime);
            nextSlot.setMinutes(currentTime.getMinutes() + 30); 
    
            if (nextSlot > end) {
                break; 
            }
    
           
            if (nextSlot.getTime() > now.getTime()) {
              
                const formattedStart = formatTime(currentTime);
                const formattedEnd = formatTime(nextSlot);
    
               
                if (isSlotAvailable(currentTime, nextSlot)) {
                    slots.push({
                        start: formattedStart,
                        end: formattedEnd,
                        id: `${availabilityId}-${currentTime.getTime()}`, 
                        startDateTime: currentTime, 
                    });
                }
            }
    
            currentTime = nextSlot; 
        }
    
        return slots;
    };
    
    
   
    const formatTime = (date) => {
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHour = hours % 12 || 12; // Convert 24-hour to 12-hour format
        return `${formattedHour}:${minutes} ${period}`;
    };
    
    // Function to handle slot selection
    const handleSlotSelection = (e) => {
        const selectedSlot = availableSlots.find(slot => slot.id === e.target.value);
        setSelectedSlot(selectedSlot); 
        setIsSlotSelected(true); 
    };

    const handleConsultationRequest = () => {
        setIsConsultationRequested(true); 
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                {/* If consultation is not requested, show date and slot selection form */}
                {!isConsultationRequested && !isSlotSelected && (
                    <>
                        <h2 className="text-lg font-semibold mb-4">Request a Consultation</h2>

                        {/* Date Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Select Date:</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    fetchDoctorAvailability(e.target.value); // Fetch availability   
                                }}
                                required
                                className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 w-full"
                            />
                        </div>

                        {/* Time Slot Selection */}
                        {selectedDate && !isSlotSelected && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Select Time Slot:</label>
                                {isLoading ? (
                                    <p>Loading available slots...</p> 
                                ) : (
                                    <>
                                        {availableSlots.length === 0 ? (
                                            <p className="text-red-500">No slots available for this date</p> 
                                        ) : (
                                            <select
                                                value={selectedSlot ? selectedSlot.id : ''}
                                                onChange={handleSlotSelection}
                                                required
                                                className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 w-full"
                                            >
                                                <option value="">Select a time slot</option>
                                                {availableSlots.map((slot) => (
                                                    <option key={slot.id} value={slot.id}>
                                                        {slot.start} - {slot.end}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {/* Cancel Button */}
                        <button
                            type="button"
                            onClick={onClose} 
                            className="mt-4 w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                        >
                            Cancel
                        </button>
                    </>
                )}

                {/* If a slot is selected, show the consultation details form */}
                {isSlotSelected && !isConsultationRequested && (
                    <ConsultationDetails
                        doctorId={doctorId}
                        selectedSlot={selectedSlot}
                        onClose={onClose} 
                        onConsultationSubmit={handleConsultationRequest} 
                    />
                )}
            </div>
        </div>
    );
};

export default RequestConsultation;
