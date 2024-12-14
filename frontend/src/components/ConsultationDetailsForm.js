import React, { useContext, useState } from 'react';
import axios from 'axios';
import { PatientContext } from './PatientContext';

const ConsultationDetails = ({ doctorId, selectedSlot, onClose }) => {
    const [images, setImages] = useState([]); 
    const [reason, setReason] = useState(''); 
    const [description, setDescription] = useState(''); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(''); 
    const {patientId}=useContext(PatientContext);
    console.log("Patient ID: ", patientId);  // For debugging


    const MAX_FILE_SIZE = 10 * 1024 * 1024; 
    const MAX_FILES = 5;

    const parseTimeString = (timeString) => {
        const [time, modifier] = timeString.split(' '); 
        let [hours, minutes] = time.split(':').map(Number);
    
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
    
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!reason.trim() || !description.trim()) {
            alert('Please provide both reason and description.');
            return;
        }
    
        if (images.length === 0) {
            alert('Please upload at least one image.');
            return;
        }
        const startTime = parseTimeString(selectedSlot.start);
        const endTime = parseTimeString(selectedSlot.end);

        const formData = new FormData();
        formData.append('patientId', patientId);
        console.log("if",patientId);
        
        formData.append('doctorId', doctorId);
        formData.append('doctorAvailabilityId', selectedSlot.id.split('-')[0]); 
        formData.append('reason', reason);
        formData.append('description', description);
 
        images.forEach((image) => {
            formData.append('images', image); 
        });
        
        formData.append('startTime', startTime); 
        formData.append('endTime', endTime); 

        try {
            setIsSubmitting(true);
            const response = await axios.post('http://localhost:5000/api/consultations/request', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            console.log('Consultation Request Response:', response);
            alert('Consultation requested successfully!');
            onClose();
        } catch (error) {
            console.error('Error requesting consultation:', error);
            alert('Failed to request consultation. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length + images.length > MAX_FILES) {
            setError(`You can only upload a maximum of ${MAX_FILES} images.`);
            setImages([]); 
            return; 
        }

        for (let file of files) {
            if (file.size > MAX_FILE_SIZE) {
                setError('One or more files exceed the maximum file size of 10MB.');
                setImages([]); 
                return;
            }
        }

        setImages((prevImages) => [...prevImages, ...files]);
        setError(''); 
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Consultation Details</h2>

            {error && <div className="mb-4 text-red-500">{error}</div>}

            {/* Reason and Description */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="reason">Reason for Consultation:</label>
                <input
                    id="reason"
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 w-full"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 w-full"
                    rows="4"
                />
            </div>

            {/* Image Upload */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="image">Upload Images:</label>
                <input
                    id="image"
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    className="w-full text-gray-500"
                />
                <ul className="mt-2">
                    {images.map((image, index) => (
                        <li key={index}>{image.name}</li>
                    ))}
                </ul>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                onClick={handleSubmit}
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Submitting...' : 'Request Consultation'}
            </button>

            {/* Cancel Button */}
            <button
                type="button"
                onClick={onClose}
                className="mt-4 w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
            >
                Cancel
            </button>
        </div>
    );
};

export default ConsultationDetails;
