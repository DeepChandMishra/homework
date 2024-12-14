import React from 'react';

const Dashboard = () => {
    const username = localStorage.getItem('username');
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold text-teal-600 mb-4">Welcome, {username}</h2>
            <p>Select a doctor to request a consultation.</p>
        </div>
    );
};

export default Dashboard;
