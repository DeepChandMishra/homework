import React from 'react';
import axios from 'axios';

const DoctorConsultationStatus = ({ status, requestId, setRequests }) => {
    const handleStatusUpdate = async (requestId, newStatus) => {
        const token = localStorage.getItem('token'); 
        if (!token) {
            alert('You are not authenticated!');
            return;
        }

        try {
             await axios.put(
                `http://localhost:5000/api/doctors/requests/${requestId}/status`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req.id === requestId ? { ...req, status: newStatus } : req
                )
            );
            alert('Status updated successfully!');
        } catch (error) {
            console.error('Error updating status:', error);
            alert(`Failed to update status: ${error.response ? error.response.data.error : error.message}`);
        }
    };

    return (
        <div className="mt-4">
            {status === 'pending' && (
                <>
                    <button
                        onClick={() => handleStatusUpdate(requestId, 'Accepted')}
                        className="mr-2 p-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                    >
                        Accept
                    </button>
                    <button
                        onClick={() => handleStatusUpdate(requestId, 'Rejected')}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Reject
                    </button>
                </>
            )}
            {status === 'Accepted' && (
                <button
                    onClick={() => handleStatusUpdate(requestId, 'Completed')}
                    className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                >
                    Complete
                </button>
            )}
        </div>
    );
};

export default DoctorConsultationStatus;
