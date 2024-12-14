import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorConsultationStatus from './ConsultationStatusDoctor';

const DoctorConsultationRequests = () => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imageIndexes, setImageIndexes] = useState({});

    useEffect(() => {
        const fetchRequests = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://localhost:5000/api/doctors/requests', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.data && response.data.length === 0) {
                    setError('No consultation requests available.');
                }
                setRequests(response.data);
            } catch (error) {
                setError('Failed to load consultation requests.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const formatTime = (timeString) => {
        const date = new Date(`1970-01-01T${timeString}Z`);
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        return `${(hours % 12) || 12}:${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
    };

    const handleNext = (requestId) => {
        setImageIndexes((prev) => {
            const validImages = getValidImages(requestId);
            if (validImages.length === 0) return prev;
            
            const currentIndex = prev[requestId] || 0;
            const nextIndex = (currentIndex + 1) % validImages.length;
            return { ...prev, [requestId]: nextIndex };
        });
    };

    const handlePrev = (requestId) => {
        setImageIndexes((prev) => {
            const validImages = getValidImages(requestId);
            if (validImages.length === 0) return prev;

            const currentIndex = prev[requestId] || 0;
            const prevIndex = (currentIndex - 1 + validImages.length) % validImages.length;
            return { ...prev, [requestId]: prevIndex };
        });
    };

    const getValidImages = (requestId) => {
        const request = requests.find((r) => r.id === requestId);
        let images = [];
        try {
            images = JSON.parse(request?.imageUrl || '[]');
        } catch (error) {}
        return images.filter((image) => image?.trim());
    };

    const activeRequests = requests.filter((request) => request.status !== 'Completed');

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-teal-600 mb-4">Consultation Requests</h2>

            {isLoading ? (
                <p>Loading consultation requests...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : activeRequests.length === 0 ? (
                <p>No consultation requests available.</p>
            ) : (
                <ul className="space-y-4">
                    {activeRequests.map((request) => {
                        const validImages = getValidImages(request.id);
                        if (validImages.length === 0) return null;

                        const currentImageIndex = imageIndexes[request.id] || 0;

                        return (
                            <li 
                                key={request.id} 
                                className="flex bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden h-[300px]"
                            >
                                <div className="flex-1 p-4 flex flex-col justify-between">
                                    <h3 className="text-2xl font-semibold">{request.patientUsername}</h3>
                                    <p className="text-gray-600">
                                        <strong>Selected Date:</strong> {new Date(request.doctorAvailability.date).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>Requested Time:</strong> {formatTime(request.selectedTimeSlot.startTime)} - {formatTime(request.selectedTimeSlot.endTime)}
                                    </p>
                                    <p className="text-gray-600"><strong>Status:</strong> {request.status}</p>
                                    <p className="text-gray-600"><strong>Reason:</strong> {request.reason}</p>
                                    <p className="text-gray-600"><strong>Description:</strong> {request.description}</p>

                                    <DoctorConsultationStatus
                                        status={request.status}
                                        requestId={request.id}
                                        setRequests={setRequests}
                                    />
                                </div>

                                {/* Image Section */}
                                <div className="relative w-1/3 h-full">
                                    <img 
                                        src={`http://localhost:5000/${validImages[currentImageIndex]}`} 
                                        alt="Consultation" 
                                        className="w-full h-full object-cover" 
                                    />

                                    {/* Navigation buttons */}
                                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
                                        <button 
                                            onClick={() => handlePrev(request.id)} 
                                            className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                                        >
                                            &lt;
                                        </button>
                                    </div>
                                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
                                        <button 
                                            onClick={() => handleNext(request.id)} 
                                            className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                                        >
                                            &gt;
                                        </button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};


export default DoctorConsultationRequests;
