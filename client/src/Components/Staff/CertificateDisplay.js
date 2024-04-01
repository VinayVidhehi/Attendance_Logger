import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './CertificateDisplay.css'; // Import the CSS file for styling

const CertificateDisplay = () => {
    const [records, setRecords] = useState([]); // Initialize as an empty array
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();

    useEffect(() => {
        console.log(location.state.records);
        setRecords(location.state.records || []); // Ensure records is an array
    }, [location.state.records]);

    // Filter records based on the search query
    const filteredRecords = records.filter(record =>
        record && record.student_email && record.student_email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle search query changes
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div>
            <div className='search-container'>
                {/* Search bar */}
                <input
                    type="text"
                    placeholder="Search by student email..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="certificate-container">
                <h1>Certificate Display</h1>
           
                {filteredRecords.length > 0 ? (
                    filteredRecords.map((record, index) => (
                        <div key={index} className="certificate-record">
                            <h2>{record.type === 'medical' ? 'Medical Certificate' : 'Non-Medical Certificate'}</h2>
                            {record.type === 'medical' ? (
                                <p>
                                    Patient Email: {record.student_email}<br/>
                                    {record.reason}
                                </p>
                            ) : (<p>{record.student_email}<br/>
                                {record.reason}</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No records found</p>
                )}
            </div>
        </div>
    );
};

export default CertificateDisplay;
