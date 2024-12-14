import React from 'react';

const DoctorDashboard = () => {
    const username = localStorage.getItem('username');

    return (
        <div className="p-4">
            <h1 className="text-2xl text-teal-600 font-bold">Doctor Dashboard</h1>
            <p>Welcome, Dr. {username}. Here you can manage consultations and patients.</p>
        </div>
    );
};

export default DoctorDashboard;
