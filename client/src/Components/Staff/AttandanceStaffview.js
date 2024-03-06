import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AttendanceStaffView = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [attendanceDates, setAttendanceDates] = useState([]);
    const [selectedAttendance, setSelectedAttendance] = useState('All'); // Initialize with 'All' as default
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.attendance) {
            const attendance = location.state.attendance;
            if (attendance.students && attendance.attendanceString) {
                setAttendanceData(attendance.students);
                setAttendanceDates(attendance.attendanceString);
            }
        }
    }, [location.state]);

    // Function to filter attendance data based on the selected attendance status
    const filteredAttendanceData = selectedAttendance === 'All' ?
        attendanceData :
        attendanceData.filter(student => {
            return attendanceDates.some(item => {
                const attendanceStatus = item.attendance[student.student_id - 1]; // Adjust index
                return attendanceStatus === selectedAttendance;
            });
        });

    return (
        <div>
            <h2>Attendance</h2>
            {/* Attendance filter dropdown */}
            <select value={selectedAttendance} onChange={(e) => setSelectedAttendance(e.target.value)}>
                <option value="All">All Attendance</option>
                <option value="0">Absent</option>
                <option value="1">Present</option>
                <option value="2">Class not taken</option>
            </select>
            <table>
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        {attendanceDates.map((item, index) => (
                            <th key={index}>{new Date(item.date).toLocaleDateString()}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredAttendanceData.map((student, index) => (
                        <tr key={index}>
                            <td>{student.student_id}</td>
                            <td>{student.student_name}</td>
                            {attendanceDates.map((item, idx) => (
                                <td key={idx}>
                                    {item.attendance[student.student_id - 1] === '0' ? 'Absent' :
                                     item.attendance[student.student_id - 1] === '1' ? 'Present' : 'Class not taken'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceStaffView;
